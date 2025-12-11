import { FiLogOut, FiX, FiAlertCircle } from 'react-icons/fi';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-background dark:bg-foreground rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute top-4 right-4 text-accent dark:text-muted hover:text-foreground dark:hover:text-background transition-colors p-2 rounded-full hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiX className="text-xl" />
                    </button>

                    <div className="text-center mb-6">
                        <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-orange-400 to-red-600 mb-4">
                            <FiAlertCircle className="text-5xl text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground dark:text-background mb-2">
                            ¿Cerrar Sesión?
                        </h2>
                        <p className="text-accent dark:text-muted">
                            Estás a punto de cerrar tu sesión
                        </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <FiLogOut className="text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                                <p className="font-medium">
                                    Al cerrar sesión:
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li>• Tendrás que volver a iniciar sesión</li>
                                    <li>• Se cerrará tu sesión en este dispositivo</li>
                                    <li>• Tu información estará segura</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 bg-muted/30 text-foreground dark:text-background rounded-xl hover:bg-muted/50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Cerrando...</span>
                                </>
                            ) : (
                                <>
                                    <FiLogOut />
                                    <span>Cerrar Sesión</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;