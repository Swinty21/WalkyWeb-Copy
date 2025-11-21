import { format } from "date-fns";
import { FiEye, FiActivity, FiClock } from "react-icons/fi";

const AdminActiveWalksTable = ({ walks, onViewWalk, searchQuery }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Agendado":
                return "bg-yellow-500/70 text-black";
            case "Activo":
                return "bg-green-500/70 text-white";
            default:
                return "bg-neutral/70 text-black";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Agendado":
                return <FiClock size={14} />;
            case "Activo":
                return <FiActivity size={14} />;
            default:
                return null;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Agendado":
                return "Agendado";
            case "Activo":
                return "En Progreso";
            default:
                return status;
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return "N/A";
        return `${duration} min`;
    };

    const formatDistance = (distance) => {
        if (!distance) return "N/A";
        return distance >= 1000 ? 
            `${(distance / 1000).toFixed(1)} km` : 
            `${distance} m`;
    };

    if (walks.length === 0) {
        return (
            <div className="bg-white dark:bg-foreground rounded-xl shadow-xl p-8 border border-border dark:border-muted">
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiActivity className="text-primary text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-background mb-2">
                        No hay paseos activos
                    </h3>
                    <p className="text-accent dark:text-muted">
                        {searchQuery ? 
                            `No se encontraron paseos activos que coincidan con "${searchQuery}"` :
                            "No hay paseos agendados o en progreso en este momento"
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-foreground rounded-xl shadow-xl overflow-hidden border border-border dark:border-muted">
            <div className="bg-primary p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <FiActivity className="mr-2" size={20} />
                    Paseos Activos ({walks.length})
                </h3>
                <p className="text-white/80 text-sm">
                    Paseos agendados y en progreso que requieren seguimiento
                </p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-foreground2">
                        <tr>
                            {[
                                "ID Paseo", 
                                "Mascota", 
                                "Paseador", 
                                "Fecha & Hora", 
                                "Estado", 
                                "Duración", 
                                "Distancia",
                                "Acciones"
                            ].map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 text-left font-semibold text-white uppercase tracking-wider text-xs"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {walks.map((walk, index) => (
                            <tr
                                key={walk.id}
                                className={`transition-colors duration-200 ${
                                    index % 2 === 0 
                                        ? "bg-background dark:bg-foreground" 
                                        : "bg-muted/20 dark:bg-accent/10"
                                } hover:bg-primary/5 dark:hover:bg-primary/10`}
                            >
                                {/* Walk ID */}
                                <td className="px-6 py-4 font-medium text-foreground dark:text-background">
                                    <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                                        {walk.id}
                                    </span>
                                </td>

                                {/* Pet Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-primary font-bold text-xs">
                                                {walk.dogName?.[0] || 'P'}
                                            </span>
                                        </div>
                                        <span className="font-medium text-foreground dark:text-background">
                                            {walk.dogName}
                                        </span>
                                    </div>
                                </td>

                                {/* Walker */}
                                <td className="px-6 py-4 text-foreground dark:text-background">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-success font-bold text-xs">
                                                {walk.walker?.[0] || 'W'}
                                            </span>
                                        </div>
                                        {walk.walker}
                                    </div>
                                </td>

                                {/* Date & Time */}
                                <td className="px-6 py-4 text-foreground dark:text-background">
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {format(new Date(walk.startTime), "MMM dd, yyyy")}
                                        </div>
                                        <div className="text-accent dark:text-muted">
                                            {format(new Date(walk.startTime), "h:mm a")}
                                            {walk.endTime && (
                                                <span> - {format(new Date(walk.endTime), "h:mm a")}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(walk.status)}`}>
                                        {getStatusIcon(walk.status)}
                                        <span className="ml-1">{getStatusText(walk.status)}</span>
                                    </span>
                                </td>

                                {/* Duration */}
                                <td className="px-6 py-4 text-foreground dark:text-background text-sm">
                                    {formatDuration(walk.duration)}
                                </td>

                                {/* Distance */}
                                <td className="px-6 py-4 text-foreground dark:text-background text-sm">
                                    {formatDistance(walk.distance)}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onViewWalk(walk.id)}
                                        className="flex items-center px-3 py-2 text-xs rounded-lg border border-info text-info hover:bg-info hover:text-white transition-colors duration-200 font-medium"
                                        title="Ver detalles del paseo"
                                    >
                                        <FiEye className="mr-1" size={14} />
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer with summary */}
            <div className="bg-muted/20 dark:bg-accent/10 px-6 py-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-accent dark:text-muted">
                        Mostrando {walks.length} paseo{walks.length !== 1 ? 's' : ''} activo{walks.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex space-x-4">
                        <span className="text-yellow-600 dark:text-yellow-400">
                            Agendados: {walks.filter(w => w.status === "Agendado").length}
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                            En Progreso: {walks.filter(w => w.status === "Activo").length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminActiveWalksTable;