import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Dashboard = () => {
    const { admin, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setError('');
        try {
            const [statsRes, quizzesRes, studentsRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/quizzes'),
                api.get('/admin/students')
            ]);

            if (statsRes.data.success) setStats(statsRes.data.statistics);
            if (quizzesRes.data.success) setQuizzes(quizzesRes.data.quizzes);
            if (studentsRes.data.success) setStudents(studentsRes.data.students);
        } catch (error) {
            console.error('Error fetching data:', error);

            // If server is offline or authentication fails, show mock data instead of error
            if (!error.response || error.response?.status === 401) {
                // Network error or auth error - show empty dashboard
                setStats({
                    total_users: 0,
                    total_quizzes: 0,
                    total_questions: 0,
                    attempts_today: 0,
                    average_score: 0
                });
                setQuizzes([]);
                setStudents([]);
                if (error.response?.status === 401) {
                    setError('⚠️ Invalid or expired token. Backend authentication failed. Please ensure the backend server is running and configured correctly.');
                } else {
                    setError('⚠️ Backend server is offline. Showing empty dashboard. You can still create quizzes, but they won\'t be saved until the server is running.');
                }
            } else {
                setError(error.response?.data?.message || 'Failed to load dashboard data. Please refresh the page.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;
        setError('');
        setSuccess('');

        try {
            await api.delete(`/admin/quiz/${id}`);
            setSuccess('Quiz deleted successfully!');
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete quiz. Please try again.');
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: '#f5f7fa'
        },
        header: {
            background: '#fff',
            padding: '20px 40px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        logo: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e3c72'
        },
        content: {
            padding: '40px',
            maxWidth: '1400px',
            margin: '0 auto'
        },
        title: {
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
        },
        statCard: {
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e3c72',
            marginBottom: '8px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#666'
        },
        section: {
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: '600'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            textAlign: 'left',
            padding: '12px',
            borderBottom: '2px solid #e0e0e0',
            fontWeight: '600',
            fontSize: '14px'
        },
        td: {
            padding: '12px',
            borderBottom: '1px solid #e0e0e0',
            fontSize: '14px'
        },
        button: {
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '8px'
        },
        btnPrimary: {
            background: '#1e3c72',
            color: '#fff'
        },
        btnDanger: {
            background: '#F44336',
            color: '#fff'
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><div className="spinner"></div></div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.logo}>🎓 QuizMaster Pro - Admin</div>
                <div>
                    <span style={{ marginRight: '20px' }}>Welcome, {admin?.username}</span>
                    <button onClick={logout} style={{ ...styles.button, ...styles.btnDanger }}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                <h1 style={styles.title}>Dashboard</h1>
                <p style={{ color: '#666', marginBottom: '32px' }}>Manage quizzes, questions, and view analytics</p>

                {error && <div style={{ padding: '12px', background: '#ffebee', borderRadius: '8px', color: '#F44336', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
                {success && <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px', color: '#4CAF50', fontSize: '14px', marginBottom: '16px' }}>{success}</div>}

                {/* Statistics */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>{stats?.total_users || 0}</div>
                        <div style={styles.statLabel}>Total Users</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>{stats?.total_quizzes || 0}</div>
                        <div style={styles.statLabel}>Total Quizzes</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>{stats?.total_questions || 0}</div>
                        <div style={styles.statLabel}>Total Questions</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>{stats?.attempts_today || 0}</div>
                        <div style={styles.statLabel}>Attempts Today</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>{Math.round(stats?.average_score || 0)}%</div>
                        <div style={styles.statLabel}>Average Score</div>
                    </div>
                </div>

                {/* Quizzes */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Quizzes</h2>
                        <Link to="/quiz/add"><button style={{ ...styles.button, ...styles.btnPrimary }}>+ Add Quiz</button></Link>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Category</th>
                                <th style={styles.th}>Difficulty</th>
                                <th style={styles.th}>Questions</th>
                                <th style={styles.th}>Attempts</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map(quiz => (
                                <tr key={quiz.quiz_id}>
                                    <td style={styles.td}>{quiz.title}</td>
                                    <td style={styles.td}>{quiz.category}</td>
                                    <td style={styles.td}>{quiz.difficulty}</td>
                                    <td style={styles.td}>{quiz.question_count}</td>
                                    <td style={styles.td}>{quiz.attempt_count}</td>
                                    <td style={styles.td}>{quiz.is_active ? '✓ Active' : '✗ Inactive'}</td>
                                    <td style={styles.td}>
                                        <Link to={`/quiz/${quiz.quiz_id}/questions`}>
                                            <button style={{ ...styles.button, ...styles.btnPrimary }}>Manage</button>
                                        </Link>
                                        <button onClick={() => handleDeleteQuiz(quiz.quiz_id)} style={{ ...styles.button, ...styles.btnDanger }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Students */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Recent Students</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Level</th>
                                <th style={styles.th}>Points</th>
                                <th style={styles.th}>Attempts</th>
                                <th style={styles.th}>Avg Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.slice(0, 10).map(student => (
                                <tr key={student.user_id}>
                                    <td style={styles.td}>{student.name}</td>
                                    <td style={styles.td}>{student.email}</td>
                                    <td style={styles.td}>{student.level}</td>
                                    <td style={styles.td}>{student.total_points}</td>
                                    <td style={styles.td}>{student.quiz_attempts}</td>
                                    <td style={styles.td}>{Math.round(student.avg_score || 0)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
