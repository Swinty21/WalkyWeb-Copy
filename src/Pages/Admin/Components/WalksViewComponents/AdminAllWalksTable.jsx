import { format } from "date-fns";
import { FiArchive, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

const AdminAllWalksTable = ({ walks, searchQuery }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Solicitado":
                return "bg-blue-500/70 text-white";
            case "Esperando pago":
                return "bg-orange-500/70 text-white";
            case "Finalizado":
                return "bg-gray-500/70 text-white";
            case "Rechazado":
                return "bg-red-500/70 text-white";
            default:
                return "bg-neutral/70 text-black";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Solicitado":
                return <FiClock size={14} />;
            case "Esperando pago":
                return <FiClock size={14} />;
            case "Finalizado":
                return <FiCheckCircle size={14} />;
            case "Rechazado":
                return <FiXCircle size={14} />;
            default:
                return null;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Solicitado":
                return "Solicitado";
            case "Esperando pago":
                return "Esperando Pago";
            case "Finalizado":
                return "Finalizado";
            case "Rechazado":
                return "Rechazado";
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

    const getRowVariant = (status) => {
        switch (status) {
            case "Finalizado":
                return "border-l-4 border-l-green-400";
            case "Rechazado":
                return "border-l-4 border-l-red-400";
            case "Solicitado":
                return "border-l-4 border-l-blue-400";
            case "Esperando pago":
                return "border-l-4 border-l-orange-400";
            default:
                return "";
        }
    };

    if (walks.length === 0) {
        return (
            <div className="bg-white dark:bg-foreground rounded-xl shadow-xl p-8 border border-border dark:border-muted">
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiArchive className="text-accent text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-background mb-2">
                        No hay paseos en el historial
                    </h3>
                    <p className="text-accent dark:text-muted">
                        {searchQuery ? 
                            `No se encontraron paseos que coincidan con "${searchQuery}"` :
                            "No hay paseos completados, cancelados o pendientes"
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-foreground rounded-xl shadow-xl overflow-hidden border border-border dark:border-muted">
            <div className="bg-accent p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <FiArchive className="mr-2" size={20} />
                    Historial de Paseos ({walks.length})
                </h3>
                <p className="text-white/80 text-sm">
                    Todos los paseos excepto los que están agendados o activos
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
                                "Notas"
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
                                className={`transition-colors duration-200 ${getRowVariant(walk.status)} ${
                                    index % 2 === 0 
                                        ? "bg-background dark:bg-foreground" 
                                        : "bg-muted/20 dark:bg-accent/10"
                                } hover:bg-muted/30 dark:hover:bg-accent/20`}
                            >
                                {/* Walk ID */}
                                <td className="px-6 py-4 font-medium text-foreground dark:text-background">
                                    <span className="font-mono text-xs bg-accent/10 px-2 py-1 rounded">
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

                                {/* Notes */}
                                <td className="px-6 py-4 text-foreground dark:text-background text-sm max-w-xs">
                                    {walk.notes ? (
                                        <div className="truncate" title={walk.notes}>
                                            {walk.notes}
                                        </div>
                                    ) : (
                                        <span className="text-accent dark:text-muted italic">
                                            Sin notas
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer with summary */}
            <div className="bg-muted/20 dark:bg-accent/10 px-6 py-4">
                <div className="flex justify-between items-center text-sm flex-wrap gap-2">
                    <span className="text-accent dark:text-muted">
                        Mostrando {walks.length} paseo{walks.length !== 1 ? 's' : ''} del historial
                    </span>
                    <div className="flex space-x-4 flex-wrap gap-2">
                        <span className="text-blue-600 dark:text-blue-400">
                            Solicitados: {walks.filter(w => w.status === "Solicitado").length}
                        </span>
                        <span className="text-orange-600 dark:text-orange-400">
                            Esperando pago: {walks.filter(w => w.status === "Esperando pago").length}
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                            Finalizados: {walks.filter(w => w.status === "Finalizado").length}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                            Rechazados: {walks.filter(w => w.status === "Rechazado").length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAllWalksTable;