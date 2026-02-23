import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/leaderboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeaders(res.data.leaders);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get trophy icon
    const getRankIcon = (index) => {
        if (index === 0) return "🏆"; // Gold
        if (index === 1) return "🥈"; // Silver
        if (index === 2) return "🥉"; // Bronze
        return `#${index + 1}`;
    };

    const styles = {
        container: { maxWidth: '800px', margin: '40px auto', padding: '20px', textAlign: 'center' },
        card: { background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
        title: { fontSize: '2.5rem', marginBottom: '20px', background: 'linear-gradient(45deg, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
        th: { textAlign: 'left', padding: '15px', borderBottom: '2px solid #eee', color: '#666' },
        td: { textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee', fontSize: '1.1rem' },
        row: { transition: '0.2s' },
        avatar: { width: '40px', height: '40px', borderRadius: '50%', marginRight: '15px', verticalAlign: 'middle', background: '#eee' },
        points: { fontWeight: 'bold', color: '#667eea' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🏆 Top 10 Champions</h1>
                
                {loading ? (
                    <p>Loading rankings...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Rank</th>
                                <th style={styles.th}>Student</th>
                                <th style={styles.th}>Level</th>
                                <th style={{...styles.th, textAlign: 'right'}}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((user, index) => (
                                <tr key={user.user_id} style={{...styles.row, background: index < 3 ? '#fff9e6' : 'white'}}>
                                    <td style={{...styles.td, fontSize: '1.5rem'}}>{getRankIcon(index)}</td>
                                    <td style={styles.td}>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            {/* Avatar Placeholder if null */}
                                            <div style={{...styles.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                {user.avatar ? <img src={user.avatar} alt="avatar" style={{width:'100%', borderRadius:'50%'}}/> : user.name.charAt(0)}
                                            </div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td style={styles.td}>Lvl {user.level}</td>
                                    <td style={{...styles.td, textAlign: 'right', ...styles.points}}>{user.total_points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;