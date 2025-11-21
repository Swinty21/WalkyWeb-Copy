import { format } from "date-fns";
import { FiMessageSquare, FiClock, FiUser } from "react-icons/fi";
import { FaReply } from "react-icons/fa";

const AdminPendingTicketsTable = ({ tickets, onRespondToTicket, searchQuery }) => {
    const getPriorityColor = (createdAt) => {
        const daysSinceCreated = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated >= 3) return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10";
        if (daysSinceCreated >= 1) return "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/10";
        return "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10";
    };

    const getPriorityText = (createdAt) => {
        const daysSinceCreated = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated >= 3) return { text: "Alta", color: "text-red-600 dark:text-red-400" };
        if (daysSinceCreated >= 1) return { text: "Media", color: "text-orange-600 dark:text-orange-400" };
        return { text: "Baja", color: "text-green-600 dark:text-green-400" };
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

    if (tickets.length === 0) {
        return (
            <div className="bg-white dark:bg-foreground rounded-xl shadow-xl p-8 border border-border dark:border-muted">
                <div className="text-center">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMessageSquare className="text-success text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-background mb-2">
                        ¡Excelente trabajo!
                    </h3>
                    <p className="text-accent dark:text-muted">
                        {searchQuery ? 
                            `No se encontraron tickets pendientes que coincidan con "${searchQuery}"` :
                            "No hay tickets pendientes de respuesta en este momento"
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-foreground rounded-xl shadow-xl overflow-hidden border border-border dark:border-muted">
            <div className="bg-orange-600 p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <FiClock className="mr-2" size={20} />
                    Tickets Pendientes ({tickets.length})
                </h3>
                <p className="text-white/80 text-sm">
                    Tickets que requieren respuesta del equipo de soporte
                </p>
            </div>
            
            <div className="divide-y divide-border dark:divide-muted">
                {tickets.map((ticket, index) => {
                    const priority = getPriorityText(ticket.createdAt);
                    return (
                        <div
                            key={ticket.id}
                            className={`p-6 transition-colors duration-200 hover:bg-muted/30 dark:hover:bg-accent/20 ${getPriorityColor(ticket.createdAt)}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="font-mono text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">
                                            #{ticket.id}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-current/10 ${priority.color}`}>
                                            Prioridad {priority.text}
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

                                    <p className="text-accent dark:text-muted text-sm mb-3 line-clamp-3">
                                        {ticket.message}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-accent dark:text-muted">
                                        <div className="flex items-center gap-1">
                                            <FiUser size={12} />
                                            <span>Usuario #{ticket.userId}</span>
                                        </div>
                                        <span>
                                            Creado: {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                                        </span>
                                        <span>
                                            Tiempo transcurrido: {Math.floor((new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60))}h
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => onRespondToTicket(ticket)}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                    >
                                        <FaReply className="text-xs" />
                                        Responder
                                    </button>
                                    <div className="text-xs text-center text-accent dark:text-muted">
                                        SLA: {format(new Date(new Date(ticket.createdAt).getTime() + 48 * 60 * 60 * 1000), "dd/MM HH:mm")}
                                    </div>
                                </div>
                            </div>

                            {ticket.message.length > 150 && (
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm text-primary hover:text-primary/80 font-medium">
                                        Ver mensaje completo
                                    </summary>
                                    <div className="mt-2 p-4 bg-muted/20 dark:bg-accent/10 rounded-lg text-sm text-foreground dark:text-background">
                                        {ticket.message}
                                    </div>
                                </details>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="bg-muted/20 dark:bg-accent/10 px-6 py-4">
                <div className="flex justify-between items-center text-sm flex-wrap gap-2">
                    <span className="text-accent dark:text-muted">
                        Mostrando {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} pendiente{tickets.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex space-x-4 flex-wrap gap-2">
                        <span className="text-red-600 dark:text-red-400">
                            Alta prioridad: {tickets.filter(t => Math.floor((new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24)) >= 3).length}
                        </span>
                        <span className="text-orange-600 dark:text-orange-400">
                            Media prioridad: {tickets.filter(t => {
                                const days = Math.floor((new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24));
                                return days >= 1 && days < 3;
                            }).length}
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                            Baja prioridad: {tickets.filter(t => Math.floor((new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24)) < 1).length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPendingTicketsTable;