import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setErrors({ submit: result.message });
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        },
        backgroundShapes: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0
        },
        shape: {
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 20s infinite ease-in-out'
        },
        shape1: {
            width: '300px',
            height: '300px',
            top: '-150px',
            left: '-150px'
        },
        shape2: {
            width: '200px',
            height: '200px',
            bottom: '-100px',
            right: '-100px',
            animationDelay: '-5s'
        },
        shape3: {
            width: '150px',
            height: '150px',
            top: '50%',
            right: '10%',
            animationDelay: '-10s'
        },
        formCard: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '48px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 1,
            animation: 'scaleIn 0.5s ease'
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px'
        },
        logo: {
            fontSize: '48px',
            marginBottom: '16px'
        },
        title: {
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
        },
        subtitle: {
            color: '#666',
            fontSize: '16px'
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
            width: '100%',
            padding: '14px 16px',
            fontSize: '16px',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backgroundColor: '#fff'
        },
        inputError: {
            borderColor: '#F44336'
        },
        error: {
            color: '#F44336',
            fontSize: '13px',
            marginTop: '4px'
        },
        rememberRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '-8px'
        },
        checkboxLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666',
            cursor: 'pointer'
        },
        checkbox: {
            width: '18px',
            height: '18px',
            cursor: 'pointer'
        },
        forgotLink: {
            fontSize: '14px',
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '600'
        },
        submitButton: {
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '8px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        },
        submitButtonHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
        },
        submitButtonDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed'
        },
        footer: {
            textAlign: 'center',
            marginTop: '24px',
            color: '#666',
            fontSize: '14px'
        },
        link: {
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '600',
            marginLeft: '4px'
        },
        spinner: {
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

            <div style={styles.backgroundShapes}>
                <div style={{ ...styles.shape, ...styles.shape1 }}></div>
                <div style={{ ...styles.shape, ...styles.shape2 }}></div>
                <div style={{ ...styles.shape, ...styles.shape3 }}></div>
            </div>

            <div style={styles.formCard}>
                <div style={styles.header}>
                    <div style={styles.logo}>🎓</div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.email && styles.inputError)
                            }}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span style={styles.error}>{errors.email}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.password && styles.inputError)
                            }}
                            placeholder="Enter your password"
                        />
                        {errors.password && <span style={styles.error}>{errors.password}</span>}
                    </div>

                    <div style={styles.rememberRow}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                style={styles.checkbox}
                            />
                            Remember me
                        </label>
                        <a href="#" style={styles.forgotLink}>Forgot password?</a>
                    </div>

                    {errors.submit && (
                        <div style={{
                            padding: '12px',
                            background: '#ffebee',
                            borderRadius: '8px',
                            color: '#F44336',
                            fontSize: '14px'
                        }}>
                            {errors.submit}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            ...(loading && styles.submitButtonDisabled)
                        }}
                        onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.submitButtonHover)}
                        onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                    >
                        {loading ? (
                            <>
                                <span style={styles.spinner}></span>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    Don't have an account?
                    <Link to="/signup" style={styles.link}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
