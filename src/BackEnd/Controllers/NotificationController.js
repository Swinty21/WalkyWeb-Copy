import { NotificationService } from "../Services/NotificationService.js";

export const NotificationController = {
    async fetchNotifications(userId, page = 1, limit = 10, searchTerm = "") {
        try {
            if (!userId) {
                throw new Error("User ID is required");
            }

            return await NotificationService.getNotificationsForUser(userId, page, limit, searchTerm);
        } catch (error) {
            console.error("Error in fetchNotifications:", error);
            throw new Error(`Failed to fetch notifications: ${error.message}`);
        }
    },

    async fetchNotificationById(notificationId, userId) {
        try {
            if (!notificationId) {
                throw new Error("Notification ID is required");
            }
            if (!userId) {
                throw new Error("User ID is required");
            }

            return await NotificationService.getNotificationById(notificationId, userId);
        } catch (error) {
            console.error("Error in fetchNotificationById:", error);
            throw new Error(`Failed to fetch notification: ${error.message}`);
        }
    },

    async markNotificationAsRead(notificationId, userId) {
        try {
            if (!notificationId) {
                throw new Error("Notification ID is required");
            }
            if (!userId) {
                throw new Error("User ID is required");
            }

            return await NotificationService.markAsRead(notificationId, userId);
        } catch (error) {
            console.error("Error in markNotificationAsRead:", error);
            throw new Error(`Failed to mark notification as read: ${error.message}`);
        }
    }
};