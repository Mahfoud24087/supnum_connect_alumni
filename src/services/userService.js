import { apiClient } from './api';

export const userService = {
    // Get all users (admin only)
    async getAllUsers(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await apiClient.get(`/users?${queryParams}`);
            return response.users;
        } catch (error) {
            console.error('Failed to fetch users:', error);
            return [];
        }
    },

    // Get user by ID
    async getUserById(id) {
        try {
            const response = await apiClient.get(`/users/${id}`);
            return response.user;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            return null;
        }
    },

    // Update user status (admin only)
    async updateUserStatus(userId, status) {
        try {
            const response = await apiClient.patch(`/users/${userId}/status`, { status });
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete user (admin only)
    async deleteUser(userId) {
        try {
            await apiClient.delete(`/users/${userId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Export users to CSV (admin only)
    async exportToCSV() {
        try {
            const response = await apiClient.get('/users/export/csv');
            return response.data;
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        }
    },

    // Add new graduate (admin only)
    async addGraduate(userData) {
        try {
            const response = await apiClient.post('/users/graduates', userData);
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
