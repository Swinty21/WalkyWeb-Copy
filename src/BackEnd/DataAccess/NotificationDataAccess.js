import { NotificationAPI } from "../API/NotificationAPI.js";

export const NotificationDataAccess = {
    async getNotificationsByUser(userId, page = 1, limit = 10, searchTerm = "") {
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        try {
            return await NotificationAPI.getNotificationsByUser(userId, page, limit, searchTerm);
        } catch (error) {
            console.error('Error in NotificationDataAccess.getNotificationsByUser:', error);
            throw error;
        }
    },

    async getNotificationById(notificationId, userId) {
        if (!notificationId) {
            throw new Error("Notification ID is required");
        }
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        try {
            return await NotificationAPI.getNotificationById(notificationId, userId);
        } catch (error) {
            console.error('Error in NotificationDataAccess.getNotificationById:', error);
            throw error;
        }
    },

    async setNotificationReaded(notificationId, userId) {
        if (!notificationId) {
            throw new Error("Notification ID is required");
        }
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        try {
            return await NotificationAPI.setNotificationReaded(notificationId, userId);
        } catch (error) {
            console.error('Error in NotificationDataAccess.setNotificationReaded:', error);
            throw error;
        }
    },

    async createNotification(notificationData) {
        if (!notificationData) {
            throw new Error("Notification data is required");
        }
        
        try {
            return await NotificationAPI.createNotification(notificationData);
        } catch (error) {
            console.error('Error in NotificationDataAccess.createNotification:', error);
            throw error;
        }
    },

    async getNotificationStats(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        try {
            return await NotificationAPI.getNotificationStats(userId);
        } catch (error) {
            console.error('Error in NotificationDataAccess.getNotificationStats:', error);
            throw error;
        }
    },

    async markAllAsRead(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        try {
            return await NotificationAPI.markAllAsRead(userId);
        } catch (error) {
            console.error('Error in NotificationDataAccess.markAllAsRead:', error);
            throw error;
        }
    }
};