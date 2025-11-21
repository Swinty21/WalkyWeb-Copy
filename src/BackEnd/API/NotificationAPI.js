import apiClient from '../ApiClient.js';

export const NotificationAPI = {
    async getNotificationsByUser(userId, page = 1, limit = 10, searchTerm = "") {
        try {
            const queryParams = new URLSearchParams({
                userId: userId.toString(),
                page: page.toString(),
                limit: limit.toString(),
                search: searchTerm
            });

            const response = await apiClient.get(`/notifications?${queryParams}`);
            
            if (response.status === 'success') {
                return response;
            }
            
            throw new Error(response.message || 'Error al obtener notificaciones');
        } catch (error) {
            console.error('Error getting notifications:', error);
            throw error;
        }
    },

    async getNotificationById(id, userId) {
        try {
            const queryParams = new URLSearchParams({
                userId: userId.toString()
            });

            const response = await apiClient.get(`/notifications/${id}?${queryParams}`);
            
            if (response.status === 'success') {
                return response.data.notification;
            }
            
            throw new Error(response.message || 'Error al obtener notificación');
        } catch (error) {
            console.error('Error getting notification by id:', error);
            throw error;
        }
    },

    async setNotificationReaded(notificationId, userId) {
        try {
            const response = await apiClient.patch(`/notifications/${notificationId}/read`, {
                userId
            });
            
            if (response.status === 'success') {
                return {
                    success: response.data.success,
                    message: response.message
                };
            }
            
            throw new Error(response.message || 'Error al marcar notificación como leída');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    async createNotification(notificationData) {
        try {
            const requestData = {
                title: notificationData.title,
                content: notificationData.content,
                type: notificationData.type || "info",
                walkerName: notificationData.walkerName || null,
                targetUserId: notificationData.userId
            };

            const response = await apiClient.post('/notifications', requestData);
            
            if (response.status === 'success') {
                return {
                    success: true,
                    notification: response.data.notification
                };
            }
            
            throw new Error(response.message || 'Error al crear notificación');
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    },

    async getNotificationStats(userId) {
        try {
            const queryParams = new URLSearchParams({
                userId: userId.toString()
            });

            const response = await apiClient.get(`/notifications/stats?${queryParams}`);
            
            if (response.status === 'success') {
                return response.data.stats;
            }
            
            throw new Error(response.message || 'Error al obtener estadísticas de notificaciones');
        } catch (error) {
            console.error('Error getting notification stats:', error);
            throw error;
        }
    },

    async markAllAsRead(userId) {
        try {
            const response = await apiClient.patch('/notifications/mark-all-read', {
                userId
            });
            
            if (response.status === 'success') {
                return {
                    success: response.data.success,
                    message: response.message,
                    updatedCount: response.data.updatedCount
                };
            }
            
            throw new Error(response.message || 'Error al marcar todas las notificaciones como leídas');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }
};