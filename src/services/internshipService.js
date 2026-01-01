import { apiClient } from './api';

export const internshipService = {
    // Get all internships
    async getAllInternships(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await apiClient.get(`/internships?${queryParams}`);
            return response.internships;
        } catch (error) {
            console.error('Failed to fetch internships:', error);
            return [];
        }
    },

    // Get internship by ID
    async getInternshipById(id) {
        try {
            const response = await apiClient.get(`/internships/${id}`);
            return response.internship;
        } catch (error) {
            console.error('Failed to fetch internship:', error);
            return null;
        }
    },

    // Create internship (admin only)
    async createInternship(internshipData) {
        try {
            const response = await apiClient.post('/internships', internshipData);
            return { success: true, internship: response.internship };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update internship (admin only)
    async updateInternship(internshipId, internshipData) {
        try {
            const response = await apiClient.put(`/internships/${internshipId}`, internshipData);
            return { success: true, internship: response.internship };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete internship (admin only)
    async deleteInternship(internshipId) {
        try {
            await apiClient.delete(`/internships/${internshipId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Toggle active status
    async toggleActiveStatus(internshipId) {
        try {
            const response = await apiClient.patch(`/internships/${internshipId}/toggle`);
            return { success: true, internship: response.internship };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
