import { FaTimes, FaUser, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format } from "date-fns";

const TicketResponseModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen || !ticket) return null;

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "resuelto":
            case "resolved":
                return <FaCheckCircle className="text-success" />;
            case "cancelada":
            case "cancelled":
                return <FaTimesCircle className="text-danger" />;
            default:
                return <FaClock className="text-warning" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resuelto":
            case "resolved":
                return "text-success";
            case "cancelada":
            case "cancelled":
                return "text-danger";
            default:
                return "text-warning";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-background dark:bg-foreground rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border dark:border-muted">

                <div className="bg-gradient-to-r from-primary/10 to-success/10 p-6 border-b border-border dark:border-muted">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                    Ticket #{ticket.id}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(ticket.status)}
                                    <span className={`font-semibold ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                {ticket.subject}
                            </h3>
                            <p className="text-accent dark:text-muted">
                                Creado el {format(new Date(ticket.createdAt), "dd/MM/yyyy 'a las' HH:mm")}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted/30 dark:hover:bg-accent/30 rounded-lg transition-colors duration-200"
                        >
                            <FaTimes className="text-xl text-accent dark:text-muted" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">

                    <div className="bg-muted/20 dark:bg-accent/20 rounded-xl p-6 border border-border dark:border-muted">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaUser className="text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-foreground dark:text-background">
                                        Tu consulta
                                    </span>
                                    <span className="text-sm text-accent dark:text-muted">
                                        {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                                    </span>
                                </div>
                                <p className="text-foreground dark:text-background leading-relaxed">
                                    {ticket.message}
                                </p>
                                {ticket.category && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs text-accent dark:text-muted">
                                            Categoría:
                                        </span>
                                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                            {ticket.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {ticket.response && (
                        <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-xl p-6 border border-success/20">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FaUser className="text-success" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-semibold text-foreground dark:text-background">
                                            {ticket.response.agentName || "Equipo de Soporte"}\n                                        </span>
                                        <span className="text-sm text-accent dark:text-muted">
                                            {format(new Date(ticket.response.date), "dd/MM/yyyy HH:mm")}
                                        </span>
                                    </div>
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-foreground dark:text-background leading-relaxed whitespace-pre-wrap">
                                            {ticket.response.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-info/10 rounded-lg p-4 border border-info/20">
                        <h4 className="font-medium text-foreground dark:text-background mb-2">
                            Información del ticket:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-accent dark:text-muted">Estado:</span>
                                <span className={`ml-2 font-medium ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-accent dark:text-muted">Creado:</span>
                                <span className="ml-2 text-foreground dark:text-background">
                                    {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                                </span>
                            </div>
                            {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                                <div>
                                    <span className="text-accent dark:text-muted">Última actualización:</span>
                                    <span className="ml-2 text-foreground dark:text-background">
                                        {format(new Date(ticket.updatedAt), "dd/MM/yyyy HH:mm")}
                                    </span>
                                </div>
                            )}
                            {ticket.category && (
                                <div>
                                    <span className="text-accent dark:text-muted">Categoría:</span>
                                    <span className="ml-2 text-foreground dark:text-background">
                                        {ticket.category}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {(ticket.status.toLowerCase() === "cancelada" || ticket.status.toLowerCase() === "cancelled") && 
                        ticket.cancellationReason && (
                            <div className="bg-danger/10 rounded-lg p-4 border border-danger/20">
                                <h4 className="font-medium text-foreground dark:text-background mb-2 text-danger">
                                    Razón de cancelación:
                                </h4>
                                <p className="text-sm text-foreground dark:text-background">
                                    {ticket.cancellationReason}
                                </p>
                            </div>
                    )}
                </div>

                <div className="p-6 border-t border-border dark:border-muted bg-muted/20 dark:bg-accent/20">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-accent dark:text-muted">
                            ¿Necesitas más ayuda? Puedes crear una nueva consulta.
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketResponseModal;
