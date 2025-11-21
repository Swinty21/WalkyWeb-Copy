import { useState } from "react";
import { FiX, FiStar } from "react-icons/fi";

const ReviewModal = ({ isOpen, onClose, onSubmit, tripData, isLoading }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError("Por favor selecciona una calificación");
            return;
        }
        
        if (!content.trim()) {
            setError("Por favor escribe tu reseña");
            return;
        }

        setError("");
        await onSubmit({ id: tripData?.id, walkerId: tripData?.walker.id, rating, content });
    };

    const handleClose = () => {
        setRating(0);
        setHoveredRating(0);
        setContent("");
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-foreground/90 backdrop-blur-sm shadow-xl border border-primary/10 max-w-lg w-full mx-4">
                
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                                Dejar Reseña
                            </h3>
                            <p className="text-sm text-accent dark:text-muted">
                                Califica tu experiencia con {tripData?.walker.name}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-foreground dark:text-background mb-3">
                                Calificación
                            </label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-all duration-200 hover:scale-110"
                                    >
                                        <FiStar
                                            size={40}
                                            className={`${
                                                star <= (hoveredRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            } transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-center text-sm text-accent dark:text-muted mt-2">
                                    {rating === 1 && "Muy malo"}
                                    {rating === 2 && "Malo"}
                                    {rating === 3 && "Regular"}
                                    {rating === 4 && "Bueno"}
                                    {rating === 5 && "Excelente"}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground dark:text-background mb-2">
                                Tu Reseña
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Cuéntanos sobre tu experiencia con el paseador..."
                                className="w-full p-4 border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white dark:bg-foreground text-foreground dark:text-background resize-none transition-all duration-300"
                                rows="5"
                                disabled={isLoading}
                            />
                            <p className="text-xs text-accent dark:text-muted mt-1">
                                {content.length} caracteres
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || rating === 0 || !content.trim()}
                                className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Enviando...
                                    </div>
                                ) : (
                                    "Enviar Reseña"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;