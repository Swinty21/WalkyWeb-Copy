import { useState, useEffect } from "react";
import { FiCheck, FiCreditCard, FiDollarSign, FiGift } from "react-icons/fi";
import { FaCrown, FaCheckCircle } from "react-icons/fa";
import { format } from "date-fns";

const SubscriptionPaymentProcessModal = ({ isOpen, onClose, planData, paymentInfo }) => {
    const [paymentStatus, setPaymentStatus] = useState('processing');
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (isOpen && paymentStatus === 'processing') {
            const steps = [
                { delay: 3000, step: 1 },
                { delay: 6000, step: 2 },
                { delay: 9000, step: 3 },
                { delay: 12000, status: 'success' }
            ];

            const timers = steps.map(({ delay, step, status }) =>
                setTimeout(() => {
                    if (step) setCurrentStep(step);
                    if (status) setPaymentStatus(status);
                }, delay)
            );

            return () => timers.forEach(timer => clearTimeout(timer));
        }
    }, [isOpen, paymentStatus]);

    useEffect(() => {
        if (isOpen) {
            setPaymentStatus('processing');
            setCurrentStep(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const calculateExpiryDate = () => {
        const now = new Date();
        const expiry = new Date(now);
        expiry.setDate(expiry.getDate() + 30);
        return expiry;
    };

    const getProcessingContent = () => {
        switch (paymentInfo?.paymentType) {
            case 'free':
                return {
                    title: 'Procesando Cambio',
                    subtitle: 'Actualizando tu plan...',
                    steps: [
                        'Verificando información',
                        'Cancelando suscripción actual',
                        'Activando plan gratuito'
                    ]
                };
            case 'downgrade_active':
                return {
                    title: 'Procesando Cambio',
                    subtitle: 'Calculando crédito a favor...',
                    steps: [
                        'Verificando información',
                        'Calculando tiempo restante',
                        'Actualizando suscripción'
                    ]
                };
            case 'upgrade':
                return {
                    title: 'Procesando Pago',
                    subtitle: 'Conectando con MercadoPago...',
                    steps: [
                        'Verificando información',
                        'Procesando transacción',
                        'Activando mejora'
                    ]
                };
            default:
                return {
                    title: 'Procesando Pago',
                    subtitle: 'Conectando con MercadoPago...',
                    steps: [
                        'Verificando información',
                        'Procesando transacción',
                        'Activando suscripción'
                    ]
                };
        }
    };

    const getSuccessContent = () => {
        const basePrice = paymentInfo?.originalPrice || 0;
        const discountPercentage = paymentInfo?.discountPercentage || 0;
        const discountAmount = paymentInfo?.discountAmount || 0;
        const hasDiscount = discountPercentage > 0;
        const amountPaid = paymentInfo?.amountToPay || 0;

        switch (paymentInfo?.paymentType) {
            case 'free':
                return {
                    icon: <FaCheckCircle className="text-5xl text-white" />,
                    iconBg: 'from-green-400 to-green-600',
                    title: '¡Cambio Exitoso!',
                    subtitle: 'Has cambiado al plan gratuito',
                    showPayment: false,
                    message: 'Tu suscripción premium ha sido cancelada y ahora tienes acceso al plan gratuito.'
                };

            case 'downgrade_active':
                return {
                    icon: <FiGift className="text-5xl text-white" />,
                    iconBg: 'from-purple-400 to-purple-600',
                    title: '¡Cambio Exitoso!',
                    subtitle: 'Plan actualizado con crédito a favor',
                    showPayment: true,
                    paymentDetails: {
                        showOriginal: false,
                        showDiscount: false,
                        showCredit: true,
                        creditAmount: paymentInfo?.creditAmount || 0,
                        amountPaid: 0,
                        method: 'Crédito a favor'
                    },
                    message: `Has cambiado a un plan más económico. El tiempo restante de tu plan actual se mantendrá hasta que expire, y luego se activará el nuevo plan. Tienes un crédito de $${(paymentInfo?.creditAmount || 0).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} que se aplicará en tu próxima renovación.`
                };

            case 'downgrade_expired':
                return {
                    icon: <FiCheck className="text-5xl text-white" />,
                    iconBg: 'from-blue-400 to-blue-600',
                    title: '¡Suscripción Activada!',
                    subtitle: 'Tu nuevo plan está activo',
                    showPayment: true,
                    paymentDetails: {
                        showOriginal: hasDiscount,
                        showDiscount: hasDiscount,
                        showCredit: false,
                        originalPrice: basePrice,
                        discountPercentage,
                        discountAmount,
                        amountPaid,
                        method: 'MercadoPago'
                    },
                    message: hasDiscount 
                        ? `¡Ahorraste $${discountAmount.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} con tu descuento del ${discountPercentage}%!`
                        : 'Tu nueva suscripción está activa y lista para usar.'
                };

            case 'upgrade':
                return {
                    icon: <FiCheck className="text-5xl text-white" />,
                    iconBg: 'from-blue-400 to-blue-600',
                    title: '¡Upgrade Exitoso!',
                    subtitle: 'Has mejorado tu plan',
                    showPayment: true,
                    paymentDetails: {
                        showOriginal: false,
                        showDiscount: false,
                        showCredit: false,
                        amountPaid,
                        method: 'MercadoPago'
                    },
                    message: `Has pagado la diferencia de $${amountPaid.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} para mejorar tu plan. Ya tienes acceso a todas las nuevas funciones.`
                };

            case 'renewal':
                return {
                    icon: <FiCheck className="text-5xl text-white" />,
                    iconBg: 'from-orange-400 to-orange-600',
                    title: '¡Renovación Exitosa!',
                    subtitle: 'Tu plan ha sido renovado',
                    showPayment: true,
                    paymentDetails: {
                        showOriginal: hasDiscount,
                        showDiscount: hasDiscount,
                        showCredit: false,
                        originalPrice: basePrice,
                        discountPercentage,
                        discountAmount,
                        amountPaid,
                        method: 'MercadoPago'
                    },
                    message: hasDiscount 
                        ? `¡Ahorraste $${discountAmount.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} con tu descuento del ${discountPercentage}%!`
                        : 'Tu suscripción ha sido renovada exitosamente.'
                };

            default:
                return {
                    icon: <FiCheck className="text-5xl text-white" />,
                    iconBg: 'from-green-400 to-green-600',
                    title: '¡Pago Exitoso!',
                    subtitle: 'Tu suscripción ha sido activada',
                    showPayment: true,
                    paymentDetails: {
                        showOriginal: hasDiscount,
                        showDiscount: hasDiscount,
                        showCredit: false,
                        originalPrice: basePrice,
                        discountPercentage,
                        discountAmount,
                        amountPaid,
                        method: 'MercadoPago'
                    },
                    message: hasDiscount 
                        ? `¡Ahorraste $${discountAmount.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} con tu descuento del ${discountPercentage}%!`
                        : 'Ya tienes acceso a todas las funciones premium.'
                };
        }
    };

    const processingContent = getProcessingContent();
    const successContent = getSuccessContent();

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-background dark:bg-foreground rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {paymentStatus === 'processing' ? (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 mb-6 relative">
                                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                                <FiCreditCard className="text-5xl text-white relative z-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground dark:text-background mb-3">
                                {processingContent.title}
                            </h2>
                            <p className="text-accent dark:text-muted text-lg">
                                {processingContent.subtitle}
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {processingContent.steps.map((step, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    {currentStep >= index + 1 ? (
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <FiCheck className="text-white text-sm" />
                                        </div>
                                    ) : currentStep === index ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                                    )}
                                    <span className={`transition-colors duration-300 ${
                                        currentStep >= index + 1 
                                            ? 'text-green-600 dark:text-green-400 font-semibold' 
                                            : currentStep === index 
                                            ? 'text-foreground dark:text-background' 
                                            : 'text-gray-400 dark:text-gray-600'
                                    }`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                                Por favor, no cierres esta ventana
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className={`inline-flex p-6 rounded-full bg-gradient-to-r ${successContent.iconBg} mb-6 animate-bounce-slow`}>
                                {successContent.icon}
                            </div>
                            <h2 className="text-3xl font-bold text-foreground dark:text-background mb-3">
                                {successContent.title}
                            </h2>
                            <p className="text-accent dark:text-muted text-lg">
                                {successContent.subtitle}
                            </p>
                        </div>

                        {successContent.showPayment && (
                            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-6 border border-green-200 dark:border-green-800">
                                <h3 className="font-semibold text-foreground dark:text-background mb-4 flex items-center gap-2">
                                    <FiDollarSign className="text-green-600" />
                                    Detalles de la Transacción
                                </h3>
                                
                                <div className="space-y-3">
                                    {successContent.paymentDetails.showOriginal && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-accent dark:text-muted">Precio Original:</span>
                                            <span className="font-semibold text-foreground dark:text-background line-through">
                                                ${successContent.paymentDetails.originalPrice.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    )}

                                    {successContent.paymentDetails.showDiscount && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-accent dark:text-muted">
                                                Descuento ({successContent.paymentDetails.discountPercentage}%):
                                            </span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                -${successContent.paymentDetails.discountAmount.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    )}

                                    {successContent.paymentDetails.showCredit && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-accent dark:text-muted">Crédito a Favor:</span>
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                ${successContent.paymentDetails.creditAmount.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-3 border-t border-green-200 dark:border-green-800">
                                        <span className="text-sm text-accent dark:text-muted font-semibold">
                                            {successContent.paymentDetails.amountPaid === 0 ? 'Monto:' : 'Total Pagado:'}
                                        </span>
                                        <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                            ${successContent.paymentDetails.amountPaid.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-accent dark:text-muted">Fecha:</span>
                                        <span className="font-semibold text-foreground dark:text-background">
                                            {format(new Date(), "dd MMM yyyy, HH:mm")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-accent dark:text-muted">Método:</span>
                                        <span className="font-semibold text-foreground dark:text-background">
                                            {successContent.paymentDetails.method}
                                        </span>
                                    </div>

                                    {planData && (
                                        <>
                                            <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-accent dark:text-muted flex items-center gap-2">
                                                        <FaCrown className="text-primary" />
                                                        Plan:
                                                    </span>
                                                    <span className="font-semibold text-foreground dark:text-background">
                                                        {planData.name}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-accent dark:text-muted">Fecha de Inicio:</span>
                                                    <span className="font-semibold text-foreground dark:text-background">
                                                        {format(new Date(), "dd MMM yyyy")}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-accent dark:text-muted">Vence el:</span>
                                                    <span className="font-semibold text-foreground dark:text-background">
                                                        {format(calculateExpiryDate(), "dd MMM yyyy")}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {successContent.message && (
                            <div className={`border rounded-xl p-4 mb-6 ${
                                paymentInfo?.paymentType === 'free' 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : paymentInfo?.paymentType === 'downgrade_active'
                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                                    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            }`}>
                                <p className={`text-sm text-center font-semibold ${
                                    paymentInfo?.paymentType === 'free'
                                        ? 'text-green-800 dark:text-green-200'
                                        : paymentInfo?.paymentType === 'downgrade_active'
                                        ? 'text-purple-800 dark:text-purple-200'
                                        : 'text-green-800 dark:text-green-200'
                                }`}>
                                    {successContent.message}
                                </p>
                            </div>
                        )}

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold text-foreground dark:text-background mb-2 flex items-center gap-2">
                                <FiCheck className="text-blue-600" />
                                ¿Qué sigue?
                            </h4>
                            <ul className="space-y-1.5 text-sm text-accent dark:text-muted">
                                {paymentInfo?.paymentType === 'free' ? (
                                    <>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Ahora tienes acceso al plan gratuito</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Puedes volver a suscribirte cuando quieras</span>
                                        </li>
                                    </>
                                ) : paymentInfo?.paymentType === 'downgrade_active' ? (
                                    <>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Tu plan actual sigue activo hasta que expire</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>El nuevo plan se activará automáticamente al vencer el actual</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Tu crédito se aplicará en la próxima renovación</span>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Ya tienes acceso a todas las funciones premium</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Recibirás un email de confirmación con los detalles</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Puedes ver tu suscripción en Configuración</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 px-6 bg-gradient-to-r from-primary to-success text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                        >
                            Entendido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPaymentProcessModal;