import ApiClient from '../ApiClient.js';

export const ChatAPI = {
    async getChatMessages(tripId) {
        try {
            const response = await ApiClient.get(`/chat/walks/${tripId}/messages`);
            return response.data;
        } catch (error) {
            console.error('Error obteniendo mensajes del chat:', error);
            throw error;
        }
    },

    async sendMessage(messageData) {
        try {
            const { tripId, senderId, senderType, senderName, message } = messageData;
            
            const response = await ApiClient.post(`/chat/walks/${tripId}/messages`, {
                senderId,
                senderType,
                senderName,
                message
            });
            
            return response.data;
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            throw error;
        }
    },

    async markMessagesAsRead(tripId, userId) {
        try {
            const response = await ApiClient.put(`/chat/walks/${tripId}/messages/read`, {
                userId
            });
            
            return response.data;
        } catch (error) {
            console.error('Error marcando mensajes como leídos:', error);
            throw error;
        }
    },

    async getUnreadCount(userId) {
        try {
            const response = await ApiClient.get(`/chat/users/${userId}/unread-count`);
            return response.data;
        } catch (error) {
            console.error('Error obteniendo contador de no leídos:', error);
            throw error;
        }
    }
};