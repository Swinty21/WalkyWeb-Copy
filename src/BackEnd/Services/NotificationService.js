import { NotificationDataAccess } from "../DataAccess/NotificationDataAccess.js";

export const NotificationService = {
    async getNotificationsForUser(userId, page = 1, limit = 10, searchTerm = "") {
        if (!userId) {
            throw new Error("User ID is required");
        }

        try {
            
            const response = await NotificationDataAccess.getNotificationsByUser(userId, page, limit, searchTerm);
            
            if (response && response.data) {
                return {
                    notifications: response.data.notifications || [],
                    currentPage: response.data.pagination?.currentPage || page,
                    totalPages: response.data.pagination?.totalPages || 1,
                    totalCount: response.data.pagination?.totalCount || 0,
                    hasNextPage: response.data.pagination?.hasNextPage || false,
                    hasPrevPage: response.data.pagination?.hasPrevPage || false
                };
            }
            
            return {
                notifications: Array.isArray(response) ? response : [],
                currentPage: page,
                totalPages: 1,
                totalCount: Array.isArray(response) ? response.length : 0,
                hasNextPage: false,
                hasPrevPage: false
            };
            
        } catch (error) {
            console.error('Error in NotificationService.getNotificationsForUser:', error);
            throw new Error(`Failed to get notifications: ${error.message}`);
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
            const notification = await NotificationDataAccess.getNotificationById(notificationId, userId);
            
            if (!notification) {
                throw new Error("Notification not found or does not belong to user");
            }

            return {
                id: notification.id,
                title: notification.title,
                content: notification.content,
                type: notification.type,
                date: notification.date,
                read: notification.read,
                walkerName: notification.walkerName
            };
        } catch (error) {
            console.error('Error in NotificationService.getNotificationById:', error);
            throw new Error(`Failed to get notification: ${error.message}`);
        }
    },

    async markAsRead(notificationId, userId) {
        if (!notificationId) {
            throw new Error("Notification ID is required");
        }
        if (!userId) {
            throw new Error("User ID is required");
        }

        try {
            const result = await NotificationDataAccess.setNotificationReaded(notificationId, userId);
            
            if (!result.success) {
                throw new Error("Failed to mark notification as read");
            }

            console.log(`Notification ${notificationId} for user ${userId} marked as read`);
            return result;
        } catch (error) {
            console.error('Error in NotificationService.markAsRead:', error);
            throw new Error(`Failed to mark notification as read: ${error.message}`);
        }
    },

    async createNotification(notificationData) {
        if (!notificationData.userId) {
            throw new Error("User ID is required");
        }
        if (!notificationData.title) {
            throw new Error("Title is required");
        }
        if (!notificationData.content) {
            throw new Error("Content is required");
        }

        try {
            const result = await NotificationDataAccess.createNotification(notificationData);
            
            if (!result.success) {
                throw new Error("Failed to create notification");
            }

            console.log("Notification created successfully:", result.notification);
            return result;
        } catch (error) {
            console.error('Error in NotificationService.createNotification:', error);
            throw new Error(`Failed to create notification: ${error.message}`);
        }
    },

    async getNotificationStats(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        try {
            const stats = await NotificationDataAccess.getNotificationStats(userId);
            return stats;
        } catch (error) {
            console.error('Error in NotificationService.getNotificationStats:', error);
            throw new Error(`Failed to get notification stats: ${error.message}`);
        }
    },

    async markAllAsRead(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        try {
            const result = await NotificationDataAccess.markAllAsRead(userId);
            
            if (!result.success) {
                throw new Error("Failed to mark all notifications as read");
            }

            console.log(`All notifications for user ${userId} marked as read`);
            return result;
        } catch (error) {
            console.error('Error in NotificationService.markAllAsRead:', error);
            throw new Error(`Failed to mark all notifications as read: ${error.message}`);
        }
    }
};