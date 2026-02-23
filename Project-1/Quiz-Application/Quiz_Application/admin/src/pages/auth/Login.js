import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(formData.username, formData.password);
        setLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            padding: '20px'
        },
        card: {
            background: '#fff',
            borderRadius: '16px',
            padding: '48px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px'
        },
        icon: {
            fontSize: '48px',
            marginBottom: '16px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '14px',
            color: '#666'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
        },
        input: {
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
            transition: 'border-color 0.3s ease'
        },
        button: {
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        },
        error: {
            padding: '12px',
            background: '#ffebee',
            borderRadius: '8px',
            color: '#F44336',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.icon}>🔐</div>
                    <h1 style={styles.title}>Admin Panel</h1>
                    <p style={styles.subtitle}>QuizMaster Pro</p>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            onFocus={(e) => e.target.style.borderColor = '#1e3c72'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            style={styles.input}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onFocus={(e) => e.target.style.borderColor = '#1e3c72'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            style={styles.input}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <div style={styles.error}>{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(30, 60, 114, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
                    Demo: username: <strong>admin</strong>, password: <strong>admin123</strong>
                    <br />
                    <span style={{ fontSize: '11px', marginTop: '8px', display: 'block' }}>
                        Having issues? Try clearing your browser cache or use incognito mode.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
