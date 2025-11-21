import { useState } from "react";
import { FaHistory, FaEye, FaFilter, FaSync } from "react-icons/fa";
import { format } from "date-fns";
import TicketResponseModal from "../../Modals/TicketsModals/TicketResponseModal";

const MyTicketsComponent = ({ tickets, onRefresh }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [refreshing, setRefreshing] = useState(false);

    const filteredTickets = tickets.filter(ticket => 
        filterStatus === "all" || ticket.status.toLowerCase() === filterStatus.toLowerCase()
    );

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "en espera":
            case "waiting":
                return "bg-warning/70 text-black";
            case "resuelto":
            case "resolved":
                return "bg-success/70 text-black";
            case "cancelada":
            case "cancelled":
                return "bg-danger/70 text-black";
            default:
                return "bg-neutral/70 text-black";
        }
    };

    const handleViewResponse = (ticket) => {
        setSelectedTicket(ticket);
        setIsResponseModalOpen(true);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setRefreshing(false);
        }
    };

    const getStatusCount = (status) => {
        return tickets.filter(ticket => 
            ticket.status.toLowerCase() === status.toLowerCase()
        ).length;
    };

    return (
        <div className="space-y-6">
            
            <div className="bg-background dark:bg-foreground rounded-xl shadow-lg p-6 border border-border dark:border-muted">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground dark:text-background mb-2 flex items-center gap-2">
                            <FaHistory className="text-primary" />
                            Historial de Consultas
                        </h2>
                        <p className="text-accent dark:text-muted text-sm">
                            Total de consultas: {tickets.length}
                        </p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-background dark:bg-foreground border border-border dark:border-muted rounded-lg hover:bg-muted/30 dark:hover:bg-accent/30 transition-colors duration-200 disabled:opacity-50"
                        >
                            <FaSync className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium text-foreground dark:text-background">
                                Actualizar
                            </span>
                        </button>

                        <div className="flex items-center gap-2">
                            <FaFilter className="text-accent dark:text-muted" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background text-sm"
                            >
                                <option value="all">Todos ({tickets.length})</option>
                                <option value="en espera">En Espera ({getStatusCount("en espera")})</option>
                                <option value="resuelto">Resuelto ({getStatusCount("resuelto")})</option>
                                <option value="cancelada">Cancelada ({getStatusCount("cancelada")})</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {filteredTickets.length === 0 ? (
                <div className="bg-background dark:bg-foreground rounded-xl shadow-lg p-12 text-center border border-border dark:border-muted">
                    <div className="text-6xl text-accent dark:text-muted mb-4">
                        📋
                    </div>
                    <h3 className="text-xl font-semibold text-foreground dark:text-background mb-2">
                        {filterStatus === "all" ? "No tienes consultas" : `No tienes consultas con estado "${filterStatus}"`}
                    </h3>
                    <p className="text-accent dark:text-muted">
                        {filterStatus === "all" 
                            ? "Cuando tengas consultas aparecerán aquí"
                            : "Prueba cambiando el filtro para ver otras consultas"
                        }
                    </p>
                </div>
            ) : (
                <div className="bg-background dark:bg-foreground rounded-xl shadow-lg overflow-hidden border border-border dark:border-muted">
                    <div className="divide-y divide-border dark:divide-muted">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="p-6 hover:bg-muted/30 dark:hover:bg-accent/30 transition-colors duration-200"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-medium text-accent dark:text-muted">
                                                Ticket #{ticket.id}
                                            </span>
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </div>

                                        <h3 className="font-semibold text-lg text-foreground dark:text-background mb-2 truncate">
                                            {ticket.subject}
                                        </h3>

                                        <p className="text-accent dark:text-muted text-sm mb-3 line-clamp-2">
                                            {ticket.message}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-accent dark:text-muted">
                                            <span>
                                                Creado: {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                                            </span>
                                            {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                                                <span>
                                                    Actualizado: {format(new Date(ticket.updatedAt), "dd/MM/yyyy HH:mm")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {(ticket.status.toLowerCase() === "resuelto" || ticket.status.toLowerCase() === "resolved" ||
                                            ticket.status.toLowerCase() === "cancelada" || ticket.status.toLowerCase() === "cancelled") && (
                                                <button
                                                    onClick={() => handleViewResponse(ticket)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                                >
                                                    <FaEye className="text-xs" />
                                                    Ver Respuesta
                                                </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <TicketResponseModal
                isOpen={isResponseModalOpen}
                onClose={() => setIsResponseModalOpen(false)}
                ticket={selectedTicket}
            />
        </div>
    );
};

export default MyTicketsComponent;