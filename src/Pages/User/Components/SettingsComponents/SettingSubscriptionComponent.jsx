import { FaCrown, FaCalendarAlt, FaDollarSign, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { MdSubscriptions, MdAccessTime } from 'react-icons/md';

const SettingSubscriptionComponent = ({ subscription, onOpenSubscriptionModal }) => {
    const getSubscriptionBadgeColor = (plan) => {
        switch (plan?.toLowerCase()) {
            case 'gold':
                return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
            case 'silver':
                return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
            case 'bronze':
                return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
            case 'platinum':
                return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
            case 'free':
                return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
            default:
                return 'bg-gradient-to-r from-primary to-success text-white';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysUntilExpiry = (expiryDate) => {
        if (!expiryDate) return null;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const isExpiringSoon = (expiryDate) => {
        const days = getDaysUntilExpiry(expiryDate);
        return days !== null && days <= 7 && days > 0;
    };

    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const getStatusBadge = () => {
        if (!subscription?.expiryDate) {
            return (
                <div className="px-4 py-2 rounded-full text-sm font-bold bg-green-500/70 text-white flex items-center gap-2">
                    <FaCheckCircle />
                    ACTIVO
                </div>
            );
        }

        if (isExpired(subscription.expiryDate)) {
            return (
                <div className="px-4 py-2 rounded-full text-sm font-bold bg-danger/70 text-white flex items-center gap-2">
                    <FaTimesCircle />
                    VENCIDO
                </div>
            );
        }

        if (isExpiringSoon(subscription.expiryDate)) {
            return (
                <div className="px-4 py-2 rounded-full text-sm font-bold bg-warning/70 text-black flex items-center gap-2">
                    <FaInfoCircle />
                    POR VENCER
                </div>
            );
        }

        return (
            <div className="px-4 py-2 rounded-full text-sm font-bold bg-success/70 text-black flex items-center gap-2">
                <FaCheckCircle />
                ACTIVO
            </div>
        );
    };

    const getExpiryWarning = () => {
        if (!subscription?.expiryDate) return null;

        const days = getDaysUntilExpiry(subscription.expiryDate);
        
        if (days !== null && days <= 0) {
            return (
                <div className="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-xl">
                    <div className="flex items-center gap-2 text-danger font-semibold">
                        <FaTimesCircle />
                        Suscripción Vencida
                    </div>
                    <p className="text-sm text-danger/80 mt-1">
                        Tu suscripción venció el {formatDate(subscription.expiryDate)}. Renueva tu plan para seguir disfrutando de todos los beneficios.
                    </p>
                </div>
            );
        }

        if (days !== null && days <= 7) {
            return (
                <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-xl">
                    <div className="flex items-center gap-2 text-warning font-semibold">
                        <FaInfoCircle />
                        Suscripción por Vencer
                    </div>
                    <p className="text-sm text-warning/80 mt-1">
                        Tu suscripción vence en {days} día{days !== 1 ? 's' : ''}. Renueva antes del {formatDate(subscription.expiryDate)} para evitar interrupciones.
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-background dark:bg-foreground rounded-2xl shadow-xl p-8 border border-border dark:border-muted">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <MdSubscriptions className="text-3xl text-primary mr-4" />
                    <h2 className="text-2xl font-bold text-foreground dark:text-background">
                        Suscripción
                    </h2>
                </div>
                <button
                    onClick={onOpenSubscriptionModal}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                    Gestionar Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/5 to-success/5 rounded-xl border border-primary/20">
                    <div className="flex items-center space-x-4">
                        <FaCrown className="text-3xl text-primary" />
                        <div>
                            <p className="font-semibold text-foreground dark:text-background text-lg">
                                Plan Actual
                            </p>
                            <p className="text-accent dark:text-muted capitalize">
                                {subscription?.plan === 'free' ? 'Plan Gratuito' : subscription?.plan || 'Sin Plan'}
                            </p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${getSubscriptionBadgeColor(subscription?.plan)}`}>
                        {subscription?.plan?.toUpperCase() || 'FREE'}
                    </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-muted/30 rounded-xl">
                    <div className="flex items-center space-x-4">
                        <FaCheckCircle className="text-2xl text-success" />
                        <div>
                            <p className="font-semibold text-foreground dark:text-background text-lg">
                                Estado
                            </p>
                            <p className="text-accent dark:text-muted">
                                {subscription?.isActive ? 'Activo' : 'Inactivo'}
                            </p>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>
            </div>

            {(subscription?.startDate || subscription?.expiryDate) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {subscription?.startDate && (
                        <div className="flex items-center justify-between p-6 bg-info/10 rounded-xl border border-info/20">
                            <div className="flex items-center space-x-4">
                                <MdAccessTime className="text-2xl text-info" />
                                <div>
                                    <p className="font-semibold text-foreground dark:text-background text-lg">
                                        Fecha de Inicio
                                    </p>
                                    <p className="text-accent dark:text-muted">
                                        {formatDateTime(subscription.startDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {subscription?.expiryDate && (
                        <div className="flex items-center justify-between p-6 bg-muted/30 rounded-xl">
                            <div className="flex items-center space-x-4">
                                <FaCalendarAlt className="text-2xl text-accent dark:text-muted" />
                                <div>
                                    <p className="font-semibold text-foreground dark:text-background text-lg">
                                        Fecha de Vencimiento
                                    </p>
                                    <p className="text-accent dark:text-muted">
                                        {formatDate(subscription.expiryDate)}
                                    </p>
                                    {getDaysUntilExpiry(subscription.expiryDate) > 0 && (
                                        <p className="text-xs text-accent dark:text-muted">
                                            ({getDaysUntilExpiry(subscription.expiryDate)} días restantes)
                                        </p>
                                    )}
                                </div>
                            </div>
                            {getStatusBadge()}
                        </div>
                    )}
                </div>
            )}

            {getExpiryWarning()}

            {subscription?.plan === 'free' && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-3">
                        <FaInfoCircle className="text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-green-800 dark:text-green-200">
                            Plan Gratuito
                        </h3>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Estás utilizando nuestro plan gratuito. Upgrade tu cuenta para acceder a más funciones y beneficios exclusivos.
                    </p>
                    <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                        <li>• Hasta 2 paseos por mes</li>
                        <li>• Paseadores básicos</li>
                        <li>• Soporte por email</li>
                        <li>• Notificaciones básicas</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SettingSubscriptionComponent;