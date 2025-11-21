import { format } from "date-fns";
import { FiX, FiXCircle, FiCalendar, FiMapPin, FiClock } from "react-icons/fi";

const CancelWalkModal = ({ isOpen, onClose, onConfirm, tripData, isLoading }) => {
    if (!isOpen) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "Solicitado":
                return "bg-blue-500/70 text-white";
            case "Esperando pago":
                return "bg-orange-500/70 text-white";
            case "Agendado":
                return "bg-yellow-500/70 text-black";
            case "Activo":
                return "bg-green-500/70 text-white";
            case "Finalizado":
                return "bg-gray-500/70 text-white";
            case "Rechazado":
                return "bg-red-500/70 text-white";
            default:
                return "bg-neutral/70 text-black";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Solicitado":
                return "Solicitado";
            case "Esperando pago":
                return "Esperando Pago";
            case "Agendado":
                return "Agendado";
            case "Activo":
                return "En Progreso";
            case "Finalizado":
                return "Finalizado";
            case "Rechazado":
                return "Rechazado";
            default:
                return status;
        }
    };

    const formatDistance = (distance) => {
        if (!distance) return null;
        return distance >= 1000 ? 
            `${(distance / 1000).toFixed(1)} km` : 
            `${distance} m`;
    };

    const getCancelMessage = (status) => {
        switch (status) {
            case "Solicitado":
                return "Al cancelar esta solicitud, el paseador no podrá aceptarla.";
            case "Esperando pago":
                return "Al cancelar ahora, perderás la aceptación del paseador y deberás crear una nueva solicitud.";
            default:
                return "Una vez cancelado, deberás crear un nuevo paseo si deseas programar otro servicio.";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-xl border border-primary/10 max-w-md w-full mx-4">
                
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiX size={16} />
                    </button>
                </div>

                <div className="relative p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-danger to-warning rounded-full flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                            <FiXCircle className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-foreground dark:text-background mb-1">
                                Cancelar Paseo
                            </h3>
                            <p className="text-sm text-accent dark:text-muted">
                                Esta acción no se puede deshacer
                            </p>
                        </div>
                    </div>

                    {tripData && (
                        <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg border border-primary/10 mb-6">
                            
                            <div className="absolute top-3 right-3 z-10">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(tripData.status)}`}>
                                    {getStatusText(tripData.status)}
                                </span>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
                                        <span className="text-white font-bold text-xs">{tripData.dogName?.[0] || 'P'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-foreground dark:text-background truncate">
                                            {tripData.dogName}
                                        </h4>
                                        <div className="flex items-center text-accent dark:text-muted">
                                            <FiMapPin className="mr-1 flex-shrink-0" size={10} />
                                            <span className="text-xs font-medium truncate">{tripData.walker}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    
                                    <div className="flex items-center p-2 bg-primary/10 rounded-lg">
                                        <FiCalendar className="mr-2 text-primary flex-shrink-0" size={12} />
                                        <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                            {format(new Date(tripData.startTime), "MMM dd, yyyy")}
                                        </span>
                                    </div>

                                    <div className="flex items-center p-2 bg-success/10 rounded-lg">
                                        <FiClock className="mr-2 text-success flex-shrink-0" size={12} />
                                        <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                            {format(new Date(tripData.startTime), "h:mm a")}
                                            {tripData.endTime && ` - ${format(new Date(tripData.endTime), "h:mm a")}`}
                                        </span>
                                    </div>

                                    {(tripData.duration || tripData.distance) && (
                                        <div className="flex items-center p-2 bg-info/10 rounded-lg">
                                            <FiMapPin className="mr-2 text-info flex-shrink-0" size={12} />
                                            <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                                {tripData.duration && `${tripData.duration} min`}
                                                {tripData.duration && tripData.distance && ' • '}
                                                {tripData.distance && formatDistance(tripData.distance)}
                                            </span>
                                        </div>
                                    )}

                                    {tripData.notes && (
                                        <div className="p-2 bg-accent/10 rounded-lg">
                                            <p className="text-xs text-accent dark:text-muted italic line-clamp-2">
                                                "{tripData.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <p className="text-center text-foreground dark:text-background mb-2">
                            ¿Estás seguro de que deseas cancelar este paseo?
                        </p>
                        <p className="text-sm text-center text-accent dark:text-muted">
                            {getCancelMessage(tripData?.status)}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl border-2 border-info text-info hover:bg-info hover:text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Mantener Paseo
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl border-2 border-danger text-danger hover:bg-danger hover:text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                    Cancelando...
                                </>
                            ) : (
                                <>
                                    <FiXCircle size={14} className="mr-1" />
                                    Cancelar Paseo
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelWalkModal;