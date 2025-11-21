import { SettingsDataAccess } from "../DataAccess/SettingsDataAccess.js";

export const SettingsService = {
    async getUserSettings(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const userSettings = await SettingsDataAccess.getUserSettings(userId);
        
        return {
            email: userSettings.email || '',
            notifications: {
                walkStatus: userSettings.notifications?.walkStatus ?? userSettings.notification_walk_status ?? true,
                announcements: userSettings.notifications?.announcements ?? userSettings.notification_announcements ?? true,
                subscription: userSettings.notifications?.subscription ?? userSettings.notification_subscription ?? true,
                messages: userSettings.notifications?.messages ?? userSettings.notification_messages ?? true,
                systemAlerts: userSettings.notifications?.systemAlerts ?? userSettings.notification_system_alerts ?? true
            },
            updatedAt: userSettings.updated_at || userSettings.updatedAt
        };
    },

    async updateUserSettings(userId, settings) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        if (!settings) {
            throw new Error("Settings data is required");
        }

        if (settings.email && !this.isValidEmail(settings.email)) {
            throw new Error("Invalid email format");
        }

        if (settings.notifications) {
            this.validateNotificationSettings(settings.notifications);
        }

        const updatedSettings = await SettingsDataAccess.updateUserSettings(userId, settings);
        
        return {
            email: updatedSettings.email,
            notifications: {
                walkStatus: updatedSettings.notifications?.walkStatus ?? updatedSettings.notification_walk_status,
                announcements: updatedSettings.notifications?.announcements ?? updatedSettings.notification_announcements,
                subscription: updatedSettings.notifications?.subscription ?? updatedSettings.notification_subscription,
                messages: updatedSettings.notifications?.messages ?? updatedSettings.notification_messages,
                systemAlerts: updatedSettings.notifications?.systemAlerts ?? updatedSettings.notification_system_alerts
            },
            updatedAt: updatedSettings.updated_at || updatedSettings.updatedAt
        };
    },

    async getUserSubscription(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const subscription = await SettingsDataAccess.getUserSubscription(userId);
        
        if (!subscription) {
            return {
                plan: 'free',
                expiryDate: null,
                isActive: true,
                startDate: null
            };
        }

        const isActive = subscription.expiry_date ? 
            new Date(subscription.expiry_date) > new Date() : 
            subscription.is_active ?? subscription.isActive ?? true;

        return {
            plan: subscription.plan,
            expiryDate: subscription.expiry_date || subscription.expiryDate,
            isActive: isActive,
            startDate: subscription.start_date || subscription.startDate
        };
    },

    async updateSubscription(userId, planId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        if (!planId) {
            throw new Error("Plan ID is required");
        }

        const availablePlans = await this.getActiveSubscriptionPlans();
        const selectedPlan = availablePlans.find(plan => (plan.plan_id || plan.id) === planId);
        
        if (!selectedPlan && planId !== 'free') {
            throw new Error("Invalid plan selected");
        }

        const currentSubscription = await SettingsDataAccess.getUserSubscription(userId);
        
        if (currentSubscription?.plan === planId) {
            return {
                plan: currentSubscription.plan,
                expiryDate: currentSubscription.expiry_date || currentSubscription.expiryDate,
                isActive: currentSubscription.is_active ?? currentSubscription.isActive,
                startDate: currentSubscription.start_date || currentSubscription.startDate
            };
        }

        let expiryDate = null;
        let startDate = new Date().toISOString();

        if (planId !== 'free' && selectedPlan) {
            expiryDate = new Date();
            switch (selectedPlan.duration) {
                case 'weekly':
                    expiryDate.setDate(expiryDate.getDate() + 7);
                    break;
                case 'monthly':
                    expiryDate.setMonth(expiryDate.getMonth() + 1);
                    break;
                case 'yearly':
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                    break;
                case 'forever':
                    expiryDate = null;
                    break;
                default:
                    expiryDate.setMonth(expiryDate.getMonth() + 1);
            }
            expiryDate = expiryDate ? expiryDate.toISOString() : null;
        }

        const subscriptionData = {
            plan: planId,
            expiry_date: expiryDate,
            is_active: true,
            start_date: startDate
        };

        const updatedSubscription = await SettingsDataAccess.updateSubscription(userId, subscriptionData);

        return {
            plan: updatedSubscription.plan,
            expiryDate: updatedSubscription.expiry_date || updatedSubscription.expiryDate,
            isActive: updatedSubscription.is_active ?? updatedSubscription.isActive,
            startDate: updatedSubscription.start_date || updatedSubscription.startDate
        };
    },

    async getAllSubscriptionPlans() {
        const plans = await SettingsDataAccess.getAllSubscriptionPlans();
        return plans.sort((a, b) => a.price - b.price);
    },

    async getActiveSubscriptionPlans() {
        const plans = await SettingsDataAccess.getActiveSubscriptionPlans();
        return plans.sort((a, b) => a.price - b.price);
    },

    async getSubscriptionPlanById(planId) {
        if (!planId) {
            throw new Error("Plan ID is required");
        }

        const plan = await SettingsDataAccess.getSubscriptionPlanById(planId);
        
        if (!plan) {
            throw new Error("Plan not found");
        }

        return plan;
    },

    async createSubscriptionPlan(planData) {
        if (!planData.plan_id || !planData.name || planData.price === undefined) {
            throw new Error("plan_id, nombre y precio son requeridos");
        }

        if (planData.plan_id.length < 3) {
            throw new Error("El plan_id debe tener al menos 3 caracteres");
        }

        if (planData.name.length < 3) {
            throw new Error("El nombre debe tener al menos 3 caracteres");
        }

        if (planData.price < 0) {
            throw new Error("El precio no puede ser negativo");
        }

        if (!Array.isArray(planData.features) || planData.features.length === 0) {
            throw new Error("Debe incluir al menos una característica");
        }

        if (planData.max_walks < -1) {
            throw new Error("El número máximo de paseos no puede ser menor a -1 (usa -1 para ilimitado)");
        }

        try {
            const existingPlan = await SettingsDataAccess.getSubscriptionPlanById(planData.plan_id);
            if (existingPlan) {
                throw new Error("Ya existe un plan con este ID");
            }
        } catch (error) {
            if (!error.message.includes('Plan not found') && 
                !error.message.includes('Plan no encontrado') &&
                !error.message.includes('404')) {
                throw error;
            }
        }

        if (planData.is_active || planData.isActive) {
            const activePlans = await SettingsDataAccess.getActiveSubscriptionPlans();
            const activeCount = activePlans.filter(plan => (plan.plan_id || plan.id) !== 'free').length;
            if (activeCount >= 3) {
                throw new Error("Solo se pueden tener máximo 3 planes activos (además del plan gratuito)");
            }
        }

        const newPlanData = {
            plan_id: planData.plan_id,
            name: planData.name,
            price: planData.price,
            duration: planData.duration || 'monthly',
            category: planData.category || 'standard',
            description: planData.description || '',
            max_walks: planData.max_walks || 0,
            features: planData.features,
            support_level: planData.support_level || 'email',
            cancellation_policy: planData.cancellation_policy || 'none',
            discount_percentage: planData.discount_percentage || 0,
            is_active: planData.is_active || planData.isActive || false
        };

        const newPlan = await SettingsDataAccess.createSubscriptionPlan(newPlanData);
        return newPlan;
    },

    async updateSubscriptionPlan(planId, planData) {
        if (!planId) {
            throw new Error("Plan ID is required");
        }

        if (planId === 'free') {
            throw new Error("El plan gratuito no se puede modificar");
        }

        const existingPlan = await SettingsDataAccess.getSubscriptionPlanById(planId);
        if (!existingPlan) {
            throw new Error("Plan no encontrado");
        }

        if (planData.name && planData.name.length < 3) {
            throw new Error("El nombre debe tener al menos 3 caracteres");
        }

        if (planData.price !== undefined && planData.price < 0) {
            throw new Error("El precio no puede ser negativo");
        }

        if (planData.features && (!Array.isArray(planData.features) || planData.features.length === 0)) {
            throw new Error("Debe incluir al menos una característica");
        }

        if (planData.max_walks !== undefined && planData.max_walks < -1) {
            throw new Error("El número máximo de paseos no puede ser menor a -1 (usa -1 para ilimitado)");
        }

        const isActivating = (planData.is_active === true || planData.isActive === true) && !existingPlan.is_active;
        if (isActivating) {
            const activePlans = await SettingsDataAccess.getActiveSubscriptionPlans();
            const activeCount = activePlans.filter(plan => (plan.plan_id || plan.id) !== 'free').length;
            if (activeCount >= 3) {
                throw new Error("Solo se pueden tener máximo 3 planes activos (además del plan gratuito)");
            }
        }

        const updatedPlan = await SettingsDataAccess.updateSubscriptionPlan(planId, planData);
        return updatedPlan;
    },

    async deleteSubscriptionPlan(planId) {
        if (!planId) {
            throw new Error("Plan ID is required");
        }

        if (planId === 'free') {
            throw new Error("El plan gratuito no se puede eliminar");
        }

        const existingPlan = await SettingsDataAccess.getSubscriptionPlanById(planId);
        if (!existingPlan) {
            throw new Error("Plan no encontrado");
        }

        const usersWithPlan = await SettingsDataAccess.getUsersWithPlan(planId);
        if (usersWithPlan.length > 0) {
            throw new Error("No se puede eliminar un plan que tiene usuarios suscritos");
        }

        await SettingsDataAccess.deleteSubscriptionPlan(planId);
        
        return { message: "Plan eliminado exitosamente" };
    },

    async togglePlanStatus(planId) {
        if (!planId) {
            throw new Error("Plan ID is required");
        }

        if (planId === 'free') {
            throw new Error("El estado del plan gratuito no se puede cambiar");
        }

        const existingPlan = await SettingsDataAccess.getSubscriptionPlanById(planId);
        if (!existingPlan) {
            throw new Error("Plan no encontrado");
        }

        if (!existingPlan.is_active) {
            const activePlans = await SettingsDataAccess.getActiveSubscriptionPlans();
            const activeCount = activePlans.filter(plan => (plan.plan_id || plan.id) !== 'free').length;
            if (activeCount >= 3) {
                throw new Error("Solo se pueden tener máximo 3 planes activos (además del plan gratuito)");
            }
        }

        const updatedPlan = await SettingsDataAccess.togglePlanStatus(planId);
        return updatedPlan;
    },

    async validateSubscriptionUpgrade(userId, newPlanId) {
        const currentSubscription = await this.getUserSubscription(userId);
        const currentPlan = await this.getSubscriptionPlanById(currentSubscription.plan);
        const newPlan = await this.getSubscriptionPlanById(newPlanId);

        const planHierarchy = { free: 0, bronze: 1, silver: 2, gold: 3, platinum: 4 };
        
        return {
            isUpgrade: planHierarchy[newPlanId] > planHierarchy[currentSubscription.plan],
            isDowngrade: planHierarchy[newPlanId] < planHierarchy[currentSubscription.plan],
            priceDifference: newPlan.price - currentPlan.price,
            currentPlan: currentPlan,
            newPlan: newPlan
        };
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validateNotificationSettings(notifications) {
        const validKeys = ['walkStatus', 'announcements', 'subscription', 'messages', 'systemAlerts'];
        
        Object.keys(notifications).forEach(key => {
            if (!validKeys.includes(key)) {
                throw new Error(`Invalid notification setting: ${key}`);
            }
            
            if (typeof notifications[key] !== 'boolean') {
                throw new Error(`Notification setting ${key} must be boolean`);
            }
        });
    },

    calculateProrationAmount(currentPlan, newPlan, daysRemaining) {
        if (!currentPlan || !newPlan) return 0;
        
        let daysInPeriod = 30;
        switch (currentPlan.duration) {
            case 'weekly': daysInPeriod = 7; break;
            case 'yearly': daysInPeriod = 365; break;
            case 'monthly': 
            default: daysInPeriod = 30; break;
        }
        
        const dailyRateCurrent = currentPlan.price / daysInPeriod;
        const dailyRateNew = newPlan.price / daysInPeriod;
        
        return (dailyRateNew - dailyRateCurrent) * daysRemaining;
    },

    getDaysUntilExpiry(expiryDate) {
        if (!expiryDate) return null;
        
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffTime = expiry - today;
        
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    isSubscriptionExpiringSoon(expiryDate, daysThreshold = 7) {
        const daysRemaining = this.getDaysUntilExpiry(expiryDate);
        return daysRemaining !== null && daysRemaining <= daysThreshold && daysRemaining > 0;
    },

    getSubscriptionPlans(){
        return SettingsDataAccess.getSubscriptionPlans();
    }
};