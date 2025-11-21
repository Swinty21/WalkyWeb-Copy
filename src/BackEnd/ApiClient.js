// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.tokenKey = 'walky_token';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        const token = this.getToken();
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Error al procesar respuesta del servidor');
            }

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Error de conexión. Verifique que el servidor esté ejecutándose.');
            }
            throw error;
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async put(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async patch(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token) {
        if (token) {
            localStorage.setItem(this.tokenKey, token);
        } else {
            localStorage.removeItem(this.tokenKey);
        }
    }

    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    hasToken() {
        return !!this.getToken();
    }

    setBaseURL(url) {
        this.baseURL = url;
    }

    getBaseURL() {
        return this.baseURL;
    }
}

const apiClient = new ApiClient();

export default apiClient;