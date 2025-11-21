import { SettingsAPI } from "../API/SettingsAPI.js";

export const SettingsDataAccess = {
    async getUserSettings(userId) {
        return await SettingsAPI.getUserSettings(userId);
    },

    async updateUserSettings(userId, settings) {
        return await SettingsAPI.updateUserSettings(userId, settings);
    },

    async getUserSubscription(userId) {
        return await SettingsAPI.getUserSubscription(userId);
    },

    async updateSubscription(userId, subscriptionData) {
        return await SettingsAPI.updateSubscription(userId, subscriptionData);
    },

    async getSubscriptionPlans() {
        return await SettingsAPI.getSubscriptionPlans();
    },

    async getAllSubscriptionPlans() {
        return await SettingsAPI.getAllSubscriptionPlans();
    },

    async getActiveSubscriptionPlans() {
        return await SettingsAPI.getActiveSubscriptionPlans();
    },

    async getSubscriptionPlanById(planId) {
        return await SettingsAPI.getSubscriptionPlanById(planId);
    },

    async createSubscriptionPlan(planData) {
        return await SettingsAPI.createSubscriptionPlan(planData);
    },

    async updateSubscriptionPlan(planId, planData) {
        return await SettingsAPI.updateSubscriptionPlan(planId, planData);
    },

    async deleteSubscriptionPlan(planId) {
        return await SettingsAPI.deleteSubscriptionPlan(planId);
    },

    async togglePlanStatus(planId) {
        return await SettingsAPI.togglePlanStatus(planId);
    },

    async getUsersWithPlan(planId) {
        return await SettingsAPI.getUsersWithPlan(planId);
    },

    async getSubscriptionStats() {
        return await SettingsAPI.getSubscriptionStats();
    },

    async getPlanFeatures(planId) {
        return await SettingsAPI.getPlanFeatures(planId);
    },

    async validatePlanTransition(fromPlanId, toPlanId) {
        return await SettingsAPI.validatePlanTransition(fromPlanId, toPlanId);
    }
};