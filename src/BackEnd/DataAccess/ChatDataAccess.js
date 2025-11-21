import { ChatAPI } from "../API/ChatAPI.js";

export const ChatDataAccess = {
    async getChatMessages(tripId) {
        if (!tripId) {
            throw new Error("El ID del paseo es requerido");
        }
        
        const response = await ChatAPI.getChatMessages(tripId);
        
        if (!response || typeof response.chatId === 'undefined' || !Array.isArray(response.messages)) {
            throw new Error("Respuesta inválida del servidor");
        }
        
        return response;
    },

    async sendMessage(messageData) {
        if (!messageData.tripId || !messageData.message || !messageData.senderId) {
            throw new Error("El ID del paseo, el mensaje y el ID del emisor son requeridos");
        }
        
        const response = await ChatAPI.sendMessage(messageData);
        
        if (!response || !response.id) {
            throw new Error("Error al enviar el mensaje");
        }
        
        return response;
    },

    async markMessagesAsRead(tripId, userId) {
        if (!tripId || !userId) {
            throw new Error("El ID del paseo y el ID del usuario son requeridos");
        }
        
        const response = await ChatAPI.markMessagesAsRead(tripId, userId);
        
        if (!response || !response.success) {
            throw new Error("Error al marcar mensajes como leídos");
        }
        
        return response;
    },

    async getUnreadCount(userId) {
        if (!userId) {
            throw new Error("El ID del usuario es requerido");
        }
        
        const response = await ChatAPI.getUnreadCount(userId);
        
        if (!response || typeof response.unreadCount === 'undefined') {
            throw new Error("Error al obtener contador de mensajes no leídos");
        }
        
        return response.unreadCount;
    }
};