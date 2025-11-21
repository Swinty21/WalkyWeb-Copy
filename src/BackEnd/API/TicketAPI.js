import apiClient from '../ApiClient.js';

export const TicketAPI = {
    async getFAQs() {
        try {
            const response = await apiClient.get('/tickets/faqs');
            return response.data.faqs;
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            throw new Error(`Failed to fetch FAQs: ${error.message}`);
        }
    },

    async getTicketsByUser(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const response = await apiClient.get('/tickets/my-tickets');
            return response.data.tickets;
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            throw new Error(`Failed to fetch user tickets: ${error.message}`);
        }
    },

    async getAllTickets() {
        try {
            const response = await apiClient.get('/tickets');
            return response.data.tickets;
        } catch (error) {
            console.error('Error fetching all tickets:', error);
            throw new Error(`Failed to fetch all tickets: ${error.message}`);
        }
    },

    async createTicket(ticketData) {
        try {
            if (!ticketData) {
                throw new Error('Ticket data is required');
            }

            if (!ticketData.subject || !ticketData.message) {
                throw new Error('Subject and message are required');
            }

            const response = await apiClient.post('/tickets', ticketData);
            return response.data.ticket;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw new Error(`Failed to create ticket: ${error.message}`);
        }
    },

    async respondToTicket(ticketId, responseData) {
        try {
            if (!ticketId) {
                throw new Error('Ticket ID is required');
            }

            if (!responseData) {
                throw new Error('Response data is required');
            }

            if (!responseData.content || !responseData.status) {
                throw new Error('Content and status are required');
            }

            const response = await apiClient.post(`/tickets/${ticketId}/respond`, responseData);
            return response.data;
        } catch (error) {
            console.error('Error responding to ticket:', error);
            throw new Error(`Failed to respond to ticket: ${error.message}`);
        }
    },

    async getTicketStatistics() {
        try {
            const response = await apiClient.get('/tickets/admin/statistics');
            return response.data.statistics;
        } catch (error) {
            console.error('Error fetching ticket statistics:', error);
            throw new Error(`Failed to fetch ticket statistics: ${error.message}`);
        }
    },

    async getTicketById(ticketId) {
        try {
            if (!ticketId) {
                throw new Error('Ticket ID is required');
            }

            const response = await apiClient.get(`/tickets/${ticketId}`);
            return response.data.ticket;
        } catch (error) {
            console.error('Error fetching ticket:', error);
            throw new Error(`Failed to fetch ticket: ${error.message}`);
        }
    },

    async getTicketCategories() {
        try {
            const response = await apiClient.get('/tickets/categories');
            return response.data.categories;
        } catch (error) {
            console.error('Error fetching ticket categories:', error);
            throw new Error(`Failed to fetch ticket categories: ${error.message}`);
        }
    },

    async updateTicketStatus(ticketId, status) {
        try {
            if (!ticketId) {
                throw new Error('Ticket ID is required');
            }

            if (!status) {
                throw new Error('Status is required');
            }

            const response = await apiClient.patch(`/tickets/${ticketId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating ticket status:', error);
            throw new Error(`Failed to update ticket status: ${error.message}`);
        }
    }
};