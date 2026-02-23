import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const AddQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        question_text: '',
        question_type: 'multiple_choice',
        points: 1,
        options: [
            { option_text: '', option_label: 'A', is_correct: false },
            { option_text: '', option_label: 'B', is_correct: false },
            { option_text: '', option_label: 'C', is_correct: false },
            { option_text: '', option_label: 'D', is_correct: false }
        ]
    });

    const fetchQuestions = useCallback(async () => {
        try {
            const response = await api.get(`/admin/quiz/${id}/questions`);
            if (response.data.success) {
                setQuestions(response.data.questions);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const hasCorrect = formData.options.some(opt => opt.is_correct);
        if (!hasCorrect) {
            setError('Please mark at least one option as correct');
            return;
        }

        try {
            const response = await api.post('/admin/question', {
                ...formData,
                quiz_id: parseInt(id),
                order_number: questions.length + 1
            });
            if (response.data.success) {
                setSuccess('Question added successfully!');
                setFormData({
                    question_text: '',
                    question_type: 'multiple_choice',
                    points: 1,
                    options: [
                        { option_text: '', option_label: 'A', is_correct: false },
                        { option_text: '', option_label: 'B', is_correct: false },
                        { option_text: '', option_label: 'C', is_correct: false },
                        { option_text: '', option_label: 'D', is_correct: false }
                    ]
                });
                fetchQuestions();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add question. Please try again.');
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Delete this question?')) return;
        setError('');
        setSuccess('');

        try {
            await api.delete(`/admin/question/${questionId}`);
            setSuccess('Question deleted successfully!');
            fetchQuestions();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete question. Please try again.');
        }
    };

    const styles = {
        container: { minHeight: '100vh', background: '#f5f7fa', padding: '40px' },
        content: { maxWidth: '1200px', margin: '0 auto' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' },
        card: { background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        title: { fontSize: '24px', fontWeight: '700', marginBottom: '24px' },
        form: { display: 'flex', flexDirection: 'column', gap: '20px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontSize: '14px', fontWeight: '600' },
        input: { padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' },
        option: { display: 'flex', gap: '12px', alignItems: 'center' },
        button: { padding: '14px', fontSize: '16px', fontWeight: '600', color: '#fff', background: '#1e3c72', border: 'none', borderRadius: '8px', cursor: 'pointer' },
        questionItem: { padding: '16px', background: '#f5f7fa', borderRadius: '8px', marginBottom: '12px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '8px 16px', background: '#e0e0e0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back to Dashboard</button>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h1 style={styles.title}>Add Question</h1>
                        {error && <div style={{ padding: '12px', background: '#ffebee', borderRadius: '8px', color: '#F44336', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
                        {success && <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px', color: '#4CAF50', fontSize: '14px', marginBottom: '16px' }}>{success}</div>}
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Question Text</label>
                                <textarea value={formData.question_text} onChange={(e) => setFormData({ ...formData, question_text: e.target.value })} style={{ ...styles.input, minHeight: '80px' }} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Points</label>
                                <input type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} style={styles.input} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Options</label>
                                {formData.options.map((opt, idx) => (
                                    <div key={idx} style={styles.option}>
                                        <span style={{ fontWeight: '600', minWidth: '20px' }}>{opt.option_label}.</span>
                                        <input type="text" value={opt.option_text} onChange={(e) => {
                                            const newOptions = [...formData.options];
                                            newOptions[idx].option_text = e.target.value;
                                            setFormData({ ...formData, options: newOptions });
                                        }} style={{ ...styles.input, flex: 1 }} required />
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={opt.is_correct} onChange={(e) => {
                                                const newOptions = [...formData.options];
                                                newOptions[idx].is_correct = e.target.checked;
                                                setFormData({ ...formData, options: newOptions });
                                            }} />
                                            Correct
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <button type="submit" style={styles.button}>Add Question</button>
                        </form>
                    </div>
                    <div style={styles.card}>
                        <h2 style={styles.title}>Questions ({questions.length})</h2>
                        {questions.map((q, idx) => (
                            <div key={q.question_id} style={styles.questionItem}>
                                <div style={{ fontWeight: '600', marginBottom: '8px' }}>{idx + 1}. {q.question_text}</div>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                    {q.options.filter(o => o.is_correct).map(o => `Correct: ${o.option_label}`).join(', ')}
                                </div>
                                <button onClick={() => handleDeleteQuestion(q.question_id)} style={{ padding: '4px 12px', fontSize: '12px', background: '#F44336', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuestion;
