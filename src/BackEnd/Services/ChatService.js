import { ChatDataAccess } from "../DataAccess/ChatDataAccess.js";

export const ChatService = {
    async getChatMessages(tripId) {
        const chatData = await ChatDataAccess.getChatMessages(tripId);
        
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
            return [];
        }
        
        // Transformamos los datos a DTO para la UI
        return chatData.messages.map(message => ({
            id: message.id,
            text: message.content,
            sender: message.senderType,
            senderName: message.senderName,
            timestamp: message.sentAt,
            time: new Date(message.sentAt).toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            read: message.isRead
        }));
    },

    async sendMessage(tripId, userId, userType, userName, messageText) {
        if (!messageText.trim()) {
            throw new Error("El mensaje no puede estar vacío");
        }

        // Validar longitud del mensaje
        this.validateMessageLength(messageText);

        const messageData = {
            tripId: tripId,
            senderId: userId,
            senderType: userType,
            senderName: userName,
            message: messageText.trim()
        };

        const sentMessage = await ChatDataAccess.sendMessage(messageData);
        
        // Retornamos en formato DTO
        return {
            id: sentMessage.id,
            text: sentMessage.content,
            sender: sentMessage.senderType,
            senderName: sentMessage.senderName,
            timestamp: sentMessage.sentAt,
            time: new Date(sentMessage.sentAt).toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            read: sentMessage.isRead
        };
    },

    async markMessagesAsRead(tripId, userId) {
        return await ChatDataAccess.markMessagesAsRead(tripId, userId);
    },

    async getUnreadCount(userId) {
        return await ChatDataAccess.getUnreadCount(userId);
    },

    // Validaciones de negocio
    validateMessageLength(message) {
        const MAX_LENGTH = 500;
        if (message.length > MAX_LENGTH) {
            throw new Error(`Mensaje muy largo. Máximo ${MAX_LENGTH} caracteres permitidos.`);
        }
        return true;
    },

    validateUserCanSendMessage(tripId, userId, tripData) {
        // Verificamos que el usuario sea owner o walker del trip
        if (!tripData) {
            throw new Error("Paseo no encontrado");
        }
        
        const isOwner = tripData.ownerId === userId;
        const isWalker = tripData.walkerId === userId;
        
        if (!isOwner && !isWalker) {
            throw new Error("Usuario no autorizado para enviar mensajes en este paseo");
        }
        
        return true;
    },

    // Validar si el chat se puede mostrar según el estado del paseo
    validateChatVisible(walkStatus) {
        if (!walkStatus) return false;
        
        const visibleStatuses = ['activo', 'finalizado'];
        return visibleStatuses.includes(walkStatus.toLowerCase());
    },

    // Validar si se pueden enviar mensajes según el estado del paseo
    validateCanSendMessages(walkStatus) {
        if (!walkStatus) return false;
        
        const sendableStatuses = ['activo'];
        return sendableStatuses.includes(walkStatus.toLowerCase());
    },

    getChatStatusMessage(walkStatus) {
        if (!walkStatus) return 'Estado del paseo desconocido';
        
        switch (walkStatus.toLowerCase()) {
            case 'agendado':
                return 'El chat se habilitará cuando el paseo esté activo';
            case 'finalizado':
                return 'El paseo ha finalizado. Solo lectura';
            case 'rechazado':
                return 'El paseo fue rechazado';
            case 'solicitado':
                return 'El paseo está pendiente de confirmación';
            case 'esperando_pago':
            case 'esperando pago':
                return 'El paseo está esperando confirmación de pago';
            case 'activo':
                return 'Chat activo';
            case 'cancelado':
                return 'El paseo fue cancelado';
            default:
                return 'Estado del paseo no reconocido';
        }
    }
};