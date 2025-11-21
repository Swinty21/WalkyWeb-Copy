import { WalkTrackingDataAccess } from "../DataAccess/WalkTrackingDataAccess.js";

export const WalkTrackingService = {
    async getWalkRoute(tripId) {
        const mapData = await WalkTrackingDataAccess.getWalkRoute(tripId);
        
        if (!mapData.hasMap || !mapData.locations || mapData.locations.length === 0) {
            return [];
        }
        
        return mapData.locations.map(location => ({
            lat: location.lat,
            lng: location.lng
        }));
    },

    async getWalkRecords(tripId) {
        const records = await WalkTrackingDataAccess.getWalkRecords(tripId);
        return records;
    },

    async checkMapAvailability(tripId) {
        const mapData = await WalkTrackingDataAccess.getWalkRoute(tripId);
        
        return {
            hasMap: mapData.hasMap,
            mapId: mapData.mapId,
            locationCount: mapData.locations ? mapData.locations.length : 0
        };
    },

    // Validar si el mapa está visible según el estado del paseo
    validateMapVisible(walkStatus) {
        const visibleStatuses = ['activo', 'finalizado'];
        return visibleStatuses.includes(walkStatus?.toLowerCase());
    },

    // Validar si se puede interactuar con el mapa según el estado del paseo
    validateMapInteractive(walkStatus) {
        const interactiveStatuses = ['activo'];
        return interactiveStatuses.includes(walkStatus?.toLowerCase());
    },

    // Validar si se pueden mostrar los datos de seguimiento según el estado del paseo
    validateTrackingVisible(walkStatus) {
        const visibleStatuses = ['activo', 'finalizado'];
        return visibleStatuses.includes(walkStatus?.toLowerCase());
    },

    getMapStatusMessage(walkStatus) {
        if (!walkStatus) return 'Estado del paseo desconocido';
        
        switch (walkStatus.toLowerCase()) {
            case 'activo':
                return 'Mapa activo - Seguimiento en tiempo real';
            case 'finalizado':
                return 'Mapa del paseo completado - Solo lectura';
            case 'agendado':
                return 'El mapa se mostrará cuando el paseo esté activo';
            case 'solicitado':
                return 'Paseo pendiente de confirmación';
            case 'esperando_pago':
            case 'esperando pago':
                return 'Esperando confirmación de pago';
            case 'rechazado':
                return 'El paseo fue rechazado';
            case 'cancelado':
                return 'El paseo fue cancelado';
            default:
                return 'El mapa se mostrará cuando el paseo esté activo';
        }
    },

    getTrackingStatusMessage(walkStatus) {
        if (!walkStatus) return 'Estado del paseo desconocido';
        
        switch (walkStatus.toLowerCase()) {
            case 'activo':
                return 'Seguimiento en tiempo real';
            case 'finalizado':
                return 'Resumen del paseo completado';
            case 'agendado':
                return 'Los datos de seguimiento aparecerán cuando el paseo esté activo';
            case 'solicitado':
                return 'Paseo pendiente de confirmación';
            case 'esperando_pago':
            case 'esperando pago':
                return 'Esperando confirmación de pago';
            case 'rechazado':
                return 'El paseo fue rechazado';
            case 'cancelado':
                return 'El paseo fue cancelado';
            default:
                return 'Los datos de seguimiento aparecerán cuando el paseo esté activo';
        }
    },

    validateCoordinates(lat, lng) {
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error('Las coordenadas deben ser números');
        }
        
        if (lat < -90 || lat > 90) {
            throw new Error('La latitud debe estar entre -90 y 90');
        }
        
        if (lng < -180 || lng > 180) {
            throw new Error('La longitud debe estar entre -180 y 180');
        }
        
        return true;
    }
};