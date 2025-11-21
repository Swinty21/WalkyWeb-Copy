import { JoinToUsService } from "../Services/JoinToUsService.js";

export const JoinToUsController = {
    async submitWalkerRegistration(registrationData) {
        try {
            return await JoinToUsService.submitWalkerRegistration(registrationData);
        } catch (error) {
            console.error('Error in JoinToUsController.submitWalkerRegistration:', error);
            throw error;
        }
    },

    async getApplicationByUserId(userId) {
        try {
            return await JoinToUsService.getApplicationByUserId(userId);
        } catch (error) {
            console.error('Error in JoinToUsController.getApplicationByUserId:', error);
            throw error;
        }
    },

    async retryRejectedApplication(userId) {
        try {
            return await JoinToUsService.retryRejectedApplication(userId);
        } catch (error) {
            console.error('Error in JoinToUsController.retryRejectedApplication:', error);
            throw error;
        }
    },

    async getAllRegistrations() {
        try {
            return await JoinToUsService.getAllRegistrations();
        } catch (error) {
            console.error('Error in JoinToUsController.getAllRegistrations:', error);
            throw error;
        }
    },

    async getRegistrationById(registrationId) {
        try {
            return await JoinToUsService.getRegistrationById(registrationId);
        } catch (error) {
            console.error('Error in JoinToUsController.getRegistrationById:', error);
            throw error;
        }
    },

    async updateRegistrationStatus(registrationId, status, adminNotes = '') {
        try {
            return await JoinToUsService.updateRegistrationStatus(registrationId, status, adminNotes);
        } catch (error) {
            console.error('Error in JoinToUsController.updateRegistrationStatus:', error);
            throw error;
        }
    },

    async deleteRegistration(registrationId) {
        try {
            return await JoinToUsService.deleteRegistration(registrationId);
        } catch (error) {
            console.error('Error in JoinToUsController.deleteRegistration:', error);
            throw error;
        }
    },

    async getRegistrationsByStatus(status) {
        try {
            return await JoinToUsService.getRegistrationsByStatus(status);
        } catch (error) {
            console.error('Error in JoinToUsController.getRegistrationsByStatus:', error);
            throw error;
        }
    },

    async getRegistrationStats() {
        try {
            return await JoinToUsService.getRegistrationStats();
        } catch (error) {
            console.error('Error in JoinToUsController.getRegistrationStats:', error);
            throw error;
        }
    },

    async promoteUserToWalker(userId) {
        try {
            return await JoinToUsService.promoteUserToWalker(userId);
        } catch (error) {
            console.error('Error in JoinToUsController.promoteUserToWalker:', error);
            throw error;
        }
    }
};