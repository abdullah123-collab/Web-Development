import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// REQUEST INTERCEPTOR - Add JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        
        // CRITICAL: Always attach token if it exists
        if (token && token.trim()) {
            // Ensure proper 'Bearer ' prefix with space
            config.headers.Authorization = token.startsWith('Bearer ') 
                ? token 
                : `Bearer ${token}`;
            
            console.log('🔐 Token attached to request:', config.headers.Authorization.substring(0, 20) + '...');
        } else {
            console.warn('⚠️  No token found in localStorage for request to:', config.url);
            // Optionally delete the header if no token exists
            delete config.headers.Authorization;
        }
        
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR - Handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data?.message);
        
        if (error.response?.status === 401) {
            // Token is invalid or expired
            const isDashboardPage = window.location.pathname.includes('/dashboard') || 
                                   window.location.pathname.includes('/quiz') ||
                                   window.location.pathname === '/';
            
            if (!isDashboardPage && !window.location.pathname.includes('/login')) {
                console.log('🔄 Redirecting to login due to 401 error');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin');
                window.location.href = '/login';
            }
        } else if (!error.response) {
            console.error('🚨 Network error - Backend may be offline');
        }
        
        return Promise.reject(error);
    }
);

export default api;
