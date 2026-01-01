import { apiClient } from './api';

export const eventService = {
    // Get all events
    async getAllEvents(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await apiClient.get(`/events?${queryParams}`);
            return response.events;
        } catch (error) {
            console.error('Failed to fetch events:', error);
            return [];
        }
    },

    // Get event by ID
    async getEventById(id) {
        try {
            const response = await apiClient.get(`/events/${id}`);
            return response.event;
        } catch (error) {
            console.error('Failed to fetch event:', error);
            return null;
        }
    },

    // Create event (admin only)
    async createEvent(eventData) {
        try {
            const response = await apiClient.post('/events', eventData);
            return { success: true, event: response.event };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update event (admin only)
    async updateEvent(eventId, eventData) {
        try {
            const response = await apiClient.put(`/events/${eventId}`, eventData);
            return { success: true, event: response.event };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete event (admin only)
    async deleteEvent(eventId) {
        try {
            await apiClient.delete(`/events/${eventId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
