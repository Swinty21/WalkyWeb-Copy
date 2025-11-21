import { format } from "date-fns";
import { FiX, FiStar } from "react-icons/fi";

const ViewReviewModal = ({ isOpen, onClose, reviewData, tripData }) => {
    if (!isOpen) return null;

    const formatReviewDate = (date) => {
        if (!date) return 'Fecha no disponible';
        
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return 'Fecha no disponible';
        }
        
        return format(parsedDate, "dd 'de' MMMM, yyyy");
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        size={20}
                        className={`${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-foreground/90 backdrop-blur-sm shadow-xl border border-primary/10 max-w-lg w-full mx-4">
                
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <FiX size={16} />
                    </button>
                </div>

                <div className="relative p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                            <FiStar className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-foreground dark:text-background mb-1">
                                Tu Reseña
                            </h3>
                            <p className="text-sm text-accent dark:text-muted">
                                Paseo con {tripData?.walker}
                            </p>
                        </div>
                    </div>

                    {reviewData ? (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-foreground dark:text-background">
                                        Calificación
                                    </span>
                                    {renderStars(reviewData.rating)}
                                </div>
                                <p className="text-xs text-accent dark:text-muted">
                                    {formatReviewDate(reviewData.date)}
                                </p>
                            </div>

                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
                                <h4 className="text-sm font-semibold text-foreground dark:text-background mb-2">
                                    Tu comentario
                                </h4>
                                <p className="text-sm text-accent dark:text-muted leading-relaxed">
                                    {reviewData.content}
                                </p>
                            </div>

                            <div className="bg-primary/10 rounded-2xl p-4">
                                <p className="text-xs text-center text-accent dark:text-muted">
                                    Mascota: <span className="font-semibold">{reviewData.petName || tripData?.dogName}</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-accent dark:text-muted">
                                No se pudo cargar la reseña
                            </p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full mt-6 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-success text-white hover:from-primary/90 hover:to-success/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewReviewModal;