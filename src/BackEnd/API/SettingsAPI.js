import apiClient from '../ApiClient.js';

export const SettingsAPI = {
    async getUserSettings(userId) {
        try {
            if (!userId) {
                throw new Error('ID de usuario requerido');
            }

            const response = await apiClient.get(`/settings/users/${userId}`);
            return response.data.settings || null;
        } catch (error) {
            console.error(`Error al obtener configuraciones del usuario ${userId}:`, error);
            throw error;
        }
    },

    async updateUserSettings(userId, settings) {
        try {
            if (!userId) {
                throw new Error('ID de usuario requerido');
            }

            if (!settings) {
                throw new Error('Datos de configuración requeridos');
            }

            const response = await apiClient.put(`/settings/users/${userId}`, settings);
            return response.data.settings || null;
        } catch (error) {
            console.error(`Error al actualizar configuraciones del usuario ${userId}:`, error);
            throw error;
        }
    },

    async getUserSubscription(userId) {
        try {
            if (!userId) {
                throw new Error('ID de usuario requerido');
            }

            const response = await apiClient.get(`/settings/users/${userId}/subscription`);
            return response.data.subscription || null;
        } catch (error) {
            console.error(`Error al obtener suscripción del usuario ${userId}:`, error);
            if (error.message && error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    },

    async updateSubscription(userId, subscriptionData) {
        try {
            if (!userId) {
                throw new Error('ID de usuario requerido');
            }

            if (!subscriptionData) {
                throw new Error('Datos de suscripción requeridos');
            }

            const response = await apiClient.put(`/settings/users/${userId}/subscription`, subscriptionData);
            return response.data.subscription || null;
        } catch (error) {
            console.error(`Error al actualizar suscripción del usuario ${userId}:`, error);
            throw error;
        }
    },

    async getSubscriptionPlans() {
        try {
            const response = await apiClient.get('/settings/subscription-plans?active=true');
            return response.data.plans || [];
        } catch (error) {
            console.error('Error al obtener planes de suscripción activos:', error);
            throw error;
        }
    },

    async getAllSubscriptionPlans() {
        try {
            const response = await apiClient.get('/settings/subscription-plans/all');
            return response.data.plans || [];
        } catch (error) {
            console.error('Error al obtener todos los planes de suscripción:', error);
            throw error;
        }
    },

    async getActiveSubscriptionPlans() {
        try {
            const response = await apiClient.get('/settings/subscription-plans/active');
            return response.data.plans || [];
        } catch (error) {
            console.error('Error al obtener planes de suscripción activos:', error);
            throw error;
        }
    },

    async getSubscriptionPlanById(planId) {
        try {
            if (!planId) {
                throw new Error('ID de plan requerido');
            }

            const response = await apiClient.get(`/settings/subscription-plans/${planId}`);
            return response.data.plan || null;
        } catch (error) {
            console.error(`Error al obtener plan ${planId}:`, error);
            if (error.message && error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    },

    async createSubscriptionPlan(planData) {
        try {
            if (!planData) {
                throw new Error('Datos de plan requeridos');
            }

            const { plan_id, name, price, features } = planData;

            if (!plan_id || !name || price === undefined || !features) {
                throw new Error('plan_id, name, price y features son requeridos');
            }

            const response = await apiClient.post('/settings/subscription-plans', planData);
            return response.data.plan || null;
        } catch (error) {
            console.error('Error al crear plan de suscripción:', error);
            throw error;
        }
    },

    async updateSubscriptionPlan(planId, planData) {
        try {
            if (!planId) {
                throw new Error('ID de plan requerido');
            }

            if (!planData) {
                throw new Error('Datos de plan requeridos');
            }

            const response = await apiClient.put(`/settings/subscription-plans/${planId}`, planData);
            return response.data.plan || null;
        } catch (error) {
            console.error(`Error al actualizar plan ${planId}:`, error);
            throw error;
        }
    },

    async deleteSubscriptionPlan(planId) {
        try {
            if (!planId) {
                throw new Error('ID de plan requerido');
            }

            const response = await apiClient.delete(`/settings/subscription-plans/${planId}`);
            return response.data || { message: 'Plan eliminado exitosamente' };
        } catch (error) {
            console.error(`Error al eliminar plan ${planId}:`, error);
            throw error;
        }
    },

    async togglePlanStatus(planId) {
        try {
            if (!planId) {
                throw new Error('ID de plan requerido');
            }

            const response = await apiClient.patch(`/settings/subscription-plans/${planId}/toggle-status`);
            return response.data.plan || null;
        } catch (error) {
            console.error(`Error al cambiar estado del plan ${planId}:`, error);
            throw error;
        }
    },

    async getUsersWithPlan(planId) {
        try {
            if (!planId) {
                throw new Error('ID de plan requerido');
            }

            const response = await apiClient.get(`/settings/subscription-plans/${planId}/users`);
            return response.data.users || [];
        } catch (error) {
            console.error(`Error al obtener usuarios con plan ${planId}:`, error);
            throw error;
        }
    },

    async getSubscriptionStats() {
        try {
            const response = await apiClient.get('/settings/subscription-stats');
            return response.data.stats || null;
        } catch (error) {
            console.error('Error al obtener estadísticas de suscripciones:', error);
            throw error;
        }
    },

    async getPlanFeatures(planId) {
        try {
            if (!planId) {
                throw new Error('ID de plan requerido');
            }

            const response = await apiClient.get(`/settings/subscription-plans/${planId}/features`);
            return response.data.features || null;
        } catch (error) {
            console.error(`Error al obtener características del plan ${planId}:`, error);
            throw error;
        }
    },

    async validatePlanTransition(fromPlanId, toPlanId) {
        try {
            if (!toPlanId) {
                throw new Error('ID de plan destino requerido');
            }

            const response = await apiClient.get(`/settings/plan-transition/${fromPlanId || 'free'}/${toPlanId}/validate`);
            return response.data.validation || null;
        } catch (error) {
            console.error(`Error al validar transición de plan ${fromPlanId} a ${toPlanId}:`, error);
            throw error;
        }
    }
};