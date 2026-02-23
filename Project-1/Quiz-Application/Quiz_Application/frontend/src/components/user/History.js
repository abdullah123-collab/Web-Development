import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', status: '' });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/user/history');
            if (response.data.success) {
                setHistory(response.data.history);
                setStatistics(response.data.statistics);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(item => {
        if (filter.category && item.category !== filter.category) return false;
        if (filter.status === 'passed' && !item.passed) return false;
        if (filter.status === 'failed' && item.passed) return false;
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const styles = {
        container: {
            minHeight: 'calc(100vh - 70px)',
            background: '#f5f7fa',
            padding: '40px 20px'
        },
        maxWidth: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            marginBottom: '32px'
        },
        title: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '16px',
            color: '#666'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
        },
        statCard: {
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#667eea',
            marginBottom: '8px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#666'
        },
        filterSection: {
            background: '#fff',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
        },
        select: {
            padding: '10px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
            cursor: 'pointer'
        },
        table: {
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        tableHeader: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 120px',
            gap: '16px',
            fontWeight: '600',
            fontSize: '14px'
        },
        tableRow: {
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 120px',
            gap: '16px',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            transition: 'all 0.3s ease'
        },
        tableRowHover: {
            background: '#f5f7fa'
        },
        badge: {
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
        },
        badgePassed: {
            background: '#e8f5e9',
            color: '#4CAF50'
        },
        badgeFailed: {
            background: '#ffebee',
            color: '#F44336'
        },
        viewButton: {
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            textAlign: 'center'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '16px'
        },
        emptyIcon: {
            fontSize: '64px',
            marginBottom: '16px'
        },
        emptyText: {
            fontSize: '18px',
            color: '#666',
            marginBottom: '24px'
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.maxWidth}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Quiz History</h1>
                    <p style={styles.subtitle}>Track your progress and review past attempts</p>
                </div>

                {/* Statistics */}
                {statistics && (
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{statistics.total_quizzes || 0}</div>
                            <div style={styles.statLabel}>Total Attempts</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{Math.round(statistics.average_score || 0)}%</div>
                            <div style={styles.statLabel}>Average Score</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{statistics.passed_count || 0}</div>
                            <div style={styles.statLabel}>Quizzes Passed</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{statistics.total_points || 0}</div>
                            <div style={styles.statLabel}>Total Points</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div style={styles.filterSection}>
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
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        style={styles.select}
                    >
                        <option value="">All Status</option>
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                {/* History Table */}
                {filteredHistory.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📚</div>
                        <p style={styles.emptyText}>No quiz history found</p>
                        <Link to="/dashboard" className="btn btn-primary">
                            Take Your First Quiz
                        </Link>
                    </div>
                ) : (
                    <div style={styles.table}>
                        <div style={styles.tableHeader}>
                            <div>Quiz Name</div>
                            <div>Category</div>
                            <div>Date</div>
                            <div>Score</div>
                            <div>Time</div>
                            <div>Status</div>
                            <div>Action</div>
                        </div>
                        {filteredHistory.map((item) => (
                            <div
                                key={item.result_id}
                                style={styles.tableRow}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f7fa'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ fontWeight: '600' }}>{item.title}</div>
                                <div>{item.category}</div>
                                <div style={{ fontSize: '14px', color: '#666' }}>
                                    {formatDate(item.played_at)}
                                </div>
                                <div style={{ fontWeight: '600', color: '#667eea' }}>
                                    {item.percentage}%
                                </div>
                                <div style={{ fontSize: '14px' }}>
                                    {Math.floor(item.time_taken / 60)}:{(item.time_taken % 60).toString().padStart(2, '0')}
                                </div>
                                <div>
                                    <span style={{
                                        ...styles.badge,
                                        ...(item.passed ? styles.badgePassed : styles.badgeFailed)
                                    }}>
                                        {item.passed ? '✓ Passed' : '✗ Failed'}
                                    </span>
                                </div>
                                <div>
                                    <Link to={`/result/${item.result_id}`} style={styles.viewButton}>
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
