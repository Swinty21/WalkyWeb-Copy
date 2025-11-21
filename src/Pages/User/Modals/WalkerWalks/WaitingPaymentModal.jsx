import { format } from "date-fns";
import { FiX, FiInfo, FiCalendar, FiMapPin, FiClock, FiCreditCard } from "react-icons/fi";

const WaitingPaymentModal = ({ isOpen, onClose, walkData }) => {
    if (!isOpen) return null;

    const formatDistance = (distance) => {
        if (!distance) return null;
        return distance >= 1000 ? 
            `${(distance / 1000).toFixed(1)} km` : 
            `${distance} m`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-foreground/90 backdrop-blur-sm shadow-xl border border-orange-500/10 max-w-md w-full mx-4">
                
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <FiX size={16} />
                    </button>
                </div>

                <div className="relative p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                            <FiInfo className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-foreground dark:text-background mb-1">
                                Esperando Confirmación de Pago
                            </h3>
                            <p className="text-sm text-accent dark:text-muted">
                                Estado actual del servicio
                            </p>
                        </div>
                    </div>

                    {walkData && (
                        <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg border border-orange-500/10 mb-6">
                            
                            <div className="absolute top-3 right-3 z-10">
                                <span className="px-2 py-1 rounded-full text-xs font-bold shadow-lg bg-orange-500/70 text-white">
                                    Esperando Pago
                                </span>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
                                        <span className="text-white font-bold text-xs">{walkData.dogName?.[0] || 'P'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-foreground dark:text-background truncate">
                                            {walkData.dogName}
                                        </h4>
                                        <div className="flex items-center text-accent dark:text-muted">
                                            <FiMapPin className="mr-1 flex-shrink-0" size={10} />
                                            <span className="text-xs font-medium truncate">Servicio aceptado</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center p-2 bg-success/10 rounded-lg">
                                        <FiCalendar className="mr-2 text-success flex-shrink-0" size={12} />
                                        <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                            {format(new Date(walkData.startTime), "MMM dd, yyyy")}
                                        </span>
                                    </div>

                                    <div className="flex items-center p-2 bg-primary/10 rounded-lg">
                                        <FiClock className="mr-2 text-primary flex-shrink-0" size={12} />
                                        <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                            {format(new Date(walkData.startTime), "h:mm a")}
                                            {walkData.endTime && ` - ${format(new Date(walkData.endTime), "h:mm a")}`}
                                        </span>
                                    </div>

                                    {(walkData.duration || walkData.distance) && (
                                        <div className="flex items-center p-2 bg-info/10 rounded-lg">
                                            <FiMapPin className="mr-2 text-info flex-shrink-0" size={12} />
                                            <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                                {walkData.duration && `${walkData.duration} min`}
                                                {walkData.duration && walkData.distance && ' • '}
                                                {walkData.distance && formatDistance(walkData.distance)}
                                            </span>
                                        </div>
                                    )}

                                    {walkData.notes && (
                                        <div className="p-2 bg-accent/10 rounded-lg">
                                            <p className="text-xs text-accent dark:text-muted italic line-clamp-2">
                                                "{walkData.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800 mb-6">
                        <div className="flex items-center mb-3">
                            <FiCreditCard className="text-orange-600 mr-2" size={18} />
                            <h4 className="text-lg font-bold text-orange-800 dark:text-orange-200">
                                Estado del Pago
                            </h4>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                                ✅ Has aceptado exitosamente la solicitud de paseo
                            </p>
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                                📧 El cliente ha sido notificado por email
                            </p>
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                                💳 Esperando confirmación del pago del cliente
                            </p>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-foreground dark:text-background mb-2">
                            El cliente debe proceder con el pago para confirmar el servicio.
                        </p>
                        <p className="text-sm text-accent dark:text-muted">
                            Una vez que el pago sea confirmado, el estado cambiará a "Agendado" y podrás iniciar el paseo en la fecha programada.
                        </p>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingPaymentModal;