import { useState } from "react";
import { FiStar, FiSearch, FiEdit3, FiChevronLeft, FiChevronRight, FiMessageSquare } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditReviewModal from "../../Modals/ProfileModals/Review/EditReviewModal";

const ReviewsComponent = ({ 
    reviewsData, 
    onEditReview, 
    onPageChange, 
    onSearch,
    isLoading, 
    error 
}) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleEditReview = (reviewId, reviewData) => {
        onEditReview(reviewId, reviewData);
        setShowEditModal(false);
        setSelectedReview(null);
    };

    const openEditModal = (review) => {
        setSelectedReview(review);
        setShowEditModal(true);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar 
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                ))}
                <span className="ml-1 text-sm text-accent dark:text-muted">
                    ({rating}/5)
                </span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground dark:text-background">
                        Mis Reseñas
                    </h3>
                    <div className="w-64 h-10 bg-muted/20 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-muted/10 rounded-lg p-4 animate-pulse">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-muted/40 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-muted/40 rounded mb-2 w-1/3"></div>
                                    <div className="h-3 bg-muted/30 rounded w-1/4"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-muted/30 rounded"></div>
                                <div className="h-3 bg-muted/30 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground dark:text-background">
                        Mis Reseñas
                    </h3>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    const { reviews = [], pagination = {} } = reviewsData || {};

    return (
        <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-foreground dark:text-background">
                    Mis Reseñas ({pagination.totalItems || 0})
                </h3>
                
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent dark:text-muted w-4 h-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar por paseador o contenido..."
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-border dark:border-muted rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-muted/10 border-2 border-dashed border-muted/40 rounded-lg p-8 text-center">
                    <FiMessageSquare className="w-12 h-12 text-muted mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-foreground dark:text-background mb-2">
                        {searchTerm ? "No se encontraron reseñas" : "No tienes reseñas aún"}
                    </h4>
                    <p className="text-accent dark:text-muted">
                        {searchTerm 
                            ? "Intenta con otros términos de búsqueda" 
                            : "Tus reseñas aparecerán aquí después de completar paseos"
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-primary/20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between">
                                
                                <div className="flex items-center space-x-4 flex-1">
                                    <img
                                        src={review.walkerImage}
                                        alt={review.walkerName}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-lg font-semibold text-foreground dark:text-background">
                                                {review.walkerName}
                                            </h4>
                                            <button
                                                onClick={() => openEditModal(review)}
                                                className="p-2 text-accent dark:text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Editar reseña"
                                            >
                                                <FiEdit3 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-accent dark:text-muted mb-2">
                                            Paseo con {review.petName} • {format(new Date(review.date), "d 'de' MMMM, yyyy", { locale: es })}
                                        </p>
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pl-20">
                                <p className="text-foreground dark:text-background leading-relaxed">
                                    {review.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border dark:border-muted">
                    <div className="text-sm text-accent dark:text-muted">
                        Mostrando {reviews.length} de {pagination.totalItems} reseñas
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrev}
                            className={`px-3 py-2 rounded-lg border transition-colors ${
                                pagination.hasPrev
                                    ? "border-primary text-primary hover:bg-primary hover:text-white"
                                    : "border-border dark:border-muted text-muted cursor-not-allowed"
                            }`}
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                        page === pagination.currentPage
                                            ? "bg-primary text-white"
                                            : "text-foreground dark:text-background hover:bg-primary/10"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasNext}
                            className={`px-3 py-2 rounded-lg border transition-colors ${
                                pagination.hasNext
                                    ? "border-primary text-primary hover:bg-primary hover:text-white"
                                    : "border-border dark:border-muted text-muted cursor-not-allowed"
                            }`}
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <EditReviewModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedReview(null);
                }}
                reviewData={selectedReview}
                onSave={handleEditReview}
            />
        </div>
    );
};

export default ReviewsComponent;