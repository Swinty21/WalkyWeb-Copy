import { useState, useEffect } from "react";
import { FiX, FiStar, FiFileText } from "react-icons/fi";

const EditReviewModal = ({ isOpen, onClose, reviewData, onSave }) => {
    const [formData, setFormData] = useState({
        rating: 5,
        content: ""
    });
    const [errors, setErrors] = useState({});
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        if (isOpen && reviewData) {
            setFormData({
                rating: reviewData.rating || 5,
                content: reviewData.content || ""
            });
            setErrors({});
            setHoveredRating(0);
        }
    }, [isOpen, reviewData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleRatingClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));
        
        if (errors.rating) {
            setErrors(prev => ({
                ...prev,
                rating: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
            newErrors.rating = "Debes seleccionar una calificación entre 1 y 5 estrellas";
        }

        if (!formData.content.trim()) {
            newErrors.content = "El contenido de la reseña es obligatorio";
        } else if (formData.content.trim().length < 10) {
            newErrors.content = "La reseña debe tener al menos 10 caracteres";
        } else if (formData.content.trim().length > 500) {
            newErrors.content = "La reseña no puede exceder 500 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const updatedReviewData = {
            rating: formData.rating,
            content: formData.content.trim()
        };

        onSave(reviewData.id, updatedReviewData);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            rating: 5,
            content: ""
        });
        setErrors({});
        setHoveredRating(0);
        onClose();
    };

    if (!isOpen || !reviewData) return null;

    const displayRating = hoveredRating || formData.rating;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between p-6 border-b border-border dark:border-muted">
                    <h2 className="text-xl font-heading text-foreground dark:text-background">
                        Editar Reseña
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-muted/30 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-foreground dark:text-background" />
                    </button>
                </div>

                <div className="px-6 pt-4">
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/20 rounded-lg">
                        <img
                            src={reviewData.walkerImage}
                            alt={reviewData.walkerName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-foreground dark:text-background">
                                {reviewData.walkerName}
                            </h3>
                            <p className="text-sm text-accent dark:text-muted">
                                Paseo con {reviewData.petName}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-3">
                            <FiStar className="inline mr-2" />
                            Calificación *
                        </label>
                        <div className="flex items-center space-x-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className={`text-2xl transition-colors duration-200 ${
                                        star <= displayRating
                                            ? "text-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    } hover:scale-110 transform`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-accent dark:text-muted">
                            {displayRating === 1 && "Muy malo"}
                            {displayRating === 2 && "Malo"}
                            {displayRating === 3 && "Regular"}
                            {displayRating === 4 && "Bueno"}
                            {displayRating === 5 && "Excelente"}
                        </p>
                        {errors.rating && (
                            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiFileText className="inline mr-2" />
                            Contenido de la Reseña *
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows="4"
                            maxLength="500"
                            className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                                errors.content ? 'border-red-500' : 'border-border dark:border-muted'
                            }`}
                            placeholder="Comparte tu experiencia con este paseador..."
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.content ? (
                                <p className="text-red-500 text-sm">{errors.content}</p>
                            ) : (
                                <p className="text-accent dark:text-muted text-sm">
                                    Mínimo 10 caracteres
                                </p>
                            )}
                            <p className="text-accent dark:text-muted text-sm">
                                {formData.content.length}/500
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-border dark:border-muted text-foreground dark:text-background rounded-lg hover:bg-muted/30 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReviewModal;