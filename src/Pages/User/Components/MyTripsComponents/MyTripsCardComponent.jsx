import { format } from "date-fns";
import { FiCalendar, FiMapPin, FiClock, FiXCircle, FiEye, FiCreditCard, FiStar, FiFileText } from "react-icons/fi";

const MyTripsCardComponent = ({ trip, onViewTrip, onCancelTrip, onPayTrip, onCreateReview, onViewReview, onViewReceipt }) => {
    
    console.log(trip);
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
            case "Cancelado":
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
            case "Cancelado":
                return "Cancelado";
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

    const canCancel = (status) => {
        return ["Solicitado", "Esperando pago"].includes(status);
    };

    const needsPayment = (status) => {
        return status === "Esperando pago";
    };

    const viewTrip = (status) => {
        return ["Agendado", "Activo", "Finalizado"].includes(status);
    };

    const isFinished = (status) => {
        return status === "Finalizado";
    };

    const hasReview = trip.hasReview || false;
    console.log(hasReview + " tiene review el paseo: " + trip.reviewId);
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-primary/10 w-full min-w-0 max-w-[450px] mx-auto h-fit min-h-[400px] max-h-[500px] flex flex-col">

            <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(trip.status)}`}>
                    {getStatusText(trip.status)}
                </span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative p-4 flex flex-col flex-1 min-h-0">

                <div className="flex items-center mb-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-sm">{trip.dogName?.[0] || 'P'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground dark:text-background group-hover:text-primary transition-colors duration-300 truncate">
                            {trip.dogName}
                        </h3>
                        <div className="flex items-center text-accent dark:text-muted">
                            <FiMapPin className="mr-1 flex-shrink-0" size={12} />
                            <span className="text-xs font-medium truncate">{trip.walker}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="space-y-3 mb-4 flex-1 overflow-y-auto">
                        <div className="flex items-center p-2 bg-primary/10 rounded-lg">
                            <FiCalendar className="mr-2 text-primary flex-shrink-0" size={14} />
                            <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                {format(new Date(trip.startTime), "MMM dd, yyyy")}
                            </span>
                        </div>

                        <div className="flex items-center p-2 bg-success/10 rounded-lg">
                            <FiClock className="mr-2 text-success flex-shrink-0" size={14} />
                            <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                {format(new Date(trip.startTime), "h:mm a")}
                                {trip.endTime && ` - ${format(new Date(trip.endTime), "h:mm a")}`}
                            </span>
                        </div>

                        {trip.startAddress && (
                            <div className="flex items-start p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <FiMapPin className="mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" size={14} />
                                <span className="text-xs font-semibold text-purple-800 dark:text-purple-300 line-clamp-2">
                                    {trip.startAddress}
                                </span>
                            </div>
                        )}

                        {(trip.duration || trip.distance) && (
                            <div className="flex items-center p-2 bg-info/10 rounded-lg">
                                <FiMapPin className="mr-2 text-info flex-shrink-0" size={14} />
                                <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                    {trip.duration && `${trip.duration} min`}
                                    {trip.duration && trip.distance && ' • '}
                                    {trip.distance && formatDistance(trip.distance)}
                                </span>
                            </div>
                        )}

                        {trip.totalPrice && needsPayment(trip.status) && (
                            <div className="flex items-center p-2 bg-orange-100 rounded-lg border border-orange-200">
                                <FiCreditCard className="mr-2 text-orange-600 flex-shrink-0" size={14} />
                                <span className="text-xs font-semibold text-orange-800 truncate">
                                    Total: ${trip.totalPrice.toLocaleString()}
                                </span>
                            </div>
                        )}

                        {trip.notes && (
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <p className="text-xs text-accent dark:text-muted italic line-clamp-3">
                                    "{trip.notes}"
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-auto flex-shrink-0 pt-2">
                        { viewTrip(trip.status) && (
                            <button
                                onClick={() => onViewTrip(trip.id)}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-info text-info hover:bg-info hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FiEye className="mr-1" size={12} />
                                Ver
                            </button>
                        )}
                        
                        { viewTrip(trip.status) && (
                            <button
                                onClick={() => onViewReceipt(trip.id)}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FiFileText className="mr-1" size={12} />
                                Recibo
                            </button>
                        )}
                        
                        {needsPayment(trip.status) && (
                            <button
                                onClick={() => onPayTrip(trip)}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FiCreditCard className="mr-1" size={12} />
                                Pagar
                            </button>
                        )}
                        
                        {canCancel(trip.status) && (
                            <button
                                onClick={() => onCancelTrip(trip)}
                                className="px-3 py-2 text-xs font-semibold rounded-lg border-2 border-danger text-danger hover:bg-danger hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                            >
                                <FiXCircle size={12} className="mr-1" />
                                Cancelar
                            </button>
                        )}

                        {isFinished(trip.status) && !trip.reviewId && (
                            <button
                                onClick={() => onCreateReview(trip)}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FiStar className="mr-1" size={12} />
                                Dejar Review
                            </button>
                        )}

                        {isFinished(trip.status) && trip.reviewId && (
                            <button
                                onClick={() => onViewReview(trip)}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FiStar className="mr-1 fill-green-600" size={12} />
                                Ver Review
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTripsCardComponent;