import { useState, useEffect } from 'react';
import { FaTimes, FaCrown, FaCheck, FaStar, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { MdDiamond } from 'react-icons/md';
import { SettingsController } from '../../../../BackEnd/Controllers/SettingsController';
import { useUser } from '../../../../BackEnd/Context/UserContext';

const SubscriptionModal = ({ isOpen, onClose, currentSubscription, onSubscriptionUpdate }) => {
    const user = useUser();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(true);

    const planConfig = {
        free: {
            icon: FaStar,
            color: 'from-green-400 to-green-600',
            popular: false
        },
        bronze: {
            icon: FaCrown,
            color: 'from-amber-600 to-amber-800',
            popular: false
        },
        silver: {
            icon: MdDiamond,
            color: 'from-gray-300 to-gray-500',
            popular: true
        },
        gold: {
            icon: FaCrown,
            color: 'from-yellow-400 to-yellow-600',
            popular: false
        },
        platinum: {
            icon: MdDiamond,
            color: 'from-purple-400 to-purple-600',
            popular: false
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadPlans();
        }
    }, [isOpen]);

    const loadPlans = async () => {
        try {
            setPlansLoading(true);
            const subscriptionPlans = await SettingsController.getSubscriptionPlans();
            
            const plansWithConfig = subscriptionPlans.map(plan => ({
                ...plan,
                ...planConfig[plan.plan_id || plan.id],
                
                features: Array.isArray(plan.features) ? plan.features : [],
                
                maxWalks: plan.max_walks,
                supportLevel: plan.support_level,
                cancellationPolicy: plan.cancellation_policy,
                discountPercentage: plan.discount_percentage || 0
            }));
            
            setPlans(plansWithConfig);
        } catch (error) {
            console.error('Error loading subscription plans:', error);
        } finally {
            setPlansLoading(false);
        }
    };

    const getWalksText = (maxWalks) => {
        if (maxWalks === -1) return 'Paseos ilimitados';
        if (maxWalks === 0) return 'Sin paseos incluidos';
        return `Hasta ${maxWalks} paseos por mes`;
    };

    const getSupportText = (supportLevel) => {
        const supportMap = {
            'email': 'Soporte por email',
            'priority': 'Soporte prioritario',
            '24/7': 'Soporte 24/7',
            'dedicated': 'Soporte dedicado'
        };
        return supportMap[supportLevel] || 'Soporte estándar';
    };

    const getCancellationText = (policy) => {
        const policyMap = {
            'none': 'Sin cancelación gratuita',
            'standard': 'Cancelación gratuita 24h antes',
            'flexible': 'Cancelación gratuita 2h antes',
            'anytime': 'Cancelación gratuita sin restricciones'
        };
        return policyMap[policy] || 'Política estándar';
    };

    const handlePlanSelect = async (planId) => {
        if (loading || planId === currentSubscription?.plan) return;

        try {
            setLoading(true);
            setSelectedPlan(planId);
            
            const result = await SettingsController.updateSubscription(user?.id, planId);
            onSubscriptionUpdate(result);
            
            onClose();
            setSelectedPlan(null);
            
        } catch (error) {
            console.error('Error updating subscription:', error);
            setSelectedPlan(null);
        } finally {
            setLoading(false);
        }
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
    };

    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">

                <div className="relative p-6 border-b border-border dark:border-muted">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                Planes de Suscripción
                            </h2>
                            <p className="text-accent dark:text-muted mt-1">
                                Elige el plan que mejor se adapte a tus necesidades
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="p-2 hover:bg-muted/30 rounded-full transition-colors duration-200 disabled:opacity-50"
                        >
                            <FaTimes className="text-xl text-foreground dark:text-background" />
                        </button>
                    </div>
                    
                    {currentSubscription && (
                        <div className="mt-4">
                            <div className={`p-3 rounded-lg border ${
                                isExpired(currentSubscription.expiryDate) 
                                    ? 'bg-danger/10 border-danger/20' 
                                    : isExpiringSoon(currentSubscription.expiryDate)
                                    ? 'bg-warning/10 border-warning/20'
                                    : 'bg-primary/10 border-primary/20'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {isExpired(currentSubscription.expiryDate) && <FaExclamationTriangle className="text-danger" />}
                                    {isExpiringSoon(currentSubscription.expiryDate) && <FaInfoCircle className="text-warning" />}
                                    <p className="text-sm text-foreground dark:text-background">
                                        <span className="font-medium">Plan actual:</span> {currentSubscription.plan?.toUpperCase() || 'FREE'}
                                        {currentSubscription.expiryDate && (
                                            <span className="ml-2 text-accent dark:text-muted">
                                                • {isExpired(currentSubscription.expiryDate) ? 'Venció' : 'Vence'}: {new Date(currentSubscription.expiryDate).toLocaleDateString('es-ES')}
                                            </span>
                                        )}
                                        {currentSubscription.startDate && (
                                            <span className="ml-2 text-accent dark:text-muted">
                                                • Activo desde: {new Date(currentSubscription.startDate).toLocaleDateString('es-ES')}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {plansLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-foreground dark:text-background ml-4">Cargando planes disponibles...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {plans.map((plan) => {
                                    const IconComponent = plan.icon || FaStar;
                                    const isCurrentPlan = currentSubscription?.plan === (plan.plan_id || plan.id);
                                    const isSelected = selectedPlan === (plan.plan_id || plan.id);
                                    const planId = plan.plan_id || plan.id;
                                    
                                    return (
                                        <div
                                            key={planId}
                                            className={`relative rounded-2xl border-2 transition-all duration-300 ${
                                                plan.popular
                                                    ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                                                    : isCurrentPlan
                                                    ? 'border-success shadow-lg'
                                                    : 'border-border dark:border-muted hover:border-primary/50'
                                            } ${isSelected ? 'ring-4 ring-primary/30' : ''}`}
                                        >
                                            {plan.popular && (
                                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                    <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        MÁS POPULAR
                                                    </div>
                                                </div>
                                            )}

                                            {isCurrentPlan && (
                                                <div className="absolute -top-3 right-4">
                                                    <div className="bg-success text-black px-3 py-1 rounded-full text-xs font-bold">
                                                        ACTUAL
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6">
                                                
                                                <div className="text-center mb-6">
                                                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} mb-4`}>
                                                        <IconComponent className="text-2xl text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-foreground dark:text-background mb-2">
                                                        {plan.name}
                                                    </h3>
                                                    <p className="text-sm text-accent dark:text-muted mb-4 capitalize">
                                                        {plan.category}
                                                    </p>
                                                    <div className="mb-4">
                                                        <span className="text-3xl font-bold text-foreground dark:text-background">
                                                            ${plan.price}
                                                        </span>
                                                        <span className="text-accent dark:text-muted ml-1">
                                                            {plan.duration === 'forever' ? '/siempre' : 
                                                                plan.duration === 'monthly' ? '/mes' :
                                                                plan.duration === 'yearly' ? '/año' :
                                                                plan.duration === 'weekly' ? '/semana' : ''}
                                                        </span>
                                                        {plan.discountPercentage > 0 && (
                                                            <div className="text-xs text-success font-medium mt-1">
                                                                {plan.discountPercentage}% descuento en extras
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-6">
                                                    
                                                    <div className="flex items-start space-x-3">
                                                        <FaCheck className="text-success mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-foreground dark:text-background font-medium">
                                                            {getWalksText(plan.maxWalks)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-start space-x-3">
                                                        <FaCheck className="text-success mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-foreground dark:text-background">
                                                            {getSupportText(plan.supportLevel)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-start space-x-3">
                                                        <FaCheck className="text-success mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-foreground dark:text-background">
                                                            {getCancellationText(plan.cancellationPolicy)}
                                                        </span>
                                                    </div>

                                                    {plan.features?.map((feature, index) => (
                                                        <div key={index} className="flex items-start space-x-3">
                                                            <FaCheck className="text-success mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-foreground dark:text-background">
                                                                {feature}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {plan.description && (
                                                    <div className="mb-6 p-3 bg-muted/20 rounded-lg">
                                                        <p className="text-xs text-accent dark:text-muted">
                                                            {plan.description}
                                                        </p>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => handlePlanSelect(planId)}
                                                    disabled={loading || isCurrentPlan}
                                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                                        isCurrentPlan
                                                            ? 'bg-success/20 text-success cursor-not-allowed'
                                                            : isSelected
                                                            ? 'bg-primary text-white'
                                                            : plan.popular
                                                            ? 'bg-primary text-white hover:bg-primary/90'
                                                            : 'bg-background dark:bg-foreground border border-primary text-primary hover:bg-primary hover:text-white'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {isSelected ? (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            <span>Procesando...</span>
                                                        </div>
                                                    ) : isCurrentPlan ? (
                                                        'Plan Actual'
                                                    ) : planId === 'free' ? (
                                                        'Cambiar a Gratuito'
                                                    ) : (
                                                        `Suscribirse a ${plan.name}`
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;