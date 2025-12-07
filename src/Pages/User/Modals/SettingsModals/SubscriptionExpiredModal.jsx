import { FaExclamationTriangle, FaTimes, FaCrown, FaCalendarAlt } from 'react-icons/fa';

const SubscriptionExpiredModal = ({ isOpen, onClose, subscription, onRenewClick }) => {
    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysExpired = () => {
        if (!subscription?.expiryDate) return 0;
        const expiry = new Date(subscription.expiryDate);
        const today = new Date();
        const diffTime = today - expiry;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-accent dark:text-muted hover:text-foreground dark:hover:text-background transition-colors p-2 rounded-full hover:bg-muted/20"
                    >
                        <FaTimes className="text-xl" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-red-400 to-red-600 mb-6 animate-pulse">
                            <FaExclamationTriangle className="text-5xl text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground dark:text-background mb-3">
                            Suscripción Vencida
                        </h2>
                        <p className="text-accent dark:text-muted text-lg">
                            Tu plan ha expirado y necesita ser renovado
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-6 border-2 border-red-200 dark:border-red-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <FaCrown className="text-red-600 text-xl" />
                                    <div>
                                        <p className="text-xs text-accent dark:text-muted">Plan Vencido</p>
                                        <p className="text-sm font-semibold text-foreground dark:text-background capitalize">
                                            {subscription?.plan || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <FaCalendarAlt className="text-red-600 text-xl" />
                                    <div>
                                        <p className="text-xs text-accent dark:text-muted">Fecha de Vencimiento</p>
                                        <p className="text-sm font-semibold text-foreground dark:text-background">
                                            {formatDate(subscription?.expiryDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-red-700 dark:text-red-300 font-semibold">
                                Expiró hace {getDaysExpired()} día{getDaysExpired() !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
                        <h4 className="font-semibold text-foreground dark:text-background mb-3 flex items-center gap-2">
                            <FaExclamationTriangle className="text-amber-600" />
                            ¿Qué significa esto?
                        </h4>
                        <ul className="space-y-2 text-sm text-accent dark:text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">✗</span>
                                <span>Has perdido acceso a las funciones premium de tu plan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">✗</span>
                                <span>Tu cuenta ha sido revertida al plan gratuito</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">✗</span>
                                <span>Algunas funcionalidades están ahora limitadas</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
                        <h4 className="font-semibold text-foreground dark:text-background mb-3 flex items-center gap-2">
                            <FaCrown className="text-green-600" />
                            Renueva y recupera el acceso
                        </h4>
                        <ul className="space-y-2 text-sm text-accent dark:text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>Recupera todas las funciones premium inmediatamente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>Elige un nuevo plan o renueva el anterior</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>Sin penalizaciones ni cargos adicionales</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-6 bg-muted/30 text-foreground dark:text-background rounded-xl hover:bg-muted/50 transition-all duration-200 font-semibold"
                        >
                            Recordar más tarde
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                onRenewClick();
                            }}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-success text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                        >
                            Renovar Suscripción
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionExpiredModal;