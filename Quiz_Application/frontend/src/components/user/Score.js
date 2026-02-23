import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Score = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchResult();
    }, [id]);

    const fetchResult = async () => {
        try {
            const response = await api.get(`/results/${id}`);
            if (response.data.success) {
                setResult(response.data.result);
                setAnswers(response.data.answers);

                // Show confetti for high scores
                if (response.data.result.percentage >= 80) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);
                }
            }
        } catch (error) {
            console.error('Error fetching result:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getPerformanceMessage = (percentage) => {
        if (percentage >= 90) return { text: '🎉 Outstanding! You\'re a master!', color: '#4CAF50' };
        if (percentage >= 80) return { text: '⭐ Excellent work! Keep it up!', color: '#4CAF50' };
        if (percentage >= 70) return { text: '👍 Good job! You\'re doing well!', color: '#2196F3' };
        if (percentage >= 60) return { text: '✓ You passed! Keep practicing!', color: '#FF9800' };
        return { text: '💪 Don\'t give up! Try again!', color: '#F44336' };
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const performance = getPerformanceMessage(result.percentage);

    const styles = {
        container: {
            minHeight: 'calc(100vh - 70px)',
            background: '#f5f7fa',
            padding: '40px 20px'
        },
        maxWidth: {
            maxWidth: '900px',
            margin: '0 auto'
        },
        scoreCard: {
            background: '#fff',
            borderRadius: '24px',
            padding: '48px',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            animation: 'scaleIn 0.5s ease',
            position: 'relative',
            overflow: 'hidden'
        },
        confetti: {
            position: 'absolute',
            width: '10px',
            height: '10px',
            background: '#FFD700',
            animation: 'confettiFall 3s linear infinite'
        },
        performanceMessage: {
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '24px',
            color: performance.color
        },
        scoreCircle: {
            width: '200px',
            height: '200px',
            margin: '0 auto 32px',
            borderRadius: '50%',
            background: `conic-gradient(${performance.color} ${result.percentage * 3.6}deg, #e0e0e0 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'rotateIn 1s ease'
        },
        scoreInner: {
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        scoreValue: {
            fontSize: '48px',
            fontWeight: '700',
            color: '#333'
        },
        scoreLabel: {
            fontSize: '14px',
            color: '#999',
            marginTop: '4px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginTop: '32px'
        },
        statItem: {
            textAlign: 'center'
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#666'
        },
        passStatus: {
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '24px'
        },
        passed: {
            background: '#e8f5e9',
            color: '#4CAF50'
        },
        failed: {
            background: '#ffebee',
            color: '#F44336'
        },
        detailsCard: {
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.5s ease 0.2s both'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '24px'
        },
        questionItem: {
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '16px',
            border: '2px solid #e0e0e0',
            transition: 'all 0.3s ease'
        },
        questionCorrect: {
            background: '#e8f5e9',
            borderColor: '#4CAF50'
        },
        questionWrong: {
            background: '#ffebee',
            borderColor: '#F44336'
        },
        questionHeader: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px'
        },
        questionIcon: {
            fontSize: '24px',
            marginTop: '4px'
        },
        questionText: {
            flex: 1,
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
        },
        answerRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
            fontSize: '14px'
        },
        answerLabel: {
            fontWeight: '600',
            minWidth: '120px'
        },
        answerText: {
            flex: 1
        },
        buttonGroup: {
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
        },
        button: {
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block'
        },
        buttonPrimary: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
        },
        buttonSuccess: {
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
        },
        buttonSecondary: {
            background: '#fff',
            color: '#667eea',
            border: '2px solid #667eea'
        }
    };

    return (
        <>
            <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateIn {
          from { transform: rotate(-90deg); opacity: 0; }
          to { transform: rotate(0deg); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

            <div style={styles.container}>
                <div style={styles.maxWidth}>
                    {/* Score Card */}
                    <div style={styles.scoreCard}>
                        {showConfetti && (
                            <>
                                {[...Array(50)].map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            ...styles.confetti,
                                            left: `${Math.random() * 100}%`,
                                            background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)],
                                            animationDelay: `${Math.random() * 3}s`
                                        }}
                                    />
                                ))}
                            </>
                        )}

                        <h1 style={styles.performanceMessage}>{performance.text}</h1>

                        <div style={styles.scoreCircle}>
                            <div style={styles.scoreInner}>
                                <div style={styles.scoreValue}>{result.percentage}%</div>
                                <div style={styles.scoreLabel}>Your Score</div>
                            </div>
                        </div>

                        <div style={styles.statsGrid}>
                            <div style={styles.statItem}>
                                <div style={{ ...styles.statValue, color: '#4CAF50' }}>
                                    {result.correct_answers}
                                </div>
                                <div style={styles.statLabel}>Correct</div>
                            </div>

                            <div style={styles.statItem}>
                                <div style={{ ...styles.statValue, color: '#F44336' }}>
                                    {result.wrong_answers}
                                </div>
                                <div style={styles.statLabel}>Wrong</div>
                            </div>

                            <div style={styles.statItem}>
                                <div style={{ ...styles.statValue, color: '#2196F3' }}>
                                    {result.total_questions}
                                </div>
                                <div style={styles.statLabel}>Total</div>
                            </div>

                            <div style={styles.statItem}>
                                <div style={{ ...styles.statValue, color: '#FF9800' }}>
                                    {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
                                </div>
                                <div style={styles.statLabel}>Time Taken</div>
                            </div>
                        </div>

                        <div style={{
                            ...styles.passStatus,
                            ...(result.passed ? styles.passed : styles.failed)
                        }}>
                            {result.passed ? '✓ PASSED' : '✗ FAILED'}
                        </div>

                        {result.passed && (
                            <div style={{ marginTop: '16px', fontSize: '16px', color: '#4CAF50', fontWeight: '600' }}>
                                🎉 You earned {result.points_earned} points!
                            </div>
                        )}
                    </div>

                    {/* Question Review */}
                    <div style={styles.detailsCard}>
                        <h2 style={styles.sectionTitle}>Question Review</h2>

                        {answers.map((answer, index) => (
                            <div
                                key={answer.answer_id}
                                style={{
                                    ...styles.questionItem,
                                    ...(answer.is_correct ? styles.questionCorrect : styles.questionWrong)
                                }}
                            >
                                <div style={styles.questionHeader}>
                                    <span style={styles.questionIcon}>
                                        {answer.is_correct ? '✅' : '❌'}
                                    </span>
                                    <div style={styles.questionText}>
                                        {index + 1}. {answer.question_text}
                                    </div>
                                </div>

                                <div style={{ marginLeft: '36px' }}>
                                    <div style={styles.answerRow}>
                                        <span style={styles.answerLabel}>Your Answer:</span>
                                        <span style={styles.answerText}>
                                            {answer.selected_answer ? (
                                                <>
                                                    <strong>{answer.selected_label}.</strong> {answer.selected_answer}
                                                </>
                                            ) : (
                                                <em style={{ color: '#999' }}>Not answered</em>
                                            )}
                                        </span>
                                    </div>

                                    {!answer.is_correct && (
                                        <div style={{ ...styles.answerRow, color: '#4CAF50' }}>
                                            <span style={styles.answerLabel}>Correct Answer:</span>
                                            <span style={styles.answerText}>
                                                <strong>{answer.correct_label}.</strong> {answer.correct_answer}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={styles.buttonGroup}>
                        <Link to={`/quiz/${result.quiz_id}`} style={{ ...styles.button, ...styles.buttonSuccess }}>
                            🔄 Retake Quiz
                        </Link>
                        <Link to="/dashboard" style={{ ...styles.button, ...styles.buttonPrimary }}>
                            📚 View All Quizzes
                        </Link>
                        <Link to="/history" style={{ ...styles.button, ...styles.buttonSecondary }}>
                            📊 View History
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Score;
