import { WalkTrackingAPI } from "../API/WalkTrackingAPI.js";

export const WalkTrackingDataAccess = {
    async getWalkRoute(tripId) {
        if (!tripId) {
            throw new Error("El ID del paseo es requerido");
        }
        
        const response = await WalkTrackingAPI.getWalkRoute(tripId);
        
        if (!response || typeof response.hasMap === 'undefined') {
            throw new Error("Respuesta inválida del servidor");
        }
        
        return response;
    },

    async getWalkRecords(tripId) {
        if (!tripId) {
            throw new Error("El ID del paseo es requerido");
        }
        
        const records = await WalkTrackingAPI.getWalkRecords(tripId);
        
        if (!Array.isArray(records)) {
            throw new Error("Respuesta inválida del servidor");
        }
        
        return records;
    }
};