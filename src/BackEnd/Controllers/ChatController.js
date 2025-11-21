import { ChatService } from "../Services/ChatService.js";

export const ChatController = {
    async fetchChatMessages(tripId) {
        try {
            return await ChatService.getChatMessages(tripId);
        } catch (error) {
            console.error('Error obteniendo mensajes del chat:', error);
            throw new Error('Error al cargar los mensajes del chat: ' + error.message);
        }
    },

    async sendMessage(tripId, userId, userType, userName, message) {
        try {
            // Validaciones
            ChatService.validateMessageLength(message);
            
            return await ChatService.sendMessage(tripId, userId, userType, userName, message);
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            throw new Error('Error al enviar el mensaje: ' + error.message);
        }
    },

    async markMessagesAsRead(tripId, userId) {
        try {
            return await ChatService.markMessagesAsRead(tripId, userId);
        } catch (error) {
            console.error('Error marcando mensajes como leídos:', error);
            throw new Error('Error al marcar mensajes como leídos: ' + error.message);
        }
    },

    async getUnreadCount(userId) {
        try {
            return await ChatService.getUnreadCount(userId);
        } catch (error) {
            console.error('Error obteniendo contador de no leídos:', error);
            throw new Error('Error al obtener mensajes no leídos: ' + error.message);
        }
    },

    // Validar si el chat está visible según el estado del paseo
    isChatVisible(walkStatus) {
        return ChatService.validateChatVisible(walkStatus);
    },

    // Validar si se pueden enviar mensajes según el estado del paseo
    canSendMessages(walkStatus) {
        return ChatService.validateCanSendMessages(walkStatus);
    },

    // Obtener mensaje de estado del chat
    getChatStatusMessage(walkStatus) {
        return ChatService.getChatStatusMessage(walkStatus);
    },

    // Métodos de conveniencia para diferentes tipos de usuario
    async sendOwnerMessage(tripId, userId, userName, message) {
        return await this.sendMessage(tripId, userId, 'owner', userName, message);
    },

    async sendWalkerMessage(tripId, userId, userName, message) {
        return await this.sendMessage(tripId, userId, 'walker', userName, message);
    }
};