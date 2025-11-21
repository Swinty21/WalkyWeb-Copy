import { FiCheckCircle, FiX } from "react-icons/fi";

const FinishWalkModal = ({ isOpen, onClose, onConfirm, walkData, isLoading }) => {
    if (!isOpen || !walkData) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-foreground rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <FiX size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <FiCheckCircle className="text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-foreground dark:text-background mb-2">
                        Finalizar Paseo
                    </h2>
                    <p className="text-accent dark:text-muted mb-6">
                        ¿Estás seguro de que querés marcar el paseo de{" "}
                        <span className="font-semibold">{walkData.dogName}</span> 
                        como finalizado?
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Finalizando..." : "Finalizar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinishWalkModal;
