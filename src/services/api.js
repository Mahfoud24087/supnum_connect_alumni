// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api';

class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        // console.log(`API Request: ${options.method || 'GET'} ${url}`);
        const token = localStorage.getItem('auth_token');

        const headers = {
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        // Only set Content-Type to application/json if body is NOT FormData
        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    const error = new Error(errorData.message || 'Request failed');
                    error.errorCode = errorData.errorCode;
                    throw error;
                }
                throw new Error(response.statusText || 'Request failed');
            }

            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
            ...options
        });
    }

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
            ...options
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data instanceof FormData ? data : JSON.stringify(data),
            ...options
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
