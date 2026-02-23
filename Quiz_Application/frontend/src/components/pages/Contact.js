import React from 'react';

const Contact = () => {
    const styles = {
        container: {
            minHeight: 'calc(100vh - 70px)',
            background: '#f5f7fa',
            padding: '60px 20px'
        },
        content: {
            maxWidth: '900px',
            margin: '0 auto'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
        },
        card: {
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
        contactCard: {
            padding: '32px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
        },
        contactIcon: {
            fontSize: '48px',
            marginBottom: '16px'
        },
        contactTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '12px'
        },
        contactText: {
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.6'
        },
        contactLink: {
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '500'
        },
        formCard: {
            gridColumn: '1 / -1'
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
            transition: 'all 0.3s ease'
        },
        textarea: {
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            outline: 'none',
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'inherit'
        },
        button: {
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <div style={styles.icon}>📧</div>
                        <h1 style={styles.title}>Contact Us</h1>
                        <p style={styles.subtitle}>We'd love to hear from you!</p>
                    </div>

                    <div style={styles.grid}>
                        <div
                            style={styles.contactCard}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={styles.contactIcon}>📧</div>
                            <h3 style={styles.contactTitle}>Email</h3>
                            <p style={styles.contactText}>
                                <a href="mailto:support@quizmasterpro.com" style={styles.contactLink}>
                                    support@quizmasterpro.com
                                </a>
                            </p>
                        </div>

                        <div
                            style={styles.contactCard}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={styles.contactIcon}>📞</div>
                            <h3 style={styles.contactTitle}>Phone</h3>
                            <p style={styles.contactText}>
                                <a href="tel:+1234567890" style={styles.contactLink}>
                                    +1 (234) 567-890
                                </a>
                            </p>
                        </div>

                        <div
                            style={styles.contactCard}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={styles.contactIcon}>📍</div>
                            <h3 style={styles.contactTitle}>Address</h3>
                            <p style={styles.contactText}>
                                123 Education Street<br />
                                Learning City, LC 12345<br />
                                United States
                            </p>
                        </div>

                        <div
                            style={styles.contactCard}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={styles.contactIcon}>⏰</div>
                            <h3 style={styles.contactTitle}>Business Hours</h3>
                            <p style={styles.contactText}>
                                Monday - Friday<br />
                                9:00 AM - 6:00 PM EST<br />
                                Weekend: Closed
                            </p>
                        </div>

                        <div style={{ ...styles.formCard, ...styles.card, padding: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
                                Send us a Message
                            </h2>
                            <form onSubmit={handleSubmit} style={styles.form}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Name</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        placeholder="Your name"
                                        required
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        style={styles.input}
                                        placeholder="your.email@example.com"
                                        required
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Subject</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        placeholder="What is this about?"
                                        required
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Message</label>
                                    <textarea
                                        style={styles.textarea}
                                        placeholder="Your message here..."
                                        required
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={styles.button}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
