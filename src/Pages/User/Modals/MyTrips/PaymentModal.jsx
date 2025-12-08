import { format } from "date-fns";
import { FiX, FiCreditCard, FiCalendar, FiMapPin, FiClock, FiCheck, FiDollarSign } from "react-icons/fi";

const PaymentModal = ({ isOpen, onClose, onConfirm, tripData, isLoading }) => {
    if (!isOpen) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "Esperando pago":
                return "bg-orange-500/70 text-white";
            default:
                return "bg-neutral/70 text-black";
        }
    };

    const formatDistance = (distance) => {
        if (!distance) return null;
        return distance >= 1000 ? 
            `${(distance / 1000).toFixed(1)} km` : 
            `${distance} m`;
    };

    const totalPrice = Math.round(tripData?.totalPrice || 0);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-foreground/90 backdrop-blur-sm shadow-xl border border-primary/10 max-w-md w-full mx-4">
                
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
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                            <FiCreditCard className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-foreground dark:text-background mb-1">
                                Confirmar Pago
                            </h3>
                            <p className="text-sm text-accent dark:text-muted">
                                Completa el pago para confirmar tu paseo
                            </p>
                        </div>
                    </div>

                    {tripData && (
                        <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg border border-primary/10 mb-6">
                            
                            <div className="absolute top-3 right-3 z-10">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(tripData.status)}`}>
                                    {tripData.status}
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

                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800 mb-6">
                        <div className="flex items-center mb-3">
                            <FiDollarSign className="text-orange-600 mr-2" size={18} />
                            <h4 className="text-lg font-bold text-orange-800 dark:text-orange-200">
                                Total a Pagar
                            </h4>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground dark:text-background">Servicio de paseo:</span>
                            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">${totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-3 py-2 text-xs font-semibold rounded-lg border-2 border-danger text-danger hover:bg-danger hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <FiCheck size={14} className="mr-2" />
                                    Pagar con MercadoPago
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;