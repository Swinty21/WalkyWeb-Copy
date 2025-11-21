import ApiClient from '../ApiClient.js';

export const WalkTrackingAPI = {
    async getWalkRoute(tripId) {
        try {
            const response = await ApiClient.get(`/walk-maps/walks/${tripId}/route`);
            return response.data;
        } catch (error) {
            console.error('Error obteniendo ruta del paseo:', error);
            throw error;
        }
    },

    // ACTUALMENTE NO TIENE USO EN FRONT
    async saveNewLocation(walkId, lat, lng) {
        try {
            const response = await ApiClient.post(`/walk-maps/walks/${walkId}/location`, {
                lat,
                lng
            });
            
            return response.data;
        } catch (error) {
            console.error('Error guardando nueva ubicación:', error);
            throw error;
        }
    },
    // ------------------------

    async getWalkRecords(tripId) {
        try {
            const mapData = await this.getWalkRoute(tripId);
            
            if (!mapData.hasMap || !mapData.locations || mapData.locations.length === 0) {
                return [];
            }

            return mapData.locations.map(location => ({
                id: location.id,
                time: new Date(location.recordedAt).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timeFull: location.recordedAt,
                address: location.address,
                lat: location.lat,
                lng: location.lng
            }));
        } catch (error) {
            console.error('Error obteniendo registros del paseo:', error);
            throw error;
        }
    },

    async checkMapAvailability(tripId) {
        try {
            const response = await ApiClient.get(`/walk-maps/walks/${tripId}/availability`);
            return response.data;
        } catch (error) {
            console.error('Error verificando disponibilidad del mapa:', error);
            throw error;
        }
    }
};