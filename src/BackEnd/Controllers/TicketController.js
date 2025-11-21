import { TicketService } from "../Services/TicketService.js";

export const TicketController = {
    async fetchFAQs() {
        try {
            return await TicketService.getFAQs();
        } catch (error) {
            console.error("Error in TicketController.fetchFAQs:", error);
            throw error;
        }
    },

    async fetchTicketsByUser(userId) {
        try {
            return await TicketService.getTicketsByUser(userId);
        } catch (error) {
            console.error("Error in TicketController.fetchTicketsByUser:", error);
            throw error;
        }
    },

    async fetchAllTickets() {
        try {
            return await TicketService.getAllTickets();
        } catch (error) {
            console.error("Error in TicketController.fetchAllTickets:", error);
            throw error;
        }
    },

    async createTicket(ticketData) {
        try {
            return await TicketService.createTicket(ticketData);
        } catch (error) {
            console.error("Error in TicketController.createTicket:", error);
            throw error;
        }
    },

    async respondToTicket(ticketId, responseData) {
        try {
            
            console.log("TicketController.respondToTicket called with:", {
                ticketId,
                agentName: responseData?.agentName,
                status: responseData?.status,
                contentLength: responseData?.content?.length,
                timestamp: new Date().toISOString()
            });

            const result = await TicketService.respondToTicket(ticketId, responseData);
            
            console.log("Ticket response completed successfully:", {
                ticketId,
                status: result.status,
                agentName: result.agentName,
                timestamp: result.timestamp
            });

            return result;
        } catch (error) {
            console.error("Error in TicketController.respondToTicket:", error);
            
            const errorToThrow = new Error(`Failed to respond to ticket: ${error.message}`);
            errorToThrow.code = error.code || 'TICKET_RESPONSE_ERROR';
            errorToThrow.ticketId = ticketId;
            errorToThrow.timestamp = new Date().toISOString();
            
            throw errorToThrow;
        }
    },

    async fetchTicketStatistics() {
        try {
            return await TicketService.getTicketStatistics();
        } catch (error) {
            console.error("Error in TicketController.fetchTicketStatistics:", error);
            throw error;
        }
    },

    validateResponseData(responseData) {
        const errors = [];

        if (!responseData) {
            errors.push("Response data is required");
            return { isValid: false, errors };
        }

        if (!responseData.content || typeof responseData.content !== 'string') {
            errors.push("Content is required and must be a string");
        } else if (responseData.content.trim().length < 10) {
            errors.push("Content must be at least 10 characters long");
        } else if (responseData.content.length > 2000) {
            errors.push("Content must not exceed 2000 characters");
        }

        if (!responseData.agentName || typeof responseData.agentName !== 'string') {
            errors.push("Agent name is required and must be a string");
        } else if (responseData.agentName.trim().length < 2) {
            errors.push("Agent name must be at least 2 characters long");
        } else if (responseData.agentName.length > 100) {
            errors.push("Agent name must not exceed 100 characters");
        }

        if (!responseData.status) {
            errors.push("Status is required");
        } else if (!["Resuelto", "Cancelada"].includes(responseData.status)) {
            errors.push("Status must be either 'Resuelto' or 'Cancelada'");
        }

        if (responseData.status === "Cancelada") {
            if (responseData.content.trim().length < 20) {
                errors.push("Cancellation reason must be at least 20 characters long");
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    async processBulkResponses(responses) {
        try {
            const results = [];
            
            for (const response of responses) {
                try {
                    const validation = this.validateResponseData(response.responseData);
                    if (!validation.isValid) {
                        results.push({
                            ticketId: response.ticketId,
                            success: false,
                            errors: validation.errors
                        });
                        continue;
                    }

                    const result = await this.respondToTicket(response.ticketId, response.responseData);
                    results.push({
                        ticketId: response.ticketId,
                        success: true,
                        result: result
                    });
                } catch (error) {
                    results.push({
                        ticketId: response.ticketId,
                        success: false,
                        error: error.message
                    });
                }
            }

            return {
                total: responses.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                results: results
            };
        } catch (error) {
            console.error("Error in TicketController.processBulkResponses:", error);
            throw error;
        }
    }
};