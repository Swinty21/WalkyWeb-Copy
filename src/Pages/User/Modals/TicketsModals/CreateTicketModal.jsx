import { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

const CreateTicketModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        category: "general"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        { value: "general", label: "Consulta General" },
        { value: "technical", label: "Problema Técnico" },
        { value: "billing", label: "Facturación" },
        { value: "account", label: "Cuenta de Usuario" },
        { value: "walker", label: "Paseadores" },
        { value: "service", label: "Servicios de Paseo" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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

        if (!formData.subject.trim()) {
            newErrors.subject = "El asunto es requerido";
        } else if (formData.subject.trim().length < 5) {
            newErrors.subject = "El asunto debe tener al menos 5 caracteres";
        }

        if (!formData.message.trim()) {
            newErrors.message = "El mensaje es requerido";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "El mensaje debe tener al menos 10 caracteres";
        }

        if (!formData.category) {
            newErrors.category = "Seleccione una categoría";
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
            await onSubmit(formData);
            
            setFormData({
                subject: "",
                message: "",
                category: "general"
            });
            setErrors({});
        } catch (error) {
            console.error("Error submitting ticket:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                subject: "",
                message: "",
                category: "general"
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-background dark:bg-foreground rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-border dark:border-muted">

                <div className="bg-gradient-to-r from-primary/10 to-success/10 p-6 border-b border-border dark:border-muted">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                Nueva Consulta
                            </h2>
                            <p className="text-accent dark:text-muted mt-1">
                                Describe tu consulta y nuestro equipo te ayudará
                            </p>
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Categoría *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background transition-colors duration-200 disabled:opacity-50 ${
                                errors.category ? 'border-red-500' : 'border-input'
                            }`}
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Asunto *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            placeholder="Describe brevemente tu consulta..."
                            maxLength={100}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background transition-colors duration-200 disabled:opacity-50 ${
                                errors.subject ? 'border-red-500' : 'border-input'
                            }`}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.subject && (
                                <p className="text-sm text-red-500">{errors.subject}</p>
                            )}
                            <p className="text-xs text-accent dark:text-muted ml-auto">
                                {formData.subject.length}/100
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Mensaje *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            placeholder="Proporciona todos los detalles relevantes sobre tu consulta..."
                            rows={6}
                            maxLength={1000}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background resize-none transition-colors duration-200 disabled:opacity-50 ${
                                errors.message ? 'border-red-500' : 'border-input'
                            }`}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.message && (
                                <p className="text-sm text-red-500">{errors.message}</p>
                            )}
                            <p className="text-xs text-accent dark:text-muted ml-auto">
                                {formData.message.length}/1000
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-info/10 to-primary/10 rounded-lg p-4 border border-info/20">
                        <h4 className="font-medium text-foreground dark:text-background mb-2">
                            Información importante:
                        </h4>
                        <ul className="text-sm text-accent dark:text-muted space-y-1">
                            <li>• Nuestro tiempo de respuesta promedio es de 24-48 horas hábiles</li>
                            <li>• Incluye todos los detalles relevantes para una respuesta más rápida</li>
                            <li>• Recibirás una notificación cuando respondamos tu consulta</li>
                        </ul>
                    </div>
                </form>

                <div className="p-6 border-t border-border dark:border-muted bg-muted/20 dark:bg-accent/20">
                    <div className="flex gap-3 justify-end">
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
                            disabled={isSubmitting || !formData.subject.trim() || !formData.message.trim()}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane className="text-sm" />
                                    Enviar Consulta
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>    
    );
};

export default CreateTicketModal;