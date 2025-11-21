import { TicketDataAccess } from "../DataAccess/TicketDataAccess.js";

export const TicketService = {
    async getFAQs() {
        const faqs = await TicketDataAccess.getFAQs();
        
        return faqs.map(faq => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category
        }));
    },

    async getTicketsByUser(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const tickets = await TicketDataAccess.getTicketsByUser(userId);
        
        return tickets
            .map(ticket => ({
                id: ticket.id,
                subject: ticket.subject,
                message: ticket.message,
                category: this.getCategoryLabel(ticket.category),
                status: ticket.status,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt,
                response: ticket.response,
                cancellationReason: ticket.cancellationReason
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async getAllTickets() {
        const tickets = await TicketDataAccess.getAllTickets();
        
        return tickets
            .map(ticket => ({
                id: ticket.id,
                userId: ticket.userId,
                subject: ticket.subject,
                message: ticket.message,
                category: this.getCategoryLabel(ticket.category),
                status: ticket.status,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt,
                response: ticket.response,
                cancellationReason: ticket.cancellationReason
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async createTicket(ticketData) {
        
        if (!ticketData.subject || !ticketData.message || !ticketData.userId) {
            throw new Error("Missing required fields");
        }

        if (ticketData.subject.trim().length < 5) {
            throw new Error("Subject must be at least 5 characters long");
        }

        if (ticketData.message.trim().length < 10) {
            throw new Error("Message must be at least 10 characters long");
        }

        const ticketToCreate = {
            userId: ticketData.userId,
            subject: ticketData.subject.trim(),
            message: ticketData.message.trim(),
            category: ticketData.category || "general"
        };

        const createdTicket = await TicketDataAccess.createTicket(ticketToCreate);
        
        return {
            id: createdTicket.id,
            subject: createdTicket.subject,
            message: createdTicket.message,
            category: this.getCategoryLabel(createdTicket.category),
            status: createdTicket.status,
            createdAt: createdTicket.createdAt,
            updatedAt: createdTicket.updatedAt
        };
    },

    async respondToTicket(ticketId, responseData) {
        
        if (!ticketId) {
            throw new Error("Ticket ID is required");
        }

        if (!responseData) {
            throw new Error("Response data is required");
        }

        if (!responseData.content || responseData.content.trim().length < 10) {
            throw new Error("Response content must be at least 10 characters long");
        }

        if (!responseData.agentName || responseData.agentName.trim().length < 2) {
            throw new Error("Agent name must be at least 2 characters long");
        }

        if (!responseData.status || !["Resuelto", "Cancelada"].includes(responseData.status)) {
            throw new Error("Status must be either 'Resuelto' or 'Cancelada'");
        }

        if (responseData.status === "Cancelada" && responseData.content.trim().length < 20) {
            throw new Error("Cancellation reason must be at least 20 characters long");
        }

        const sanitizedResponseData = {
            content: responseData.content.trim(),
            agentName: responseData.agentName.trim(),
            status: responseData.status,
            timestamp: new Date().toISOString()
        };

        try {
            const result = await TicketDataAccess.respondToTicket(ticketId, sanitizedResponseData);
            
            return {
                success: true,
                message: `Ticket ${result.ticket.status === "Cancelada" ? "cancelled" : "resolved"} successfully`,
                ticketId: ticketId,
                status: result.ticket.status,
                agentName: result.ticket.response.agentName,
                timestamp: result.timestamp
            };
        } catch (error) {
            console.error("Error in TicketService.respondToTicket:", error);
            throw new Error(`Failed to respond to ticket: ${error.message}`);
        }
    },

    async getTicketStatistics() {
        try {
            const stats = await TicketDataAccess.getTicketStatistics();
            return stats;
        } catch (error) {
            console.error("Error in TicketService.getTicketStatistics:", error);
            throw new Error("Failed to get ticket statistics");
        }
    },

    getCategoryLabel(categoryValue) {
        const categoryLabels = {
            "general": "Consulta General",
            "technical": "Problema Técnico",
            "billing": "Facturación",
            "account": "Cuenta de Usuario",
            "walker": "Paseadores",
            "service": "Servicios de Paseo",
            "Consulta General": "Consulta General",
            "Problema Técnico": "Problema Técnico",
            "Facturación": "Facturación",
            "Cuenta de Usuario": "Cuenta de Usuario",
            "Paseadores": "Paseadores",
            "Servicios de Paseo": "Servicios de Paseo"
        };

        return categoryLabels[categoryValue] || categoryValue;
    }
};