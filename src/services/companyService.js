import { apiClient } from './api';

export const companyService = {
    // Get all companies
    async getAllCompanies(search = '') {
        try {
            const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
            const response = await apiClient.get(`/companies${queryParams}`);
            return response.companies;
        } catch (error) {
            console.error('Failed to fetch companies:', error);
            return [];
        }
    },

    // Get company by ID
    async getCompanyById(id) {
        try {
            const response = await apiClient.get(`/companies/${id}`);
            return response.company;
        } catch (error) {
            console.error('Failed to fetch company:', error);
            return null;
        }
    },

    // Create company (admin only)
    async createCompany(companyData) {
        try {
            const response = await apiClient.post('/companies', companyData);
            return { success: true, company: response.company };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update company (admin only)
    async updateCompany(companyId, companyData) {
        try {
            const response = await apiClient.put(`/companies/${companyId}`, companyData);
            return { success: true, company: response.company };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete company (admin only)
    async deleteCompany(companyId) {
        try {
            await apiClient.delete(`/companies/${companyId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
