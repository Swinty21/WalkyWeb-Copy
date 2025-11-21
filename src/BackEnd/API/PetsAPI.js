import apiClient from '../ApiClient.js';

export const PetsAPI = {
    async getAllPets() {
        try {
            const response = await apiClient.get('/pets');
            return response.data.pets;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener mascotas');
        }
    },

    async getPetById(id) {
        try {
            const response = await apiClient.get(`/pets/${id}`);
            return response.data.pet;
        } catch (error) {
            if (error.message.includes('404') || error.message.includes('no encontrada')) {
                return null;
            }
            throw new Error(error.message || 'Error al obtener mascota');
        }
    },

    async getPetsByOwner(ownerId) {
        try {
            const response = await apiClient.get(`/pets/owner/${ownerId}`);
            return response.data.pets;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener mascotas del propietario');
        }
    },

    async createPet(petData) {
        try {
            const response = await apiClient.post('/pets', petData);
            return response.data.pet;
        } catch (error) {
            throw new Error(error.message || 'Error al crear mascota');
        }
    },

    async updatePet(id, petData) {
        try {
            const response = await apiClient.put(`/pets/${id}`, petData);
            return response.data.pet;
        } catch (error) {
            if (error.message.includes('404') || error.message.includes('no encontrada')) {
                throw new Error('Mascota no encontrada');
            }
            throw new Error(error.message || 'Error al actualizar mascota');
        }
    },

    async deletePet(id) {
        try {
            const response = await apiClient.delete(`/pets/${id}`);
            return { success: true, message: response.message || 'Mascota eliminada exitosamente' };
        } catch (error) {
            if (error.message.includes('404') || error.message.includes('no encontrada')) {
                throw new Error('Mascota no encontrada');
            }
            throw new Error(error.message || 'Error al eliminar mascota');
        }
    },

    async validatePet(id) {
        try {
            const response = await apiClient.get(`/pets/${id}/validate`);
            return response.data.isValid;
        } catch (error) {
            return false;
        }
    },

    async validateOwner(ownerId) {
        try {
            const response = await apiClient.get(`/pets/owner/${ownerId}/validate`);
            return response.data.isValid;
        } catch (error) {
            return false;
        }
    }
};