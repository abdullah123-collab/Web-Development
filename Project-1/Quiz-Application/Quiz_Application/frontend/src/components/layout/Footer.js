import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTwitter } from 'react-icons/fa'; // Importing the icons

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                
                {/* Column 1: Brand & Socials */}
                <div style={styles.column}>
                    <div style={styles.brand}>
                        <span style={{fontSize: '24px'}}>🎓</span> 
                        <h2 style={{margin: 0}}>QuizMaster Pro</h2>
                    </div>
                    <p style={styles.description}>
                        Enhance your knowledge with our comprehensive quiz platform. 
                        Test yourself, track your progress, and achieve mastery.
                    </p>
                    
                    {/* SOCIAL ICONS */}
                    <div style={styles.socialContainer}>
                        <a href="https://facebook.com" style={styles.iconLink} title="Facebook">
                            <FaFacebookF />
                        </a>
                        <a href="https://instagram.com" style={styles.iconLink} title="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://whatsapp.com" style={styles.iconLink} title="WhatsApp">
                            <FaWhatsapp />
                        </a>
                        <a href="https://twitter.com" style={styles.iconLink} title="X (Twitter)">
                            <FaTwitter />
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div style={styles.column}>
                    <h3 style={styles.heading}>Quick Links</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>📚 Browse Quizzes</li>
                        <li style={styles.listItem}>📊 Quiz History</li>
                        <li style={styles.listItem}>👤 My Profile</li>
                        <li style={styles.listItem}>🏆 Achievements</li>
                    </ul>
                </div>

                {/* Column 3: Categories */}
                <div style={styles.column}>
                    <h3 style={styles.heading}>Categories</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>HTML Quizzes</li>
                        <li style={styles.listItem}>CSS Quizzes</li>
                        <li style={styles.listItem}>JavaScript Quizzes</li>
                        <li style={styles.listItem}>React Quizzes</li>
                    </ul>
                </div>

                {/* Column 4: Support */}
                <div style={styles.column}>
                    <h3 style={styles.heading}>Support</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>❓ Help Center</li>
                        <li style={styles.listItem}>✉️ Contact Us</li>
                        <li style={styles.listItem}>💬 FAQ</li>
                        <li style={styles.listItem}>⭐ Feedback</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={styles.bottomBar}>
                <p>&copy; 2026 QuizMaster Pro. All rights reserved.</p>
                <div style={styles.legalLinks}>
                    <span style={styles.legalItem}>Privacy Policy</span>
                    <span style={styles.legalItem}>Terms of Service</span>
                    <span style={styles.legalItem}>Cookie Policy</span>
                </div>
            </div>
        </footer>
    );
};

// --- STYLES ---
const styles = {
    footer: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Matches your purple theme
        color: 'white',
        padding: '60px 0 0 0',
        fontFamily: "'Poppins', sans-serif",
        marginTop: 'auto'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        paddingBottom: '40px'
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px'
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.6',
        opacity: '0.9',
        maxWidth: '300px'
    },
    socialContainer: {
        display: 'flex',
        gap: '15px',
        marginTop: '10px'
    },
    iconLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent circle
        borderRadius: '50%',
        color: 'white',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    heading: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '15px'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    listItem: {
        fontSize: '14px',
        opacity: '0.8',
        cursor: 'pointer',
        transition: '0.2s'
    },
    bottomBar: {
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '20px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '13px'
    },
    legalLinks: {
        display: 'flex',
        gap: '20px'
    },
    legalItem: {
        cursor: 'pointer',
        opacity: '0.8'
    }
};

export default Footer;