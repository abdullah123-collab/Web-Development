import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    const styles = {
        container: {
            minHeight: 'calc(100vh - 70px)',
            background: '#f5f7fa',
            padding: '60px 20px'
        },
        content: {
            maxWidth: '900px',
            margin: '0 auto',
            background: '#fff',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        header: {
            textAlign: 'center',
            marginBottom: '48px'
        },
        icon: {
            fontSize: '64px',
            marginBottom: '16px'
        },
        title: {
            fontSize: '36px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '16px'
        },
        subtitle: {
            fontSize: '18px',
            color: '#666'
        },
        section: {
            marginBottom: '40px'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        text: {
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '16px'
        },
        featureGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginTop: '24px'
        },
        featureCard: {
            padding: '24px',
            background: '#f5f7fa',
            borderRadius: '12px',
            textAlign: 'center'
        },
        featureIcon: {
            fontSize: '36px',
            marginBottom: '12px'
        },
        featureTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
        },
        featureText: {
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.6'
        },
        cta: {
            textAlign: 'center',
            marginTop: '48px'
        },
        button: {
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <div style={styles.icon}>🎓</div>
                    <h1 style={styles.title}>About QuizMaster Pro</h1>
                    <p style={styles.subtitle}>Your Ultimate Learning Companion</p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span>📖</span>
                        <span>What is QuizMaster Pro?</span>
                    </h2>
                    <p style={styles.text}>
                        QuizMaster Pro is a comprehensive online quiz platform designed to help students, professionals,
                        and lifelong learners test and enhance their knowledge across multiple domains. Whether you're
                        preparing for exams, brushing up on computer science concepts, exploring history, or testing
                        your general knowledge, we've got you covered.
                    </p>
                    <p style={styles.text}>
                        Our platform offers an engaging, interactive learning experience with real-time feedback,
                        detailed analytics, and a gamified achievement system to keep you motivated on your learning journey.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span>✨</span>
                        <span>Key Features</span>
                    </h2>
                    <div style={styles.featureGrid}>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>🎯</div>
                            <h3 style={styles.featureTitle}>Multiple Categories</h3>
                            <p style={styles.featureText}>
                                Computer Science, History, General Knowledge, and more with specialized subcategories
                            </p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>⏱️</div>
                            <h3 style={styles.featureTitle}>Timed Quizzes</h3>
                            <p style={styles.featureText}>
                                Challenge yourself with time-bound quizzes that simulate real exam conditions
                            </p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>📊</div>
                            <h3 style={styles.featureTitle}>Detailed Analytics</h3>
                            <p style={styles.featureText}>
                                Track your progress with comprehensive statistics and performance insights
                            </p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>🏆</div>
                            <h3 style={styles.featureTitle}>Achievements</h3>
                            <p style={styles.featureText}>
                                Unlock badges and earn points as you master different subjects
                            </p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>🔒</div>
                            <h3 style={styles.featureTitle}>Anti-Cheat</h3>
                            <p style={styles.featureText}>
                                Fair testing environment with built-in anti-cheat mechanisms
                            </p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>📱</div>
                            <h3 style={styles.featureTitle}>Responsive Design</h3>
                            <p style={styles.featureText}>
                                Access quizzes seamlessly on desktop, tablet, or mobile devices
                            </p>
                        </div>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span>🎯</span>
                        <span>Our Mission</span>
                    </h2>
                    <p style={styles.text}>
                        Our mission is to make learning accessible, engaging, and effective for everyone. We believe
                        that regular testing and self-assessment are crucial for knowledge retention and skill development.
                        QuizMaster Pro provides a platform where learners can challenge themselves, identify knowledge gaps,
                        and continuously improve.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span>🌟</span>
                        <span>Why Choose Us?</span>
                    </h2>
                    <p style={styles.text}>
                        ✓ <strong>Diverse Content:</strong> Quizzes spanning Computer Science, History, and General Knowledge<br />
                        ✓ <strong>Quality Questions:</strong> Carefully curated questions with detailed explanations<br />
                        ✓ <strong>Progress Tracking:</strong> Monitor your improvement over time<br />
                        ✓ <strong>Flexible Learning:</strong> Study at your own pace, anytime, anywhere<br />
                        ✓ <strong>Instant Feedback:</strong> Get immediate results with detailed breakdowns<br />
                        ✓ <strong>Secure Platform:</strong> Your data and progress are safe with us
                    </p>
                </div>

                <div style={styles.cta}>
                    <Link
                        to="/dashboard"
                        style={styles.button}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Start Learning Now →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
