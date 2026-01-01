import { apiClient } from './api';

export const authService = {
    // Login
    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
            }
            return { success: true, user: response.user, token: response.token };
        } catch (error) {
            return { success: false, error: error.message || 'Invalid credentials' };
        }
    },

    // Register
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, error: error.message || 'Registration failed' };
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const response = await apiClient.get('/auth/me');
            return response.user;
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    },

    // Logout
    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
        }
    },

    // Update profile
    async updateProfile(profileData) {
        try {
            const response = await apiClient.put('/auth/profile', profileData);
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, error: error.message || 'Profile update failed' };
        }
    }
};
