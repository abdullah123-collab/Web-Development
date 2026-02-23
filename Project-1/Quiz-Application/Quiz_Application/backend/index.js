const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./config/db'); // Ensure this file exists
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('❌ No token provided in Authorization header');
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    console.log('🔍 Verifying token:', token.substring(0, 50) + '...');
    console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('❌ Token verification failed:', err.message);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
        console.log('✅ Token verified. Decoded:', decoded);
        req.userId = decoded.id;
        req.userType = decoded.type;
        next();
    });
};

// ==================== AUTHENTICATION ROUTES ====================

// User Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const token = jwt.sign(
            { id: result.insertId, type: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: result.insertId, name, email, level: 1, total_points: 0 }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.user_id, type: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                level: user.level,
                total_points: user.total_points
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        console.log('📝 Admin login attempt:', req.body.username);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (admins.length === 0) {
            console.log('❌ Admin not found:', username);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const admin = admins[0];
        console.log('✅ Admin found:', admin.username, 'ID:', admin.admin_id);
        
        const validPassword = await bcrypt.compare(password, admin.password);

        if (!validPassword) {
            console.log('❌ Invalid password for:', username);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log('✅ Password valid. Creating token...');
        const token = jwt.sign(
            { id: admin.admin_id, type: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ Token created:', token.substring(0, 50) + '...');
        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: admin.admin_id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ==================== QUIZ ROUTES ====================

// Get all active quizzes
app.get('/api/quizzes', verifyToken, async (req, res) => {
    try {
        const { category, difficulty, search } = req.query;

        let query = `
      SELECT q.*, 
        (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
        (SELECT MAX(percentage) FROM result WHERE quiz_id = q.quiz_id AND user_id = ?) as best_score
      FROM quiz q
      WHERE q.is_active = TRUE
    `;
        const params = [req.userId];

        if (category) {
            query += ' AND q.category = ?';
            params.push(category);
        }

        if (difficulty) {
            query += ' AND q.difficulty = ?';
            params.push(difficulty);
        }

        if (search) {
            query += ' AND (q.title LIKE ? OR q.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY q.created_at DESC';

        const [quizzes] = await db.query(query, params);

        res.json({ success: true, quizzes });
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get quiz details with questions
// ✅ FIXED: Solves "MariaDB doesn't support LIMIT in subquery" error
app.get('/api/quizzes/:id', verifyToken, async (req, res) => {
    try {
        const quizId = req.params.id;

        // 1. Get Quiz Details
        const [quizzes] = await db.query('SELECT * FROM quiz WHERE quiz_id = ? AND is_active = TRUE', [quizId]);
        if (quizzes.length === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // 2. Get 10 Random Question IDs FIRST (Step 1 of fix)
        const [randomQuestions] = await db.query(`
            SELECT question_id FROM questions
            WHERE quiz_id = ?
            ORDER BY RAND()
            LIMIT 10
        `, [quizId]);

        if (randomQuestions.length === 0) {
            return res.json({
                success: true,
                quiz: quizzes[0],
                questions: []
            });
        }

        // Extract IDs to use in the next query
        const questionIds = randomQuestions.map(q => q.question_id);

        // 3. Fetch details + options for ONLY those 10 questions (Step 2 of fix)
        const [rows] = await db.query(`
            SELECT q.*, o.option_id, o.option_text, o.option_label
            FROM questions q
            LEFT JOIN options o ON q.question_id = o.question_id
            WHERE q.question_id IN (?)
            ORDER BY q.order_number, o.option_label
        `, [questionIds]);

        // 4. Transform flat data into nested JSON manually
        const questionsMap = new Map();

        rows.forEach(row => {
            if (!questionsMap.has(row.question_id)) {
                questionsMap.set(row.question_id, {
                    question_id: row.question_id,
                    quiz_id: row.quiz_id,
                    question_text: row.question_text,
                    question_type: row.question_type,
                    points: row.points,
                    order_number: row.order_number,
                    options: []
                });
            }

            if (row.option_id) {
                questionsMap.get(row.question_id).options.push({
                    option_id: row.option_id,
                    option_text: row.option_text,
                    option_label: row.option_label
                });
            }
        });

        const questions = Array.from(questionsMap.values());

        res.json({
            success: true,
            quiz: quizzes[0],
            questions
        });
    } catch (error) {
        console.error('Get quiz details error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Submit quiz answers
app.post('/api/quiz/submit', verifyToken, async (req, res) => {
    try {
        const { quiz_id, answers, time_taken } = req.body;

        const [quizzes] = await db.query('SELECT * FROM quiz WHERE quiz_id = ?', [quiz_id]);
        if (quizzes.length === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        const quiz = quizzes[0];

        // Extract question IDs from answers array
        const answeredQuestionIds = answers.map(a => a.question_id);

        if (answeredQuestionIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No answers provided' });
        }

        // Get only the questions that were answered with correct answers
        const [questions] = await db.query(`
      SELECT q.question_id, q.points, o.option_id as correct_option_id
      FROM questions q
      JOIN options o ON q.question_id = o.question_id
      WHERE q.question_id IN (?) AND o.is_correct = TRUE
    `, [answeredQuestionIds]);

        let correct_answers = 0;
        let wrong_answers = 0;
        let total_score = 0;
        const userAnswers = [];

        questions.forEach(question => {
            const userAnswer = answers.find(a => a.question_id === question.question_id);
            const isCorrect = userAnswer && userAnswer.selected_option_id === question.correct_option_id;

            if (isCorrect) {
                correct_answers++;
                total_score += question.points;
            } else {
                wrong_answers++;
            }

            userAnswers.push({
                question_id: question.question_id,
                selected_option_id: userAnswer?.selected_option_id || null,
                is_correct: isCorrect
            });
        });

        const total_questions = questions.length;
        const percentage = total_questions > 0 ? (correct_answers / total_questions) * 100 : 0;
        const passed = percentage >= quiz.passing_score;
        const points_earned = passed ? quiz.points : 0;

        // Insert result
        const [resultInsert] = await db.query(`
      INSERT INTO result (user_id, quiz_id, score, total_questions, correct_answers, wrong_answers, time_taken, percentage, passed, points_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.userId, quiz_id, total_score, total_questions, correct_answers, wrong_answers, time_taken, percentage, passed, points_earned]);

        const result_id = resultInsert.insertId;

        // Insert user answers
        if (userAnswers.length > 0) {
            const values = userAnswers.map(a => [result_id, a.question_id, a.selected_option_id, a.is_correct]);
            await db.query(`
                INSERT INTO user_answers (result_id, question_id, selected_option_id, is_correct)
                VALUES ?
            `, [values]);
        }

        // Update user points and level if passed
        if (passed) {
            await db.query(`
        UPDATE users 
        SET total_points = total_points + ?,
            level = FLOOR((total_points + ?) / 100) + 1
        WHERE user_id = ?
      `, [points_earned, points_earned, req.userId]);

            // Fire and forget achievement check (don't await to speed up response)
            checkAchievements(req.userId).catch(err => console.error(err));
        }

        res.json({
            success: true,
            message: 'Quiz submitted successfully',
            result: {
                result_id,
                score: total_score,
                total_questions,
                correct_answers,
                wrong_answers,
                percentage: percentage.toFixed(2),
                passed,
                points_earned,
                time_taken
            }
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get result details
app.get('/api/results/:id', verifyToken, async (req, res) => {
    try {
        const resultId = req.params.id;

        const [results] = await db.query(`
      SELECT r.*, q.title as quiz_title, q.category
      FROM result r
      JOIN quiz q ON r.quiz_id = q.quiz_id
      WHERE r.result_id = ? AND r.user_id = ?
    `, [resultId, req.userId]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        const [answers] = await db.query(`
      SELECT ua.*, 
        q.question_text, q.question_type,
        o.option_text as selected_answer,
        o.option_label as selected_label,
        (SELECT option_text FROM options WHERE question_id = q.question_id AND is_correct = TRUE) as correct_answer,
        (SELECT option_label FROM options WHERE question_id = q.question_id AND is_correct = TRUE) as correct_label
      FROM user_answers ua
      JOIN questions q ON ua.question_id = q.question_id
      LEFT JOIN options o ON ua.selected_option_id = o.option_id
      WHERE ua.result_id = ?
      ORDER BY q.order_number
    `, [resultId]);

        res.json({
            success: true,
            result: results[0],
            answers
        });
    } catch (error) {
        console.error('Get result error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user quiz history
app.get('/api/user/history', verifyToken, async (req, res) => {
    try {
        const [history] = await db.query(`
      SELECT r.*, q.title, q.category, q.difficulty
      FROM result r
      JOIN quiz q ON r.quiz_id = q.quiz_id
      WHERE r.user_id = ?
      ORDER BY r.played_at DESC
    `, [req.userId]);

        const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_quizzes,
        COALESCE(AVG(percentage), 0) as average_score,
        COALESCE(SUM(points_earned), 0) as total_points,
        COUNT(CASE WHEN passed = TRUE THEN 1 END) as passed_count
      FROM result
      WHERE user_id = ?
    `, [req.userId]);

        res.json({
            success: true,
            history,
            statistics: stats[0]
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query(`
      SELECT user_id, name, email, avatar, level, total_points, created_at
      FROM users
      WHERE user_id = ?
    `, [req.userId]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const [achievements] = await db.query(`
      SELECT a.*, ua.earned_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.achievement_id
      WHERE ua.user_id = ?
      ORDER BY ua.earned_at DESC
    `, [req.userId]);

        const [performance] = await db.query(`
      SELECT q.category, 
        COUNT(*) as attempts,
        AVG(r.percentage) as avg_score,
        MAX(r.percentage) as best_score
      FROM result r
      JOIN quiz q ON r.quiz_id = q.quiz_id
      WHERE r.user_id = ?
      GROUP BY q.category
    `, [req.userId]);

        res.json({
            success: true,
            user: users[0],
            achievements,
            performance
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update user profile
app.put('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const { name, avatar } = req.body;

        await db.query(`
      UPDATE users
      SET name = COALESCE(?, name),
          avatar = COALESCE(?, avatar)
      WHERE user_id = ?
    `, [name, avatar, req.userId]);

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ==================== ADMIN ROUTES ====================

// Get dashboard statistics
app.get('/api/admin/dashboard', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM quiz) as total_quizzes,
        (SELECT COUNT(*) FROM questions) as total_questions,
        (SELECT COUNT(*) FROM result WHERE DATE(played_at) = CURDATE()) as attempts_today,
        (SELECT COALESCE(AVG(percentage), 0) FROM result) as average_score
    `);

        const [recentActivity] = await db.query(`
      SELECT r.result_id, r.percentage, r.played_at, u.name as user_name, q.title as quiz_title
      FROM result r
      JOIN users u ON r.user_id = u.user_id
      JOIN quiz q ON r.quiz_id = q.quiz_id
      ORDER BY r.played_at DESC
      LIMIT 10
    `);

        res.json({
            success: true,
            statistics: stats[0],
            recentActivity
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all quizzes (admin)
app.get('/api/admin/quizzes', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const [quizzes] = await db.query(`
      SELECT q.*, 
        (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
        (SELECT COUNT(*) FROM result WHERE quiz_id = q.quiz_id) as attempt_count
      FROM quiz q
      ORDER BY q.created_at DESC
    `);

        res.json({ success: true, quizzes });
    } catch (error) {
        console.error('Get admin quizzes error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create quiz
app.post('/api/admin/quiz', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { title, description, category, difficulty, time_limit, passing_score, points, is_active } = req.body;

        const [result] = await db.query(`
      INSERT INTO quiz (title, description, category, difficulty, time_limit, passing_score, points, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, category, difficulty, time_limit, passing_score, points, is_active]);

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            quiz_id: result.insertId
        });
    } catch (error) {
        console.error('Create quiz error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update quiz
app.put('/api/admin/quiz/:id', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const quizId = req.params.id;
        const { title, description, category, difficulty, time_limit, passing_score, points, is_active } = req.body;

        await db.query(`
      UPDATE quiz
      SET title = ?, description = ?, category = ?, difficulty = ?, 
          time_limit = ?, passing_score = ?, points = ?, is_active = ?
      WHERE quiz_id = ?
    `, [title, description, category, difficulty, time_limit, passing_score, points, is_active, quizId]);

        res.json({ success: true, message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Update quiz error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete quiz
app.delete('/api/admin/quiz/:id', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        await db.query('DELETE FROM quiz WHERE quiz_id = ?', [req.params.id]);

        res.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Leaderboard (Top 10 Students)
app.get('/api/leaderboard', verifyToken, async (req, res) => {
    try {
        // Fetch top 10 users sorted by points (highest first)
        const [leaders] = await db.query(`
            SELECT user_id, name, avatar, total_points, level 
            FROM users 
            ORDER BY total_points DESC 
            LIMIT 10
        `);
        res.json({ success: true, leaders });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get questions for a quiz (Admin) - FIXED for Compatibility
app.get('/api/admin/quiz/:id/questions', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        // Fetch flat data
        const [rows] = await db.query(`
            SELECT q.*, 
                o.option_id, o.option_text, o.option_label, o.is_correct
            FROM questions q
            LEFT JOIN options o ON q.question_id = o.question_id
            WHERE q.quiz_id = ?
            ORDER BY q.order_number, o.option_label
        `, [req.params.id]);

        // Transform manually in JS
        const questionsMap = new Map();
        rows.forEach(row => {
            if (!questionsMap.has(row.question_id)) {
                questionsMap.set(row.question_id, {
                    question_id: row.question_id,
                    quiz_id: row.quiz_id,
                    question_text: row.question_text,
                    question_type: row.question_type,
                    points: row.points,
                    order_number: row.order_number,
                    options: []
                });
            }
            if (row.option_id) {
                questionsMap.get(row.question_id).options.push({
                    option_id: row.option_id,
                    option_text: row.option_text,
                    option_label: row.option_label,
                    is_correct: row.is_correct
                });
            }
        });

        res.json({ success: true, questions: Array.from(questionsMap.values()) });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create question
app.post('/api/admin/question', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { quiz_id, question_text, question_type, points, order_number, options } = req.body;

        const [result] = await db.query(`
      INSERT INTO questions (quiz_id, question_text, question_type, points, order_number)
      VALUES (?, ?, ?, ?, ?)
    `, [quiz_id, question_text, question_type, points, order_number]);

        const question_id = result.insertId;

        if (options && options.length > 0) {
            const values = options.map(o => [question_id, o.option_text, o.option_label, o.is_correct]);
            await db.query(`
                INSERT INTO options (question_id, option_text, option_label, is_correct)
                VALUES ?
            `, [values]);
        }

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question_id
        });
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete question
app.delete('/api/admin/question/:id', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        await db.query('DELETE FROM questions WHERE question_id = ?', [req.params.id]);

        res.json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all students
app.get('/api/admin/students', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const [students] = await db.query(`
      SELECT u.*, 
        (SELECT COUNT(*) FROM result WHERE user_id = u.user_id) as quiz_attempts,
        (SELECT COALESCE(AVG(percentage), 0) FROM result WHERE user_id = u.user_id) as avg_score
      FROM users u
      ORDER BY u.created_at DESC
    `);

        res.json({ success: true, students });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get student details
app.get('/api/admin/students/:id', verifyToken, async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const [students] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);

        if (students.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const [attempts] = await db.query(`
      SELECT r.*, q.title, q.category
      FROM result r
      JOIN quiz q ON r.quiz_id = q.quiz_id
      WHERE r.user_id = ?
      ORDER BY r.played_at DESC
    `, [req.params.id]);

        res.json({
            success: true,
            student: students[0],
            attempts
        });
    } catch (error) {
        console.error('Get student details error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ==================== HELPER FUNCTIONS ====================

async function checkAchievements(userId) {
    try {
        const [stats] = await db.query(`
      SELECT 
        COUNT(*) as quiz_count,
        AVG(percentage) as avg_score,
        MAX(percentage) as max_score,
        SUM(points_earned) as total_points
      FROM result
      WHERE user_id = ?
    `, [userId]);

        const userStats = stats[0];
        const [achievements] = await db.query('SELECT * FROM achievements');

        for (const achievement of achievements) {
            const [existing] = await db.query(`
        SELECT * FROM user_achievements 
        WHERE user_id = ? AND achievement_id = ?
      `, [userId, achievement.achievement_id]);

            if (existing.length > 0) continue;

            let qualifies = false;

            switch (achievement.requirement_type) {
                case 'quiz_count':
                    qualifies = userStats.quiz_count >= achievement.requirement_value;
                    break;
                case 'score_average':
                    qualifies = userStats.avg_score >= achievement.requirement_value;
                    break;
                case 'perfect_score':
                    qualifies = userStats.max_score >= achievement.requirement_value;
                    break;
                case 'points':
                    qualifies = userStats.total_points >= achievement.requirement_value;
                    break;
            }

            if (qualifies) {
                await db.query(`
          INSERT INTO user_achievements (user_id, achievement_id)
          VALUES (?, ?)
        `, [userId, achievement.achievement_id]);
            }
        }
    } catch (error) {
        console.error('Check achievements error:', error);
    }
}

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});