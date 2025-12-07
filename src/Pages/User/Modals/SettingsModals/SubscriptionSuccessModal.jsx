import { FaCheckCircle, FaTimes, FaCrown, FaCalendarAlt, FaDollarSign, FaStar } from 'react-icons/fa';
import { MdDiamond } from 'react-icons/md';

const SubscriptionSuccessModal = ({ isOpen, onClose, subscription, previousPlan }) => {
    if (!isOpen) return null;

    const planConfig = {
        free: {
            icon: FaStar,
            color: 'from-green-400 to-green-600',
            name: 'Plan Gratuito'
        },
        bronze: {
            icon: FaCrown,
            color: 'from-amber-600 to-amber-800',
            name: 'Plan Bronce'
        },
        silver: {
            icon: MdDiamond,
            color: 'from-gray-300 to-gray-500',
            name: 'Plan Plata'
        },
        gold: {
            icon: FaCrown,
            color: 'from-yellow-400 to-yellow-600',
            name: 'Plan Oro'
        },
        platinum: {
            icon: MdDiamond,
            color: 'from-purple-400 to-purple-600',
            name: 'Plan Platino'
        }
    };

    const randomPlanConfigs = [
        { icon: FaCrown, color: 'from-blue-400 to-blue-600' },
        { icon: MdDiamond, color: 'from-pink-400 to-pink-600' },
        { icon: FaStar, color: 'from-indigo-400 to-indigo-600' },
        { icon: FaCrown, color: 'from-red-400 to-red-600' },
        { icon: MdDiamond, color: 'from-teal-400 to-teal-600' },
        { icon: FaStar, color: 'from-orange-400 to-orange-600' },
        { icon: FaCrown, color: 'from-cyan-400 to-cyan-600' },
        { icon: MdDiamond, color: 'from-lime-400 to-lime-600' }
    ];

    const getRandomPlanConfig = (planName) => {
        const randomIndex = Math.abs(planName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % randomPlanConfigs.length;
        return randomPlanConfigs[randomIndex];
    };

    const getPlanConfig = () => {
        if (planConfig[subscription?.plan]) {
            return planConfig[subscription?.plan];
        }
        const randomConfig = getRandomPlanConfig(subscription?.plan || 'default');
        return {
            ...randomConfig,
            name: subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'Plan Personalizado'
        };
    };

    const currentPlanConfig = getPlanConfig();
    const IconComponent = currentPlanConfig.icon;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isUpgrade = previousPlan && previousPlan !== subscription?.plan;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-accent dark:text-muted hover:text-foreground dark:hover:text-background transition-colors p-2 rounded-full hover:bg-muted/20"
                    >
                        <FaTimes className="text-xl" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-6 animate-bounce-slow">
                            <FaCheckCircle className="text-5xl text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground dark:text-background mb-3">
                            {isUpgrade ? '¡Suscripción Actualizada!' : '¡Suscripción Exitosa!'}
                        </h2>
                        <p className="text-accent dark:text-muted text-lg">
                            {isUpgrade 
                                ? `Has cambiado tu plan exitosamente`
                                : 'Tu nueva suscripción está activa'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-primary/5 to-success/5 rounded-2xl p-6 mb-6 border border-primary/20">
                        <div className="flex items-center justify-center mb-6">
                            <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${currentPlanConfig.color}`}>
                                <IconComponent className="text-3xl text-white" />
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-center text-foreground dark:text-background mb-6">
                            {currentPlanConfig.name}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-background/50 dark:bg-foreground/50 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <FaCalendarAlt className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-accent dark:text-muted">Fecha de Inicio</p>
                                        <p className="text-sm font-semibold text-foreground dark:text-background">
                                            {formatDate(subscription?.startDate || new Date())}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {subscription?.expiryDate && (
                                <div className="bg-background/50 dark:bg-foreground/50 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <FaCalendarAlt className="text-warning text-xl" />
                                        <div>
                                            <p className="text-xs text-accent dark:text-muted">Vence el</p>
                                            <p className="text-sm font-semibold text-foreground dark:text-background">
                                                {formatDate(subscription.expiryDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-info/10 border border-info/20 rounded-xl p-6 mb-6">
                        <h4 className="font-semibold text-foreground dark:text-background mb-3 flex items-center gap-2">
                            <FaStar className="text-info" />
                            ¿Qué sigue?
                        </h4>
                        <ul className="space-y-2 text-sm text-accent dark:text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-1">✓</span>
                                <span>Ya puedes disfrutar de todos los beneficios de tu plan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-1">✓</span>
                                <span>Recibirás un correo de confirmación con los detalles</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-1">✓</span>
                                <span>Puedes cambiar o cancelar tu plan en cualquier momento</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-6 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSuccessModal;