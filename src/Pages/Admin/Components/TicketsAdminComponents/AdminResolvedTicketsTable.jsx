import { format } from "date-fns";
import { FiCheckCircle, FiXCircle, FiUser, FiEye } from "react-icons/fi";
import { useState } from "react";

const AdminResolvedTicketsTable = ({ tickets, searchQuery }) => {
    const [expandedTicket, setExpandedTicket] = useState(null);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resuelto":
            case "resolved":
                return "bg-green-500/70 text-white";
            case "cancelada":
            case "cancelled":
                return "bg-red-500/70 text-white";
            default:
                return "bg-gray-500/70 text-white";
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "resuelto":
            case "resolved":
                return <FiCheckCircle size={14} />;
            case "cancelada":
            case "cancelled":
                return <FiXCircle size={14} />;
            default:
                return null;
        }
    };

    const getStatusText = (status) => {
        switch (status.toLowerCase()) {
            case "resuelto":
            case "resolved":
                return "Resuelto";
            case "cancelada":
            case "cancelled":
                return "Cancelado";
            default:
                return status;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Problema Técnico":
                return "🔧";
            case "Facturación":
                return "💳";
            case "Cuenta de Usuario":
                return "👤";
            case "Paseadores":
                return "🚶";
            case "Servicios de Paseo":
                return "🐕";
            default:
                return "❓";
        }
    };

    const getRowVariant = (status) => {
        switch (status.toLowerCase()) {
            case "resuelto":
            case "resolved":
                return "border-l-4 border-l-green-400";
            case "cancelada":
            case "cancelled":
                return "border-l-4 border-l-red-400";
            default:
                return "border-l-4 border-l-gray-400";
        }
    };

    const calculateResolutionTime = (createdAt, updatedAt) => {
        const created = new Date(createdAt);
        const resolved = new Date(updatedAt);
        const diffInHours = Math.floor((resolved - created) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return `${diffInHours}h`;
        } else {
            const days = Math.floor(diffInHours / 24);
            const hours = diffInHours % 24;
            return `${days}d ${hours}h`;
        }
    };

    const toggleExpanded = (ticketId) => {
        setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
    };

    if (tickets.length === 0) {
        return (
            <div className="bg-white dark:bg-foreground rounded-xl shadow-xl p-8 border border-border dark:border-muted">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-background mb-2">
                        No hay tickets resueltos
                    </h3>
                    <p className="text-accent dark:text-muted">
                        {searchQuery ? 
                            `No se encontraron tickets resueltos que coincidan con "${searchQuery}"` :
                            "No hay tickets resueltos o cancelados"
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-foreground rounded-xl shadow-xl overflow-hidden border border-border dark:border-muted">
            <div className="bg-gray-600 p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <FiCheckCircle className="mr-2" size={20} />
                    Tickets Resueltos ({tickets.length})
                </h3>
                <p className="text-white/80 text-sm">
                    Historial de tickets resueltos y cancelados por el equipo de soporte
                </p>
            </div>
            
            <div className="divide-y divide-border dark:divide-muted">
                {tickets.map((ticket, index) => (
                    <div
                        key={ticket.id}
                        className={`transition-colors duration-200 hover:bg-muted/30 dark:hover:bg-accent/20 ${getRowVariant(ticket.status)}`}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">
                                            #{ticket.id}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                            {getStatusIcon(ticket.status)}
                                            <span className="ml-1">{getStatusText(ticket.status)}</span>
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">{getCategoryIcon(ticket.category)}</span>
                                            <span className="text-xs text-accent dark:text-muted">
                                                {ticket.category}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-lg text-foreground dark:text-background mb-2">
                                        {ticket.subject}
                                    </h3>

                                    <p className="text-accent dark:text-muted text-sm mb-3 line-clamp-2">
                                        {ticket.message}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-accent dark:text-muted flex-wrap">
                                        <div className="flex items-center gap-1">
                                            <FiUser size={12} />
                                            <span>Usuario #{ticket.userId}</span>
                                        </div>
                                        <span>
                                            Creado: {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                                        </span>
                                        <span>
                                            Resuelto: {format(new Date(ticket.updatedAt), "dd/MM/yyyy HH:mm")}
                                        </span>
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                                            Tiempo de resolución: {calculateResolutionTime(ticket.createdAt, ticket.updatedAt)}
                                        </span>
                                    </div>

                                    {ticket.response && ticket.response.agentName && (
                                        <div className="mt-2 text-xs text-success font-medium">
                                            Resuelto por: {ticket.response.agentName}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => toggleExpanded(ticket.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-info/10 text-info hover:bg-info hover:text-white rounded-lg transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                    >
                                        <FiEye className="text-xs" />
                                        {expandedTicket === ticket.id ? 'Ocultar' : 'Ver detalles'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {expandedTicket === ticket.id && (
                            <div className="px-6 pb-6 border-t border-border dark:border-muted bg-muted/10 dark:bg-accent/10">
                                
                                <div className="mb-4">
                                    <h4 className="font-medium text-foreground dark:text-background mb-2 text-sm">
                                        Mensaje original:
                                    </h4>
                                    <div className="bg-background dark:bg-foreground p-4 rounded-lg text-sm text-foreground dark:text-background">
                                        {ticket.message}
                                    </div>
                                </div>

                                {ticket.response && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-foreground dark:text-background mb-2 text-sm">
                                            Respuesta del soporte:
                                        </h4>
                                        <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                                            <div className="text-xs text-accent dark:text-muted mb-2">
                                                {ticket.response.agentName} - {format(new Date(ticket.response.date), "dd/MM/yyyy HH:mm")}
                                            </div>
                                            <div className="text-sm text-foreground dark:text-background whitespace-pre-wrap">
                                                {ticket.response.content}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {ticket.status.toLowerCase() === "cancelada" && ticket.cancellationReason && (
                                    <div>
                                        <h4 className="font-medium text-foreground dark:text-background mb-2 text-sm">
                                            Razón de cancelación:
                                        </h4>
                                        <div className="bg-danger/10 p-4 rounded-lg border border-danger/20 text-sm text-foreground dark:text-background">
                                            {ticket.cancellationReason}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-muted/20 dark:bg-accent/10 px-6 py-4">
                <div className="flex justify-between items-center text-sm flex-wrap gap-2">
                    <span className="text-accent dark:text-muted">
                        Mostrando {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} resuelto{tickets.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex space-x-4 flex-wrap gap-2">
                        <span className="text-green-600 dark:text-green-400">
                            Resueltos: {tickets.filter(t => t.status.toLowerCase() === "resuelto").length}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                            Cancelados: {tickets.filter(t => t.status.toLowerCase() === "cancelada").length}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                            Tiempo promedio: {tickets.length > 0 ? 
                                Math.round(tickets.reduce((acc, ticket) => {
                                    const created = new Date(ticket.createdAt);
                                    const resolved = new Date(ticket.updatedAt);
                                    return acc + (resolved - created) / (1000 * 60 * 60);
                                }, 0) / tickets.length)
                            : 0}h
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminResolvedTicketsTable;