import { TicketAPI } from "../API/TicketAPI.js";

export const TicketDataAccess = {
    async getFAQs() {
        return await TicketAPI.getFAQs();
    },

    async getTicketsByUser(userId) {
        return await TicketAPI.getTicketsByUser(userId);
    },

    async getAllTickets() {
        return await TicketAPI.getAllTickets();
    },

    async createTicket(ticketData) {
        return await TicketAPI.createTicket(ticketData);
    },

    async respondToTicket(ticketId, responseData) {
        return await TicketAPI.respondToTicket(ticketId, responseData);
    },

    async getTicketStatistics() {
        return await TicketAPI.getTicketStatistics();
    }
};