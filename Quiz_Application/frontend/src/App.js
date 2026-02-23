import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/user/Home';
import Questions from './components/user/Questions';
import Score from './components/user/Score';
import History from './components/user/History';
import Profile from './components/user/Profile';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Leaderboard from './components/user/Leaderboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

function AppContent() {
    const location = useLocation();

    return (
        <>
            <Header />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/quiz/:id" element={
                    <ProtectedRoute>
                        <Questions />
                    </ProtectedRoute>
                } />
                <Route path="/result/:id" element={
                    <ProtectedRoute>
                        <Score />
                    </ProtectedRoute>
                } />
                <Route path="/history" element={
                    <ProtectedRoute>
                        <History />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />

                {/* Public Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/leaderboard" element={<Leaderboard />} />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
            {location.pathname !== '/login' && location.pathname !== '/signup' && <Footer />}
        </>
    );
}

export default App;
