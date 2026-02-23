import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const AddQuiz = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'HTML',
        difficulty: 'beginner',
        time_limit: 15,
        passing_score: 60,
        points: 10,
        is_active: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/admin/quiz', formData);
            if (response.data.success) {
                setSuccess('Quiz created successfully! Redirecting...');
                setTimeout(() => {
                    navigate(`/quiz/${response.data.quiz_id}/questions`);
                }, 1500);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: { minHeight: '100vh', background: '#f5f7fa', padding: '40px' },
        content: { maxWidth: '800px', margin: '0 auto' },
        card: { background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        title: { fontSize: '24px', fontWeight: '700', marginBottom: '24px' },
        form: { display: 'flex', flexDirection: 'column', gap: '20px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontSize: '14px', fontWeight: '600' },
        input: { padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' },
        select: { padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' },
        button: { padding: '14px', fontSize: '16px', fontWeight: '600', color: '#fff', background: '#1e3c72', border: 'none', borderRadius: '8px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '8px 16px', background: '#e0e0e0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back to Dashboard</button>
                <div style={styles.card}>
                    <h1 style={styles.title}>Create New Quiz</h1>
                    {error && <div style={{ padding: '12px', background: '#ffebee', borderRadius: '8px', color: '#F44336', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
                    {success && <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px', color: '#4CAF50', fontSize: '14px', marginBottom: '16px' }}>{success}</div>}
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Title</label>
                            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={styles.input} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...styles.input, minHeight: '80px' }} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Category</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={styles.select}>
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
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Difficulty</label>
                                <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} style={styles.select}>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Time Limit (min)</label>
                                <input type="number" value={formData.time_limit} onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) })} style={styles.input} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Passing Score (%)</label>
                                <input type="number" value={formData.passing_score} onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })} style={styles.input} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Points</label>
                                <input type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} style={styles.input} required />
                            </div>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                                Active (visible to users)
                            </label>
                        </div>
                        <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Creating Quiz...' : 'Create Quiz'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddQuiz;
