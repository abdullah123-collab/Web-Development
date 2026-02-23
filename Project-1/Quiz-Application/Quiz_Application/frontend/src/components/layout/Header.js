import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    // Hide header on auth pages
    const authPages = ['/login', '/signup'];
    if (authPages.includes(location.pathname) || !isAuthenticated) {
        return null;
    }

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const styles = {
        header: {
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            animation: 'slideDown 0.3s ease'
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px'
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#333',
            fontSize: '24px',
            fontWeight: '700'
        },
        logoIcon: {
            fontSize: '32px'
        },
        logoText: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
        },
        navLink: {
            textDecoration: 'none',
            color: '#666',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'color 0.3s ease',
            position: 'relative'
        },
        navLinkActive: {
            color: '#667eea',
            fontWeight: '600'
        },
        accountSection: {
            position: 'relative'
        },
        accountButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '12px',
            transition: 'all 0.3s ease'
        },
        accountButtonHover: {
            background: '#f5f7fa'
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '600',
            fontSize: '16px'
        },
        userName: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
        },
        userLevel: {
            fontSize: '12px',
            color: '#999'
        },
        dropdown: {
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            minWidth: '280px',
            overflow: 'hidden',
            animation: 'scaleIn 0.2s ease',
            zIndex: 1000
        },
        dropdownHeader: {
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff'
        },
        dropdownName: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '4px'
        },
        dropdownEmail: {
            fontSize: '14px',
            opacity: 0.9
        },
        dropdownStats: {
            display: 'flex',
            gap: '16px',
            marginTop: '12px'
        },
        stat: {
            display: 'flex',
            flexDirection: 'column'
        },
        statLabel: {
            fontSize: '12px',
            opacity: 0.8
        },
        statValue: {
            fontSize: '16px',
            fontWeight: '600'
        },
        dropdownMenu: {
            padding: '8px'
        },
        dropdownItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            textDecoration: 'none',
            color: '#333',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            fontSize: '14px'
        },
        dropdownItemHover: {
            background: '#f5f7fa',
            color: '#667eea'
        },
        divider: {
            height: '1px',
            background: '#e0e0e0',
            margin: '8px 0'
        },
        logoutItem: {
            color: '#F44336'
        }
    };

    return (
        <>
            <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

            <header style={styles.header}>
                <div style={styles.container}>
                    <Link to="/dashboard" style={styles.logo}>
                        <span style={styles.logoIcon}>🎓</span>
                        <span style={styles.logoText}>QuizMaster Pro</span>
                    </Link>

                    <nav style={styles.nav}>
                        <Link
                            to="/dashboard"
                            style={{
                                ...styles.navLink,
                                ...(location.pathname === '/dashboard' && styles.navLinkActive)
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#667eea'}
                            onMouseLeave={(e) => location.pathname !== '/dashboard' && (e.target.style.color = '#666')}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            style={styles.navLink}
                            onMouseEnter={(e) => e.target.style.color = '#667eea'}
                            onMouseLeave={(e) => e.target.style.color = '#666'}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            style={styles.navLink}
                            onMouseEnter={(e) => e.target.style.color = '#667eea'}
                            onMouseLeave={(e) => e.target.style.color = '#666'}
                        >
                            Contact Us
                        </Link>
                        <Link 
                            to="/leaderboard" 
                            style={styles.navLink}>
                                🏆 Leaderboard
                        </Link>
                    </nav>

                    <div style={styles.accountSection}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={styles.accountButton}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.accountButtonHover)}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                            <div style={styles.avatar}>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    getInitials(user?.name || 'User')
                                )}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={styles.userName}>{user?.name}</div>
                                <div style={styles.userLevel}>Level {user?.level || 1}</div>
                            </div>
                        </button>

                        {showDropdown && (
                            <>
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 999
                                    }}
                                    onClick={() => setShowDropdown(false)}
                                />
                                <div style={styles.dropdown}>
                                    <div style={styles.dropdownHeader}>
                                        <div style={styles.dropdownName}>{user?.name}</div>
                                        <div style={styles.dropdownEmail}>{user?.email}</div>
                                        <div style={styles.dropdownStats}>
                                            <div style={styles.stat}>
                                                <span style={styles.statLabel}>Level</span>
                                                <span style={styles.statValue}>{user?.level || 1}</span>
                                            </div>
                                            <div style={styles.stat}>
                                                <span style={styles.statLabel}>Points</span>
                                                <span style={styles.statValue}>{user?.total_points || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.dropdownMenu}>
                                        <Link
                                            to="/profile"
                                            style={styles.dropdownItem}
                                            onClick={() => setShowDropdown(false)}
                                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.dropdownItemHover)}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#333';
                                            }}
                                        >
                                            <span>👤</span>
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            to="/history"
                                            style={styles.dropdownItem}
                                            onClick={() => setShowDropdown(false)}
                                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.dropdownItemHover)}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#333';
                                            }}
                                        >
                                            <span>📊</span>
                                            <span>Quiz History</span>
                                        </Link>

                                        <Link
                                            to="/achievements"
                                            style={styles.dropdownItem}
                                            onClick={() => setShowDropdown(false)}
                                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.dropdownItemHover)}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#333';
                                            }}
                                        >
                                            <span>🏆</span>
                                            <span>Achievements</span>
                                        </Link>

                                        <div style={styles.divider}></div>

                                        <div
                                            style={{ ...styles.dropdownItem, ...styles.logoutItem }}
                                            onClick={() => {
                                                logout();
                                                setShowDropdown(false);
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#ffebee';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <span>🚪</span>
                                            <span>Logout</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
