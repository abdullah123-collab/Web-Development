import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Questions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const startTime = useRef(Date.now());
    const timerRef = useRef(null);

    useEffect(() => {
        fetchQuiz();

        // Anti-cheat: Prevent right-click
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // Anti-cheat: Detect F12 and other dev tools shortcuts
        const handleKeyDown = (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                alert('⚠️ Developer tools are disabled during the quiz!');
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Anti-cheat: Detect tab switching
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        alert('⚠️ You have switched tabs too many times. The quiz will be auto-submitted.');
                        handleSubmit(true);
                    } else {
                        alert(`⚠️ Warning: Tab switching detected! (${newCount}/3)`);
                    }
                    return newCount;
                });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Prevent page refresh/back
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmit(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft]);

    const fetchQuiz = async () => {
        try {
            const response = await api.get(`/quizzes/${id}`);
            if (response.data.success) {
                setQuiz(response.data.quiz);
                setQuestions(response.data.questions);
                setTimeLeft(response.data.quiz.time_limit * 60); // Convert to seconds
            }
        } catch (error) {
            console.error('Error fetching quiz:', error);
            alert('Failed to load quiz');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, optionId) => {
        setAnswers({
            ...answers,
            [questionId]: optionId
        });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit) {
            const confirmed = window.confirm('Are you sure you want to submit the quiz? You cannot change your answers after submission.');
            if (!confirmed) return;
        }

        setSubmitting(true);
        const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);

        const formattedAnswers = questions.map(q => ({
            question_id: q.question_id,
            selected_option_id: answers[q.question_id] || null
        }));

        try {
            const response = await api.post('/quiz/submit', {
                quiz_id: parseInt(id),
                answers: formattedAnswers,
                time_taken: timeTaken
            });

            if (response.data.success) {
                navigate(`/result/${response.data.result.result_id}`);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeLeft > 300) return '#4CAF50';
        if (timeLeft > 60) return '#FF9800';
        return '#F44336';
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const styles = {
        container: {
            minHeight: 'calc(100vh - 70px)',
            background: '#f5f7fa',
            padding: '20px'
        },
        quizContainer: {
            maxWidth: '900px',
            margin: '0 auto'
        },
        header: {
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.5s ease'
        },
        headerTop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        quizTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#333'
        },
        timer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            animation: timeLeft < 60 ? 'pulse 1s infinite' : 'none'
        },
        questionCounter: {
            fontSize: '16px',
            color: '#666',
            marginBottom: '12px'
        },
        progressBar: {
            width: '100%',
            height: '8px',
            background: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
        },
        progressFill: {
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            transition: 'width 0.3s ease'
        },
        questionCard: {
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.5s ease'
        },
        questionText: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '24px',
            lineHeight: '1.6'
        },
        optionsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        option: {
            padding: '16px 20px',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px'
        },
        optionSelected: {
            borderColor: '#667eea',
            background: '#f0f4ff'
        },
        optionHover: {
            borderColor: '#667eea',
            transform: 'translateX(4px)'
        },
        optionLabel: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px',
            color: '#666'
        },
        optionLabelSelected: {
            background: '#667eea',
            color: '#fff'
        },
        navigation: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px'
        },
        button: {
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        buttonPrimary: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
        },
        buttonSecondary: {
            background: '#fff',
            color: '#667eea',
            border: '2px solid #667eea'
        },
        buttonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed'
        },
        warningBanner: {
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.5s ease'
        }
    };

    return (
        <>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

            <div style={styles.container}>
                <div style={styles.quizContainer}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerTop}>
                            <div>
                                <h1 style={styles.quizTitle}>{quiz?.title}</h1>
                                <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>
                                    {quiz?.category} • {quiz?.difficulty}
                                </div>
                            </div>
                            <div style={{ ...styles.timer, background: getTimerColor() }}>
                                <span>⏱️</span>
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                        <div style={styles.questionCounter}>
                            Question {currentQuestion + 1} of {questions.length}
                        </div>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Tab Switch Warning */}
                    {tabSwitchCount > 0 && (
                        <div style={styles.warningBanner}>
                            <span style={{ fontSize: '24px' }}>⚠️</span>
                            <div>
                                <strong>Warning:</strong> Tab switching detected ({tabSwitchCount}/3).
                                The quiz will auto-submit after 3 warnings.
                            </div>
                        </div>
                    )}

                    {/* Question Card */}
                    <div style={styles.questionCard}>
                        <div style={styles.questionText}>
                            {currentQuestion + 1}. {currentQ?.question_text}
                        </div>

                        <div style={styles.optionsContainer}>
                            {currentQ?.options.map((option) => {
                                const isSelected = answers[currentQ.question_id] === option.option_id;
                                return (
                                    <div
                                        key={option.option_id}
                                        style={{
                                            ...styles.option,
                                            ...(isSelected && styles.optionSelected)
                                        }}
                                        onClick={() => handleAnswerSelect(currentQ.question_id, option.option_id)}
                                        onMouseEnter={(e) => !isSelected && Object.assign(e.currentTarget.style, styles.optionHover)}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.borderColor = '#e0e0e0';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }
                                        }}
                                    >
                                        <div style={{
                                            ...styles.optionLabel,
                                            ...(isSelected && styles.optionLabelSelected)
                                        }}>
                                            {option.option_label}
                                        </div>
                                        <span>{option.option_text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div style={styles.navigation}>
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            style={{
                                ...styles.button,
                                ...styles.buttonSecondary,
                                ...(currentQuestion === 0 && styles.buttonDisabled)
                            }}
                        >
                            ← Previous
                        </button>

                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting}
                                style={{
                                    ...styles.button,
                                    ...styles.buttonPrimary,
                                    ...(submitting && styles.buttonDisabled)
                                }}
                            >
                                {submitting ? 'Submitting...' : '✓ Submit Quiz'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                style={{
                                    ...styles.button,
                                    ...styles.buttonPrimary
                                }}
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Questions;
