import { format } from "date-fns";
import { FiCalendar, FiMapPin, FiClock, FiEye, FiUser, FiShield } from "react-icons/fi";

const AdminWalksCardComponent = ({ walk, onViewWalk }) => {
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

    const canViewDetails = (status) => {
        return ["Agendado", "Activo", "Finalizado"].includes(status);
    };

    const getPriorityColor = (status) => {
        switch (status) {
            case "Solicitado":
                return "border-l-blue-500";
            case "Esperando pago":
                return "border-l-orange-500";
            case "Activo":
                return "border-l-green-500";
            default:
                return "border-l-gray-300";
        }
    };

    return (
        <div className={`group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-l-4 ${getPriorityColor(walk.status)} h-full flex flex-col`}>

            <div className="absolute top-2 left-2 z-10">
                <div className="bg-indigo-500/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                    <FiShield className="text-white text-xs" />
                </div>
            </div>

            <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(walk.status)}`}>
                    {getStatusText(walk.status)}
                </span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative p-4 flex flex-col flex-1 pt-10">
                
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-sm">{walk.dogName?.[0] || 'P'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground dark:text-background group-hover:text-indigo-600 transition-colors duration-300 truncate">
                            {walk.dogName}
                        </h3>
                        <div className="flex items-center text-accent dark:text-muted">
                            <FiUser className="mr-1 flex-shrink-0" size={12} />
                            <span className="text-xs font-medium truncate">{walk.walker}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center p-2 bg-indigo-500/10 rounded-lg">
                        <FiCalendar className="mr-2 text-indigo-600 flex-shrink-0" size={14} />
                        <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                            {format(new Date(walk.startTime), "MMM dd, yyyy")}
                        </span>
                    </div>

                    <div className="flex items-center p-2 bg-purple-500/10 rounded-lg">
                        <FiClock className="mr-2 text-purple-600 flex-shrink-0" size={14} />
                        <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                            {format(new Date(walk.startTime), "h:mm a")}
                            {walk.endTime && ` - ${format(new Date(walk.endTime), "h:mm a")}`}
                        </span>
                    </div>

                    {(walk.duration || walk.distance) && (
                        <div className="flex items-center p-2 bg-blue-500/10 rounded-lg">
                            <FiMapPin className="mr-2 text-blue-600 flex-shrink-0" size={14} />
                            <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                {walk.duration && `${walk.duration} min`}
                                {walk.duration && walk.distance && ' • '}
                                {walk.distance && formatDistance(walk.distance)}
                            </span>
                        </div>
                    )}

                    {walk.notes && (
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <p className="text-xs text-accent dark:text-muted italic line-clamp-2">
                                "{walk.notes}"
                            </p>
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-indigo-600 font-medium">ID: {walk.id}</span>
                            <span className="text-purple-600 font-medium">Admin View</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    {canViewDetails(walk.status) && (
                        <button
                            onClick={() => onViewWalk(walk.id)}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <FiEye className="mr-1" size={12} />
                            Ver Detalles
                        </button>
                    )}
                    
                    {!canViewDetails(walk.status) && (
                        <div className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            <FiEye className="mr-1" size={12} />
                            Detalles no disponibles
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminWalksCardComponent;