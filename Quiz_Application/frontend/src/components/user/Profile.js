import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', avatar: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/user/profile');
            if (response.data.success) {
                setProfile(response.data.user);
                setAchievements(response.data.achievements);
                setPerformance(response.data.performance);
                setFormData({
                    name: response.data.user.name,
                    avatar: response.data.user.avatar || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await api.put('/user/profile', formData);
            if (response.data.success) {
                updateUser({ ...user, name: formData.name, avatar: formData.avatar });
                setEditing(false);
                fetchProfile();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

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
        grid: {
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '24px'
        },
        profileCard: {
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            height: 'fit-content'
        },
        avatar: {
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '48px',
            fontWeight: '600',
            margin: '0 auto 24px'
        },
        name: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '8px'
        },
        email: {
            fontSize: '14px',
            color: '#666',
            marginBottom: '24px'
        },
        levelBadge: {
            display: 'inline-block',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px'
        },
        points: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#667eea',
            marginBottom: '4px'
        },
        pointsLabel: {
            fontSize: '14px',
            color: '#666'
        },
        editButton: {
            width: '100%',
            padding: '12px',
            marginTop: '24px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
        },
        contentArea: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        card: {
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        cardTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '24px'
        },
        achievementsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
        },
        achievementCard: {
            padding: '20px',
            borderRadius: '12px',
            background: '#f5f7fa',
            textAlign: 'center',
            transition: 'all 0.3s ease'
        },
        achievementIcon: {
            fontSize: '48px',
            marginBottom: '12px'
        },
        achievementName: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '4px'
        },
        achievementDesc: {
            fontSize: '12px',
            color: '#666'
        },
        performanceGrid: {
            display: 'grid',
            gap: '16px'
        },
        performanceItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: '#f5f7fa',
            borderRadius: '12px'
        },
        categoryName: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
        },
        stats: {
            display: 'flex',
            gap: '24px',
            fontSize: '14px'
        },
        statItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            marginBottom: '16px',
            outline: 'none'
        },
        buttonGroup: {
            display: 'flex',
            gap: '12px'
        },
        button: {
            flex: 1,
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
        },
        buttonPrimary: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff'
        },
        buttonSecondary: {
            background: '#e0e0e0',
            color: '#666'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.maxWidth}>
                <div style={styles.grid}>
                    {/* Profile Sidebar */}
                    <div style={styles.profileCard}>
                        <div style={styles.avatar}>
                            {profile?.avatar ? (
                                <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            ) : (
                                getInitials(profile?.name || 'User')
                            )}
                        </div>

                        {editing ? (
                            <>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={styles.input}
                                    placeholder="Name"
                                />
                                <input
                                    type="text"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    style={styles.input}
                                    placeholder="Avatar URL (optional)"
                                />
                                <div style={styles.buttonGroup}>
                                    <button onClick={handleUpdate} style={{ ...styles.button, ...styles.buttonPrimary }}>
                                        Save
                                    </button>
                                    <button onClick={() => setEditing(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 style={styles.name}>{profile?.name}</h2>
                                <p style={styles.email}>{profile?.email}</p>

                                <div style={styles.levelBadge}>
                                    Level {profile?.level || 1}
                                </div>

                                <div style={{ marginTop: '24px' }}>
                                    <div style={styles.points}>{profile?.total_points || 0}</div>
                                    <div style={styles.pointsLabel}>Total Points</div>
                                </div>

                                <button onClick={() => setEditing(true)} style={styles.editButton}>
                                    ✏️ Edit Profile
                                </button>
                            </>
                        )}
                    </div>

                    {/* Content Area */}
                    <div style={styles.contentArea}>
                        {/* Achievements */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>🏆 Achievements ({achievements.length})</h3>
                            {achievements.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                                    No achievements yet. Keep taking quizzes to unlock them!
                                </p>
                            ) : (
                                <div style={styles.achievementsGrid}>
                                    {achievements.map((achievement) => (
                                        <div
                                            key={achievement.achievement_id}
                                            style={styles.achievementCard}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={styles.achievementIcon}>{achievement.icon}</div>
                                            <div style={styles.achievementName}>{achievement.name}</div>
                                            <div style={styles.achievementDesc}>{achievement.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Performance by Category */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>📊 Performance by Category</h3>
                            {performance.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                                    No performance data yet. Start taking quizzes!
                                </p>
                            ) : (
                                <div style={styles.performanceGrid}>
                                    {performance.map((item) => (
                                        <div key={item.category} style={styles.performanceItem}>
                                            <div style={styles.categoryName}>{item.category}</div>
                                            <div style={styles.stats}>
                                                <div style={styles.statItem}>
                                                    <span style={{ color: '#666', fontSize: '12px' }}>Attempts</span>
                                                    <span style={{ fontWeight: '600' }}>{item.attempts}</span>
                                                </div>
                                                <div style={styles.statItem}>
                                                    <span style={{ color: '#666', fontSize: '12px' }}>Avg Score</span>
                                                    <span style={{ fontWeight: '600', color: '#667eea' }}>{Math.round(item.avg_score)}%</span>
                                                </div>
                                                <div style={styles.statItem}>
                                                    <span style={{ color: '#666', fontSize: '12px' }}>Best</span>
                                                    <span style={{ fontWeight: '600', color: '#4CAF50' }}>{Math.round(item.best_score)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
