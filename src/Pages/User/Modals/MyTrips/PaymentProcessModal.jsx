import { useState, useEffect } from "react";
import { FiCheck, FiCreditCard, FiUser, FiDollarSign } from "react-icons/fi";
import { format } from "date-fns";

const PaymentProcessModal = ({ isOpen, onClose, tripData, totalAmount }) => {
    const [paymentStatus, setPaymentStatus] = useState('processing');

    useEffect(() => {
        if (isOpen && paymentStatus === 'processing') {
            const timer = setTimeout(() => {
                setPaymentStatus('success');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, paymentStatus]);

    useEffect(() => {
        if (isOpen) {
            setPaymentStatus('processing');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {paymentStatus === 'processing' ? (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 mb-6 relative">
                                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                                <FiCreditCard className="text-5xl text-white relative z-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground dark:text-background mb-3">
                                Procesando Pago
                            </h2>
                            <p className="text-accent dark:text-muted text-lg">
                                Conectando con MercadoPago...
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                <span className="text-foreground dark:text-background">Verificando información</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                <span className="text-foreground dark:text-background">Procesando transacción</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                <span className="text-foreground dark:text-background">Confirmando pago</span>
                            </div>
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
                            <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-6 animate-bounce-slow">
                                <FiCheck className="text-5xl text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground dark:text-background mb-3">
                                ¡Pago Exitoso!
                            </h2>
                            <p className="text-accent dark:text-muted text-lg">
                                Tu paseo ha sido confirmado
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-6 border border-green-200 dark:border-green-800">
                            <h3 className="font-semibold text-foreground dark:text-background mb-4 flex items-center gap-2">
                                <FiDollarSign className="text-green-600" />
                                Detalles del Pago
                            </h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-accent dark:text-muted">Monto Pagado:</span>
                                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                        ${totalAmount?.toLocaleString()}
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
                                        MercadoPago
                                    </span>
                                </div>

                                {tripData && (
                                    <>
                                        <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-accent dark:text-muted">Mascota:</span>
                                                <span className="font-semibold text-foreground dark:text-background">
                                                    {tripData.dogName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-accent dark:text-muted">Paseador:</span>
                                                <span className="font-semibold text-foreground dark:text-background">
                                                    {tripData.walker}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-accent dark:text-muted">Fecha del Paseo:</span>
                                                <span className="font-semibold text-foreground dark:text-background">
                                                    {format(new Date(tripData.startTime), "dd MMM yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold text-foreground dark:text-background mb-2 flex items-center gap-2">
                                <FiCheck className="text-blue-600" />
                                ¿Qué sigue?
                            </h4>
                            <ul className="space-y-1.5 text-sm text-accent dark:text-muted">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Recibirás un email de confirmación</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>El paseador ha sido notificado</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Puedes ver los detalles en "Mis Paseos"</span>
                                </li>
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

export default PaymentProcessModal;