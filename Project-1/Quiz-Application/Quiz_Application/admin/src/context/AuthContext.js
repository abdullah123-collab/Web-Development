import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 AuthContext: Checking stored credentials...');
        const token = localStorage.getItem('adminToken');
        const savedAdmin = localStorage.getItem('admin');

        console.log('📦 Token exists:', !!token);
        console.log('👤 Saved Admin:', !!savedAdmin);

        if (token && savedAdmin) {
            console.log('✅ Valid session found, restoring admin...');
            try {
                setAdmin(JSON.parse(savedAdmin));
            } catch (e) {
                console.error('❌ Failed to parse saved admin:', e);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin');
                setAdmin(null);
            }
        } else {
            console.log('ℹ️ No valid session found');
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        console.log('🔐 Login attempt:', username);

        // Always authenticate against backend server
        console.log('🌐 Attempting server authentication...');
        try {
            const response = await api.post('/admin/login', { username, password });
            if (response.data.success) {
                const { token, admin } = response.data;
                console.log('✅ Server login successful');
                console.log('📦 Token received:', token.substring(0, 20) + '...');
                
                // Store the REAL JWT token from the backend
                localStorage.setItem('adminToken', token);
                localStorage.setItem('admin', JSON.stringify(admin));
                setAdmin(admin);
                
                return { success: true };
            }
            console.log('❌ Server login failed:', response.data.message);
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error('❌ Login error:', error);
            const msg = error.response?.data?.message || 'Login failed. Server might be offline.';
            return { success: false, message: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
            {children}
        </AuthContext.Provider>
    );
};