import { SettingsService } from "../Services/SettingsService.js";

export const SettingsController = {
    async getUserSettings(userId) {
        return await SettingsService.getUserSettings(userId);
    },

    async updateUserSettings(userId, settings) {
        return await SettingsService.updateUserSettings(userId, settings);
    },

    async getUserSubscription(userId) {
        return await SettingsService.getUserSubscription(userId);
    },

    async updateSubscription(userId, planId) {
        return await SettingsService.updateSubscription(userId, planId);
    },

    async getSubscriptionPlans() {
        return await SettingsService.getActiveSubscriptionPlans();
    },

    async getAllSubscriptionPlans() {
        return await SettingsService.getAllSubscriptionPlans();
    },

    async getSubscriptionPlanById(planId) {
        return await SettingsService.getSubscriptionPlanById(planId);
    },

    async createSubscriptionPlan(planData) {
        return await SettingsService.createSubscriptionPlan(planData);
    },

    async updateSubscriptionPlan(planId, planData) {
        return await SettingsService.updateSubscriptionPlan(planId, planData);
    },

    async deleteSubscriptionPlan(planId) {
        return await SettingsService.deleteSubscriptionPlan(planId);
    },

    async togglePlanStatus(planId) {
        return await SettingsService.togglePlanStatus(planId);
    },

    async validateSubscriptionUpgrade(userId, newPlanId) {
        return await SettingsService.validateSubscriptionUpgrade(userId, newPlanId);
    }
};