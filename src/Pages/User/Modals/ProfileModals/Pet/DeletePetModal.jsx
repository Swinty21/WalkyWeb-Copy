import { FiX, FiAlertTriangle } from "react-icons/fi";

const DeletePetModal = ({ isOpen, onClose, petData, onConfirm }) => {
    if (!isOpen || !petData) return null;

    const handleConfirm = () => {
        onConfirm(petData.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-lg shadow-xl w-full max-w-md">

                <div className="flex items-center justify-between p-6 border-b border-border dark:border-muted">
                    <h2 className="text-xl font-heading text-foreground dark:text-background flex items-center">
                        <FiAlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        Eliminar Mascota
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted/30 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-foreground dark:text-background" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">

                        <div className="relative">
                            <img
                                src={petData.image}
                                alt={petData.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-red-200"
                            />
                            <div className="absolute inset-0 bg-red-500/20 rounded-full"></div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground dark:text-background">
                                {petData.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-accent dark:text-muted">
                                {petData.age && (
                                    <div>
                                        <span className="font-medium">Edad:</span> {petData.age} años
                                    </div>
                                )}
                                {petData.weight && (
                                    <div>
                                        <span className="font-medium">Peso:</span> {petData.weight} kg
                                    </div>
                                )}
                            </div>
                            {petData.description && (
                                <p className="text-sm text-accent dark:text-muted bg-muted/20 p-3 rounded-lg">
                                    {petData.description}
                                </p>
                            )}
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 w-full">
                            <p className="text-black text-sm font-medium">
                                ⚠️ Esta acción no se puede deshacer
                            </p>
                            <p className="text-red-500 dark:text-red text-sm mt-1">
                                ¿Estás seguro de que quieres eliminar a <strong className="text-black">{petData.name}</strong>? 
                                Se perderán todos los datos asociados a esta mascota.
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-border dark:border-muted text-foreground dark:text-background rounded-lg hover:bg-muted/30 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Sí, Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeletePetModal;