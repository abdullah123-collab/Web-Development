import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import AddQuiz from './pages/quiz/AddQuiz';
import AddQuestion from './pages/quiz/AddQuestion';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    console.log('🛡️ ProtectedRoute check - isAuthenticated:', isAuthenticated, 'loading:', loading);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><div className="spinner"></div></div>;

    if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to /login');
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><div className="spinner"></div></div>;
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/quiz/add" element={<ProtectedRoute><AddQuiz /></ProtectedRoute>} />
                <Route path="/quiz/:id/questions" element={<ProtectedRoute><AddQuestion /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
