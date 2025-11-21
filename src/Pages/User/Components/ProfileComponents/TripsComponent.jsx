import { useState } from "react";
import { FiCalendar, FiMapPin, FiClock, FiEye, FiXCircle, FiCreditCard } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const TripsComponent = ({ trips, onCancel, onView, tripsError, tripsLoading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const tripsPerPage = 5;

    // Limitar a 5 viajes máximo
    const limitedTrips = trips.slice(0, 5);
    const totalPages = Math.ceil(limitedTrips.length / tripsPerPage);
    const paginatedTrips = limitedTrips.slice(
        (currentPage - 1) * tripsPerPage,
        currentPage * tripsPerPage
    );

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

    const canCancel = (status) => {
        return ["Solicitado", "Esperando pago"].includes(status);
    };

    const needsPayment = (status) => {
        return status === "Esperando pago";
    };

    const canView = (status) => {
        return ["Agendado", "Activo", "Finalizado"].includes(status);
    };

    if (tripsError) {
        return (
            <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4">
                    Mis Paseos
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                        Error al cargar los paseos: {tripsError}
                    </p>
                </div>
            </div>
        );
    }

    if (tripsLoading) {
        return (
            <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4">
                    Mis Paseos
                </h3>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-muted/20 rounded-lg p-4 animate-pulse">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-muted/40 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-muted/40 rounded mb-2"></div>
                                    <div className="h-3 bg-muted/30 rounded w-3/4"></div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex-1 h-8 bg-muted/30 rounded"></div>
                                <div className="flex-1 h-8 bg-muted/30 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground dark:text-background">
                    Mis Paseos Recientes ({limitedTrips.length})
                </h3>
                {trips.length > 5 && (
                    <p className="text-sm text-accent dark:text-muted">
                        Mostrando los últimos 5 paseos
                    </p>
                )}
            </div>

            {limitedTrips.length === 0 ? (
                <div className="bg-muted/10 border-2 border-dashed border-muted/40 rounded-lg p-8 text-center">
                    <FiCalendar className="w-12 h-12 text-muted mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-foreground dark:text-background mb-2">
                        No tienes paseos registrados
                    </h4>
                    <p className="text-accent dark:text-muted">
                        Tus paseos aparecerán aquí una vez que los programes
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 auto-rows-max justify-items-center" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 500px))'}}>
                    {paginatedTrips.map((trip) => (
                        <div
                            key={trip.id}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] w-full min-w-0 max-w-[500px] mx-auto h-fit min-h-[450px] flex flex-col"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(trip.status)}`}>
                                    {getStatusText(trip.status)}
                                </span>
                            </div>

                            <div className="p-6 flex flex-col flex-1 min-h-0">
                                <div className="flex items-center mb-4 flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                                        <span className="text-white font-bold text-sm">
                                            {trip.dogName?.[0] || 'P'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-bold text-foreground dark:text-background group-hover:text-primary transition-colors duration-300 truncate">
                                            {trip.dogName}
                                        </h4>
                                        <div className="flex items-center text-accent dark:text-muted">
                                            <FiMapPin className="mr-1 flex-shrink-0" size={12} />
                                            <span className="text-sm font-medium truncate">
                                                {trip.walkerName || trip.walker}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-h-0">
                                    <div className="space-y-3 mb-4 flex-1 overflow-y-auto">
                                        <div className="flex items-center p-3 bg-primary/10 rounded-lg">
                                            <FiCalendar className="mr-2 text-primary flex-shrink-0" size={14} />
                                            <span className="text-sm font-semibold text-foreground dark:text-background truncate">
                                                {format(new Date(trip.startTime), "d 'de' MMMM, yyyy", { locale: es })}
                                            </span>
                                        </div>

                                        <div className="flex items-center p-3 bg-success/10 rounded-lg">
                                            <FiClock className="mr-2 text-success flex-shrink-0" size={14} />
                                            <span className="text-sm font-semibold text-foreground dark:text-background truncate">
                                                {format(new Date(trip.startTime), "h:mm a")}
                                                {trip.endTime && ` - ${format(new Date(trip.endTime), "h:mm a")}`}
                                            </span>
                                        </div>

                                        {(trip.duration || trip.distance) && (
                                            <div className="flex items-center p-3 bg-info/10 rounded-lg">
                                                <FiMapPin className="mr-2 text-info flex-shrink-0" size={14} />
                                                <span className="text-sm font-semibold text-foreground dark:text-background">
                                                    {trip.duration && `${trip.duration} min`}
                                                    {trip.duration && trip.distance && ' • '}
                                                    {trip.distance && `${trip.distance >= 1000 ? (trip.distance / 1000).toFixed(1) + ' km' : trip.distance + ' m'}`}
                                                </span>
                                            </div>
                                        )}

                                        {trip.totalPrice && needsPayment(trip.status) && (
                                            <div className="flex items-center p-3 bg-orange-100 rounded-lg border border-orange-200">
                                                <FiCreditCard className="mr-2 text-orange-600 flex-shrink-0" size={14} />
                                                <span className="text-sm font-semibold text-orange-800">
                                                    Total: ${trip.totalPrice.toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {trip.notes && (
                                            <div className="p-3 bg-accent/10 rounded-lg">
                                                <p className="text-sm text-accent dark:text-muted italic line-clamp-2">
                                                    "{trip.notes}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-auto flex-shrink-0 pt-2 flex-wrap">
                                        {canView(trip.status) && (
                                            <button
                                                onClick={() => onView(trip.id)}
                                                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-info text-info hover:bg-info hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                <FiEye className="mr-1" size={12} />
                                                Ver
                                            </button>
                                        )}
                                        
                                        {needsPayment(trip.status) && (
                                            <div className="flex-1 relative group">
                                                <button
                                                    disabled
                                                    className="w-full flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed transition-all duration-300"
                                                >
                                                    <FiCreditCard className="mr-1" size={12} />
                                                    Pagar
                                                </button>
                                                
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                                                        Para pagar debe ir a la vista "Mis Paseos"
                                                        <svg className="absolute top-full left-1/2 transform -translate-x-1/2" width="16" height="8" viewBox="0 0 16 8">
                                                            <path d="M8 8L0 0h16z" fill="currentColor" className="text-gray-900 dark:text-gray-700"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {canCancel(trip.status) && (
                                            <button
                                                onClick={() => onCancel(trip.id)}
                                                className="px-3 py-2 text-xs font-semibold rounded-lg border-2 border-danger text-danger hover:bg-danger hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                                            >
                                                <FiXCircle className="mr-1" size={12} />
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                    <button
                        className="px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-sm text-accent dark:text-muted">
                        {currentPage} de {totalPages}
                    </span>
                    <button
                        className="px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default TripsComponent;