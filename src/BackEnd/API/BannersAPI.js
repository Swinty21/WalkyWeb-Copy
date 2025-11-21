import apiClient from '../ApiClient.js';

export const BannersAPI = {
    
    async getAllBanners() {
        try {
            const response = await apiClient.get('/banners');
            return response.data.banners;
        } catch (error) {
            console.error('Error al obtener banners:', error.message);
            throw new Error(error.message || 'Error al obtener banners');
        }
    },

    async getActiveBanners() {
        try {
            const response = await apiClient.get('/banners/active');
            return response.data.banners;
        } catch (error) {
            console.error('Error al obtener banners activos:', error.message);
            throw new Error(error.message || 'Error al obtener banners activos');
        }
    },

    async getBannerById(bannerId) {
        try {
            if (!bannerId) {
                throw new Error('ID de banner requerido');
            }

            const response = await apiClient.get(`/banners/${bannerId}`);
            return response.data.banner;
        } catch (error) {
            console.error(`Error al obtener banner ${bannerId}:`, error.message);
            
            if (error.message.includes('404') || error.message.includes('no encontrado')) {
                return null;
            }
            
            throw new Error(error.message || 'Error al obtener banner');
        }
    },

    async createBanner(bannerData) {
        try {
            if (!bannerData) {
                throw new Error('Datos de banner requeridos');
            }

            if (!bannerData.title || bannerData.title.trim() === '') {
                throw new Error('Título es requerido');
            }

            if (!bannerData.description || bannerData.description.trim() === '') {
                throw new Error('Descripción es requerida');
            }

            if (!bannerData.image || bannerData.image.trim() === '') {
                throw new Error('Imagen es requerida');
            }

            const response = await apiClient.post('/banners', bannerData);
            return response.data.banner;
        } catch (error) {
            console.error('Error al crear banner:', error.message);
            throw new Error(error.message || 'Error al crear banner');
        }
    },

    async updateBanner(bannerId, bannerData) {
        try {
            if (!bannerId) {
                throw new Error('ID de banner requerido');
            }

            if (!bannerData || Object.keys(bannerData).length === 0) {
                throw new Error('Datos de banner requeridos');
            }

            const response = await apiClient.put(`/banners/${bannerId}`, bannerData);
            return response.data.banner;
        } catch (error) {
            console.error(`Error al actualizar banner ${bannerId}:`, error.message);
            
            if (error.message.includes('404') || error.message.includes('no encontrado')) {
                throw new Error('Banner no encontrado');
            }
            
            throw new Error(error.message || 'Error al actualizar banner');
        }
    },

    async deleteBanner(bannerId) {
        try {
            if (!bannerId) {
                throw new Error('ID de banner requerido');
            }

            const response = await apiClient.delete(`/banners/${bannerId}`);
            return { 
                message: response.message || 'Banner eliminado exitosamente',
                bannerId: response.data?.bannerId || bannerId 
            };
        } catch (error) {
            console.error(`Error al eliminar banner ${bannerId}:`, error.message);
            
            if (error.message.includes('404') || error.message.includes('no encontrado')) {
                throw new Error('Banner no encontrado');
            }
            
            throw new Error(error.message || 'Error al eliminar banner');
        }
    },

    async toggleBannerStatus(bannerId) {
        try {
            if (!bannerId) {
                throw new Error('ID de banner requerido');
            }

            const response = await apiClient.patch(`/banners/${bannerId}/toggle-status`);
            return response.data.banner;
        } catch (error) {
            console.error(`Error al cambiar estado del banner ${bannerId}:`, error.message);
            
            if (error.message.includes('404') || error.message.includes('no encontrado')) {
                throw new Error('Banner no encontrado');
            }
            
            if (error.message.includes('máximo 3 banners activos')) {
                throw new Error('Solo se pueden tener máximo 3 banners activos');
            }
            
            throw new Error(error.message || 'Error al cambiar estado del banner');
        }
    },

    async validateBanner(bannerId) {
        try {
            if (!bannerId) {
                throw new Error('ID de banner requerido');
            }

            const response = await apiClient.get(`/banners/${bannerId}/validate`);
            return response.data.isValid;
        } catch (error) {
            console.error(`Error al validar banner ${bannerId}:`, error.message);
            // Si hay error, asumir que no es válido
            return false;
        }
    },

    async checkActiveBannersLimit() {
        try {
            const response = await apiClient.get('/banners/status/active-limit');
            return {
                activeBanners: response.data.activeBanners,
                maxAllowed: response.data.maxAllowed,
                canAddMore: response.data.canAddMore
            };
        } catch (error) {
            console.error('Error al verificar límite de banners activos:', error.message);
            return {
                activeBanners: 0,
                maxAllowed: 3,
                canAddMore: true
            };
        }
    },

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
};