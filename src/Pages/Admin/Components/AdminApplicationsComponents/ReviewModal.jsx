import { useState } from 'react';
import { FaCheckCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose, onSubmit, action, application, loading }) => {
    const [adminNotes, setAdminNotes] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Validación para rechazo
        if (action === 'reject' && !adminNotes.trim()) {
            setErrors({ notes: 'Debes proporcionar una razón para el rechazo' });
            return;
        }

        if (adminNotes.trim().length > 500) {
            setErrors({ notes: 'Las notas no pueden exceder los 500 caracteres' });
            return;
        }

        onSubmit(adminNotes.trim());
    };

    const handleClose = () => {
        setAdminNotes('');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const isApproval = action === 'approve';
    const actionText = isApproval ? 'Aprobar' : 'Rechazar';
    const ActionIcon = isApproval ? FaCheckCircle : FaTimes;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 dark:bg-foreground/95 backdrop-blur-sm rounded-2xl max-w-md w-full border border-primary/10 shadow-2xl">
                <div className="p-6 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-12 h-12 bg-gradient-to-br ${
                                isApproval 
                                    ? 'from-green-500 to-emerald-500' 
                                    : 'from-red-500 to-pink-500'
                            } rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                                <ActionIcon className="text-white text-xl" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground dark:text-background">
                                {actionText} Solicitud
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="w-8 h-8 bg-gray-500/10 rounded-full flex items-center justify-center text-accent dark:text-muted hover:text-foreground dark:hover:text-background transition-all duration-200 disabled:opacity-50 hover:bg-gray-500/20"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <div className={`p-4 rounded-xl mb-4 border ${
                            isApproval 
                                ? 'bg-green-500/10 border-green-500/20' 
                                : 'bg-red-500/10 border-red-500/20'
                        } backdrop-blur-sm`}>
                            <div className="flex items-start">
                                {isApproval ? (
                                    <FaCheckCircle className="text-green-500 text-lg mr-3 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <FaExclamationTriangle className="text-red-500 text-lg mr-3 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                    <h3 className={`font-semibold ${
                                        isApproval ? 'text-green-600' : 'text-red-600'
                                    } mb-2`}>
                                        {isApproval 
                                            ? '¿Confirmar aprobación?' 
                                            : '¿Confirmar rechazo?'
                                        }
                                    </h3>
                                    <div className="bg-white/50 dark:bg-foreground/50 rounded-lg p-3 backdrop-blur-sm border border-primary/10">
                                        <p className="text-sm text-accent dark:text-muted space-y-1">
                                            <span className="block"><strong>Solicitante:</strong> {application?.fullName}</span>
                                            <span className="block"><strong>DNI:</strong> {application?.dni}</span>
                                            <span className="block"><strong>ID:</strong> {application?.id}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isApproval && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4 backdrop-blur-sm">
                                <div className="flex items-start">
                                    <FaCheckCircle className="text-blue-500 text-lg mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-blue-600 mb-2">
                                            Al aprobar esta solicitud:
                                        </h4>
                                        <div className="bg-white/50 dark:bg-foreground/50 rounded-lg p-3 backdrop-blur-sm border border-blue-500/10">
                                            <ul className="text-sm text-accent dark:text-muted space-y-1">
                                                <li>• El usuario será promovido a rol de "Walker"</li>
                                                <li>• Tendrá acceso a funciones de paseador</li>
                                                <li>• Recibirá notificación de aprobación</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-foreground dark:text-background font-semibold mb-3">
                                {isApproval ? 'Comentarios (opcional)' : 'Razón del rechazo *'}
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder={
                                    isApproval 
                                        ? 'Comentarios adicionales sobre la aprobación...'
                                        : 'Explica por qué se rechaza la solicitud...'
                                }
                                className={`w-full p-4 border-2 rounded-xl bg-white/50 dark:bg-foreground/50 backdrop-blur-sm text-foreground dark:text-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                                    errors.notes ? 'border-red-500' : 'border-primary/20 hover:border-primary/50'
                                }`}
                                rows={4}
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-2">
                                {errors.notes && (
                                    <p className="text-sm text-red-600 font-medium">{errors.notes}</p>
                                )}
                                <p className="text-xs text-accent dark:text-muted ml-auto">
                                    {adminNotes.length}/500 caracteres
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 bg-gray-500/10 text-foreground dark:text-background border border-gray-500/20 py-3 px-6 rounded-xl font-semibold hover:bg-gray-500/20 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 bg-gradient-to-r ${
                                isApproval 
                                    ? 'from-green-500 to-emerald-500' 
                                    : 'from-red-500 to-pink-500'
                            } text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Procesando...
                                </div>
                            ) : (
                                <>
                                    <ActionIcon className="mr-2" />
                                    {actionText}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;