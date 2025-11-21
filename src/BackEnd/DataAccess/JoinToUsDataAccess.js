import { JoinToUsAPI } from "../API/JoinToUsAPI.js";

export const JoinToUsDataAccess = {
    async createRegistration(registration) {
        return await JoinToUsAPI.createRegistration(registration);
    },

    async getAllRegistrations() {
        return await JoinToUsAPI.getAllRegistrations();
    },

    async getRegistrationById(registrationId) {
        return await JoinToUsAPI.getRegistrationById(registrationId);
    },

    async updateRegistration(registrationId, updateData) {
        return await JoinToUsAPI.updateRegistration(registrationId, updateData);
    },

    async deleteRegistration(registrationId) {
        return await JoinToUsAPI.deleteRegistration(registrationId);
    },

    async getRegistrationsByStatus(status) {
        return await JoinToUsAPI.getRegistrationsByStatus(status);
    },

    async getApplicationByUserId(userId) {
        return await JoinToUsAPI.getApplicationByUserId(userId);
    },

    async getRegistrationStatistics() {
        return await JoinToUsAPI.getRegistrationStatistics();
    },

    async promoteUserToWalker(userId) {
        return await JoinToUsAPI.promoteUserToWalker(userId);
    }
};