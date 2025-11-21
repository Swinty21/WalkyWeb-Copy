import { useState, useEffect } from "react";
import { FaTimes, FaUser, FaPaperPlane, FaExclamationTriangle } from "react-icons/fa";
import { format } from "date-fns";

const AdminTicketResponseModal = ({ isOpen, onClose, ticket, onSubmitResponse }) => {
    const [responseData, setResponseData] = useState({
        content: "",
        status: "Resuelto",
        agentName: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [useTemplate, setUseTemplate] = useState("");

    const responseTemplates = {
        "": "Seleccionar plantilla...",
        "resolved_technical": "Hola,\n\nGracias por contactarnos. Hemos identificado y solucionado el problema que reportas.\n\nPor favor:\n1. Cierra y vuelve a abrir la aplicación\n2. Verifica que tengas la última versión instalada\n3. Reinicia tu dispositivo si es necesario\n\nSi después de estos pasos sigues experimentando problemas, no dudes en contactarnos nuevamente.\n\n¡Gracias por tu paciencia!\n\nSaludos,\n[Tu nombre]\nEquipo de Soporte Técnico",
        "resolved_billing": "Estimado cliente,\n\nGracias por tu consulta sobre facturación.\n\nHemos revisado tu cuenta y [describir la acción tomada]. Tu consulta ha sido resuelta satisfactoriamente.\n\nSi tienes alguna pregunta adicional sobre tu facturación, no dudes en contactarnos.\n\nSaludos,\n[Tu nombre]\nEquipo de Atención al Cliente",
        "resolved_general": "Hola,\n\nGracias por contactarnos.\n\n[Respuesta personalizada aquí]\n\nEsperamos que esta información sea útil. Si necesitas ayuda adicional, no dudes en contactarnos nuevamente.\n\nSaludos,\n[Tu nombre]\nEquipo de Soporte",
        "cancelled": "Estimado cliente,\n\nDespués de revisar tu consulta, determinamos que [explicar razón de cancelación].\n\nSi consideras que esto es un error o necesitas aclaración adicional, por favor crea un nuevo ticket.\n\nSaludos,\n[Tu nombre]\nEquipo de Soporte"
    };

    useEffect(() => {
        if (isOpen && ticket) {
            setResponseData({
                content: "",
                status: "Resuelto",
                agentName: ""
            });
            setErrors({});
            setUseTemplate("");
        }
    }, [isOpen, ticket]);

    const handleTemplateChange = (templateKey) => {
        setUseTemplate(templateKey);
        if (templateKey && responseTemplates[templateKey]) {
            setResponseData(prev => ({
                ...prev,
                content: responseTemplates[templateKey]
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setResponseData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!responseData.content.trim()) {
            newErrors.content = "La respuesta es requerida";
        } else if (responseData.content.trim().length < 10) {
            newErrors.content = "La respuesta debe tener al menos 10 caracteres";
        }

        if (!responseData.agentName.trim()) {
            newErrors.agentName = "El nombre del agente es requerido";
        }

        if (!responseData.status) {
            newErrors.status = "Seleccione un estado";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmitResponse(ticket.id, responseData);
            
            setResponseData({
                content: "",
                status: "Resuelto",
                agentName: ""
            });
            setErrors({});
            setUseTemplate("");
        } catch (error) {
            console.error("Error submitting response:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setResponseData({
                content: "",
                status: "Resuelto",
                agentName: ""
            });
            setErrors({});
            setUseTemplate("");
            onClose();
        }
    };

    if (!isOpen || !ticket) return null;

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

    const daysSinceCreated = Math.floor((new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24));
    const isHighPriority = daysSinceCreated >= 3;
    const isMediumPriority = daysSinceCreated >= 1 && daysSinceCreated < 3;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-background dark:bg-foreground rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-border dark:border-muted">

                <div className={`p-6 border-b border-border dark:border-muted ${
                    isHighPriority ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10' :
                    isMediumPriority ? 'bg-gradient-to-r from-orange-500/10 to-yellow-500/10' :
                    'bg-gradient-to-r from-purple-500/10 to-blue-500/10'
                }`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                    Responder Ticket #{ticket.id}
                                </h2>
                                {(isHighPriority || isMediumPriority) && (
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                        isHighPriority ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                    }`}>
                                        <FaExclamationTriangle size={12} />
                                        Prioridad {isHighPriority ? 'Alta' : 'Media'}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-accent dark:text-muted">
                                <div className="flex items-center gap-1">
                                    <span>{getCategoryIcon(ticket.category)}</span>
                                    <span>{ticket.category}</span>
                                </div>
                                <span>Usuario #{ticket.userId}</span>
                                <span>Creado: {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}</span>
                                <span>Hace {daysSinceCreated} día{daysSinceCreated !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="p-2 hover:bg-muted/30 dark:hover:bg-accent/30 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            <FaTimes className="text-xl text-accent dark:text-muted" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    
                    <div className="w-2/5 border-r border-border dark:border-muted p-6 overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-foreground dark:text-background mb-2">
                                    Consulta Original
                                </h3>
                                <div className="bg-muted/20 dark:bg-accent/20 rounded-xl p-4 border border-border dark:border-muted">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaUser className="text-primary text-sm" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground dark:text-background">
                                                {ticket.subject}
                                            </div>
                                            <div className="text-sm text-accent dark:text-muted">
                                                {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-foreground dark:text-background text-sm leading-relaxed">
                                        {ticket.message}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-info/10 rounded-lg p-4 border border-info/20">
                                <h4 className="font-medium text-foreground dark:text-background mb-3 text-sm">
                                    Información del ticket:
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-accent dark:text-muted">Estado actual:</span>
                                        <span className="font-medium text-warning">En Espera</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-accent dark:text-muted">Tiempo transcurrido:</span>
                                        <span className="font-medium text-foreground dark:text-background">
                                            {Math.floor((new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60))}h
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-accent dark:text-muted">SLA objetivo:</span>
                                        <span className="font-medium text-foreground dark:text-background">48h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-accent dark:text-muted">Vencimiento:</span>
                                        <span className={`font-medium ${isHighPriority ? 'text-danger' : isMediumPriority ? 'text-warning' : 'text-success'}`}>
                                            {format(new Date(new Date(ticket.createdAt).getTime() + 48 * 60 * 60 * 1000), "dd/MM HH:mm")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/5 p-6 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    Plantilla de respuesta
                                </label>
                                <select
                                    value={useTemplate}
                                    onChange={(e) => handleTemplateChange(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background transition-colors duration-200 disabled:opacity-50"
                                >
                                    {Object.entries(responseTemplates).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    Nombre del agente *
                                </label>
                                <input
                                    type="text"
                                    name="agentName"
                                    value={responseData.agentName}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    placeholder="Ej: María González - Soporte Técnico"
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background transition-colors duration-200 disabled:opacity-50 ${
                                        errors.agentName ? 'border-red-500' : 'border-input'
                                    }`}
                                />
                                {errors.agentName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.agentName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    Estado de la respuesta *
                                </label>
                                <select
                                    name="status"
                                    value={responseData.status}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background transition-colors duration-200 disabled:opacity-50 ${
                                        errors.status ? 'border-red-500' : 'border-input'
                                    }`}
                                >
                                    <option value="Resuelto">Resuelto</option>
                                    <option value="Cancelada">Cancelar ticket</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    Respuesta *
                                </label>
                                <textarea
                                    name="content"
                                    value={responseData.content}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    placeholder={responseData.status === "Cancelada" ? 
                                        "Explica el motivo de la cancelación..." :
                                        "Escribe tu respuesta detallada al usuario..."
                                    }
                                    rows={12}
                                    maxLength={2000}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background resize-none transition-colors duration-200 disabled:opacity-50 ${
                                        errors.content ? 'border-red-500' : 'border-input'
                                    }`}
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.content && (
                                        <p className="text-sm text-red-500">{errors.content}</p>
                                    )}
                                    <p className="text-xs text-accent dark:text-muted ml-auto">
                                        {responseData.content.length}/2000
                                    </p>
                                </div>
                            </div>

                            {responseData.content.trim() && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                        Vista previa de la respuesta
                                    </label>
                                    <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-xl p-4 border border-success/20">
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaUser className="text-success text-sm" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground dark:text-background text-sm">
                                                    {responseData.agentName || "Nombre del agente"}
                                                </div>
                                                <div className="text-xs text-accent dark:text-muted">
                                                    {format(new Date(), "dd/MM/yyyy HH:mm")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-foreground dark:text-background whitespace-pre-wrap">
                                            {responseData.content}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-info/10 to-primary/10 rounded-lg p-4 border border-info/20">
                                <h4 className="font-medium text-foreground dark:text-background mb-2">
                                    Pautas para responder:
                                </h4>
                                <ul className="text-sm text-accent dark:text-muted space-y-1">
                                    <li>• Sé claro, conciso y profesional</li>
                                    <li>• Incluye pasos específicos cuando sea aplicable</li>
                                    <li>• Ofrece alternativas o seguimiento si es necesario</li>
                                    <li>• Mantén un tono amigable y empático</li>
                                    <li>• Verifica que has respondido completamente la consulta</li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="p-6 border-t border-border dark:border-muted bg-muted/20 dark:bg-accent/20">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-accent dark:text-muted">
                            {isHighPriority && (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <FaExclamationTriangle size={14} />
                                    <span>Ticket de alta prioridad - Responder con urgencia</span>
                                </div>
                            )}
                            {isMediumPriority && !isHighPriority && (
                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                    <FaExclamationTriangle size={14} />
                                    <span>Ticket de prioridad media - Responder pronto</span>
                                </div>
                            )}
                            {!isHighPriority && !isMediumPriority && (
                                <span>Ticket dentro del SLA - Responder dentro de 48h</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-6 py-3 border border-border dark:border-muted rounded-lg hover:bg-muted/30 dark:hover:bg-accent/30 transition-colors duration-200 font-medium text-foreground dark:text-background disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !responseData.content.trim() || !responseData.agentName.trim()}
                                className={`px-6 py-3 rounded-lg transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                                    responseData.status === "Cancelada" 
                                        ? "bg-danger text-white hover:bg-danger/90" 
                                        : "bg-success text-white hover:bg-success/90"
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="text-sm" />
                                        {responseData.status === "Cancelada" ? "Cancelar Ticket" : "Enviar Respuesta"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    );
};

export default AdminTicketResponseModal;