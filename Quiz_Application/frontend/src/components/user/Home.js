import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Home = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', difficulty: '', search: '' });
    const [stats, setStats] = useState({
        totalCompleted: 0,
        averageScore: 0,
        achievements: 0,
        rank: 'Beginner'
    });

    useEffect(() => {
        fetchQuizzes();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filter.category) params.append('category', filter.category);
            if (filter.difficulty) params.append('difficulty', filter.difficulty);
            if (filter.search) params.append('search', filter.search);

            const response = await api.get(`/quizzes?${params.toString()}`);
            if (response.data.success) {
                setQuizzes(response.data.quizzes);
            }
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/user/history');
            if (response.data.success) {
                const { statistics } = response.data;
                setStats({
                    totalCompleted: statistics.total_quizzes || 0,
                    averageScore: Math.round(statistics.average_score || 0),
                    achievements: 0, // Will be updated when we fetch achievements
                    rank: getRank(statistics.average_score || 0)
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const getRank = (avgScore) => {
        if (avgScore >= 90) return 'Expert';
        if (avgScore >= 75) return 'Advanced';
        if (avgScore >= 60) return 'Intermediate';
        return 'Beginner';
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return '#4CAF50';
            case 'intermediate': return '#FF9800';
            case 'advanced': return '#F44336';
            default: return '#2196F3';
        }
    };

    const difficulties = ['beginner', 'intermediate', 'advanced'];

    const styles = {
        container: {
            minHeight: 'calc(100vh - 70px)',
            background: '#f5f7fa',
            padding: '40px 24px'
        },
        maxWidth: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        welcome: {
            marginBottom: '32px',
            animation: 'fadeIn 0.5s ease'
        },
        greeting: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '8px'
        },
        subGreeting: {
            fontSize: '16px',
            color: '#666'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
        },
        statCard: {
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.5s ease'
        },
        statCardHover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)'
        },
        statIcon: {
            fontSize: '32px',
            marginBottom: '12px'
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#999'
        },
        filterSection: {
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        filterTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#333'
        },
        filterGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
        },
        select: {
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backgroundColor: '#fff',
            cursor: 'pointer'
        },
        searchInput: {
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
            transition: 'all 0.3s ease',
            width: '100%'
        },
        quizzesSection: {
            marginBottom: '40px'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '24px'
        },
        quizGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
        },
        quizCard: {
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            animation: 'fadeIn 0.5s ease'
        },
        quizCardHover: {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
        },
        quizHeader: {
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            position: 'relative'
        },
        quizCategory: {
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
            opacity: 0.9
        },
        quizTitle: {
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px'
        },
        quizDescription: {
            fontSize: '14px',
            opacity: 0.9,
            lineHeight: '1.5'
        },
        quizBody: {
            padding: '20px'
        },
        quizMeta: {
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            flexWrap: 'wrap'
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#666'
        },
        difficultyBadge: {
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'capitalize'
        },
        bestScore: {
            background: '#f0f4ff',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '16px'
        },
        bestScoreLabel: {
            fontSize: '12px',
            color: '#666',
            marginBottom: '4px'
        },
        bestScoreValue: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#667eea'
        },
        startButton: {
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        retakeButton: {
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
        },
        loading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
        },
        emptyIcon: {
            fontSize: '64px',
            marginBottom: '16px'
        },
        emptyText: {
            fontSize: '18px',
            color: '#666'
        }
    };

    return (
        <>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <div style={styles.container}>
                <div style={styles.maxWidth}>
                    {/* Welcome Section */}
                    <div style={styles.welcome}>
                        <h1 style={styles.greeting}>Welcome back, {user?.name}! 👋</h1>
                        <p style={styles.subGreeting}>Ready to test your knowledge today?</p>
                    </div>

                    {/* Statistics Cards */}
                    <div style={styles.statsGrid}>
                        <div
                            style={styles.statCard}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div style={styles.statIcon}>📚</div>
                            <div style={styles.statValue}>{stats.totalCompleted}</div>
                            <div style={styles.statLabel}>Quizzes Completed</div>
                        </div>

                        <div
                            style={styles.statCard}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div style={styles.statIcon}>📊</div>
                            <div style={styles.statValue}>{stats.averageScore}%</div>
                            <div style={styles.statLabel}>Average Score</div>
                        </div>

                        <div
                            style={styles.statCard}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div style={styles.statIcon}>🏆</div>
                            <div style={styles.statValue}>{stats.achievements}</div>
                            <div style={styles.statLabel}>Achievements Earned</div>
                        </div>

                        <div
                            style={styles.statCard}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div style={styles.statIcon}>⭐</div>
                            <div style={styles.statValue}>{stats.rank}</div>
                            <div style={styles.statLabel}>Current Rank</div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div style={styles.filterSection}>
                        <h3 style={styles.filterTitle}>Find Your Quiz</h3>
                        <div style={styles.filterGrid}>
                            <select
                                value={filter.category}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                style={styles.select}
                            >
                                <option value="">All Categories</option>
                                <optgroup label="Computer Science">
                                    <option value="HTML">HTML</option>
                                    <option value="CSS">CSS</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Python">Python</option>
                                    <option value="React">React</option>
                                    <option value="Node.js">Node.js</option>
                                    <option value="Java">Java</option>
                                    <option value="C++">C++</option>
                                </optgroup>
                                <optgroup label="History">
                                    <option value="World History">World History</option>
                                    <option value="Ancient History">Ancient History</option>
                                    <option value="Modern History">Modern History</option>
                                </optgroup>
                                <optgroup label="General Knowledge">
                                    <option value="Science">Science</option>
                                    <option value="Geography">Geography</option>
                                    <option value="Current Affairs">Current Affairs</option>
                                    <option value="Sports">Sports</option>
                                </optgroup>
                            </select>

                            <select
                                value={filter.difficulty}
                                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                                style={styles.select}
                            >
                                <option value="">All Difficulties</option>
                                {difficulties.map(diff => (
                                    <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                style={styles.searchInput}
                            />
                        </div>
                    </div>

                    {/* Quizzes Section */}
                    <div style={styles.quizzesSection}>
                        <h2 style={styles.sectionTitle}>Available Quizzes</h2>

                        {loading ? (
                            <div style={styles.loading}>
                                <div className="spinner"></div>
                            </div>
                        ) : quizzes.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIcon}>🔍</div>
                                <p style={styles.emptyText}>No quizzes found. Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <div style={styles.quizGrid}>
                                {quizzes.map((quiz) => (
                                    <div
                                        key={quiz.quiz_id}
                                        style={styles.quizCard}
                                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.quizCardHover)}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                        }}
                                    >
                                        <div style={styles.quizHeader}>
                                            <div style={styles.quizCategory}>{quiz.category}</div>
                                            <h3 style={styles.quizTitle}>{quiz.title}</h3>
                                            <p style={styles.quizDescription}>{quiz.description}</p>
                                        </div>

                                        <div style={styles.quizBody}>
                                            <div style={styles.quizMeta}>
                                                <div style={styles.metaItem}>
                                                    <span>⏱️</span>
                                                    <span>{quiz.time_limit} min</span>
                                                </div>
                                                <div style={styles.metaItem}>
                                                    <span>❓</span>
                                                    <span>{quiz.question_count} questions</span>
                                                </div>
                                                <div style={styles.metaItem}>
                                                    <span
                                                        style={{
                                                            ...styles.difficultyBadge,
                                                            background: getDifficultyColor(quiz.difficulty) + '20',
                                                            color: getDifficultyColor(quiz.difficulty)
                                                        }}
                                                    >
                                                        {quiz.difficulty}
                                                    </span>
                                                </div>
                                            </div>

                                            {quiz.best_score && (
                                                <div style={styles.bestScore}>
                                                    <div style={styles.bestScoreLabel}>Your Best Score</div>
                                                    <div style={styles.bestScoreValue}>{quiz.best_score}%</div>
                                                </div>
                                            )}

                                            <Link to={`/quiz/${quiz.quiz_id}`} style={{ textDecoration: 'none' }}>
                                                <button
                                                    style={{
                                                        ...styles.startButton,
                                                        ...(quiz.best_score && styles.retakeButton)
                                                    }}
                                                >
                                                    {quiz.best_score ? '🔄 Retake Quiz' : '▶️ Start Quiz'}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
