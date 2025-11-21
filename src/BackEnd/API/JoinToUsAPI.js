import apiClient from '../ApiClient.js';

export const JoinToUsAPI = {
    
    async createRegistration(registrationData) {
        try {
            const response = await apiClient.post('/walker-registrations', registrationData);
            return response.data.registration;
        } catch (error) {
            console.error('Error creating registration:', error);
            throw error;
        }
    },

    // Obtener todas las solicitudes
    async getAllRegistrations() {
        try {
            const response = await apiClient.get('/walker-registrations');
            return response.data.registrations;
        } catch (error) {
            console.error('Error getting all registrations:', error);
            throw error;
        }
    },

    // Obtener solicitud por ID
    async getRegistrationById(registrationId) {
        try {
            const response = await apiClient.get(`/walker-registrations/${registrationId}`);
            return response.data.registration;
        } catch (error) {
            console.error('Error getting registration by ID:', error);
            if (error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    },

    // Actualizar solicitud
    async updateRegistration(registrationId, updateData) {
        try {
            const response = await apiClient.put(`/walker-registrations/${registrationId}`, updateData);
            return response.data.registration;
        } catch (error) {
            console.error('Error updating registration:', error);
            throw error;
        }
    },

    // Eliminar solicitud
    async deleteRegistration(registrationId) {
        try {
            const response = await apiClient.delete(`/walker-registrations/${registrationId}`);
            return {
                success: true,
                message: response.message,
                registrationId: response.data.registrationId
            };
        } catch (error) {
            console.error('Error deleting registration:', error);
            throw error;
        }
    },

    // Obtener solicitudes por estado
    async getRegistrationsByStatus(status) {
        try {
            const response = await apiClient.get(`/walker-registrations/status/${status}`);
            return response.data.registrations;
        } catch (error) {
            console.error('Error getting registrations by status:', error);
            throw error;
        }
    },

    // Obtener solicitud por usuario
    async getApplicationByUserId(userId) {
        try {
            const response = await apiClient.get(`/walker-registrations/user/${userId}`);
            return response.data.application;
        } catch (error) {
            console.error('Error getting application by user ID:', error);
            if (error.message.includes('No application found for this user')) {
                throw new Error('No application found for this user');
            }
            throw error;
        }
    },

    // Obtener estadísticas
    async getRegistrationStatistics() {
        try {
            const response = await apiClient.get('/walker-registrations/statistics');
            return response.data.statistics;
        } catch (error) {
            console.error('Error getting registration statistics:', error);
            throw error;
        }
    },

    // Promover usuario a walker
    async promoteUserToWalker(userId) {
        try {
            const response = await apiClient.post(`/walker-registrations/${userId}/promote`);
            return {
                success: response.data.success,
                message: response.message,
                newRole: response.data.newRole
            };
        } catch (error) {
            console.error('Error promoting user to walker:', error);
            throw error;
        }
    }
};