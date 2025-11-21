import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../../BackEnd/Context/UserContext";
import { useToast } from '../../../BackEnd/Context/ToastContext';
import { ReviewsController } from "../../../BackEnd/Controllers/ReviewsController";
import ReviewsHeader from "../Components/MyReviews/ReviewsHeader";
import ReviewsList from "../Components/MyReviews/ReviewsList";
import ReviewsPagination from "../Components/MyReviews/ReviewsPagination";
import EditReviewModal from "../Modals/ProfileModals/Review/EditReviewModal";
import { LoadingState, EmptyState, ErrorState } from "../Components/MyReviews/StatusComponent";

const MyReviews = () => {
    const [reviewsData, setReviewsData] = useState({ reviews: [], pagination: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { success, warning } = useToast();

    const user = useUser();

    const loadReviews = useCallback(async (page = 1, search = "") => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!user?.id) {
                setError("No se pudo obtener la información del usuario");
                return;
            }

            const data = await ReviewsController.fetchReviewsByUser(user.id, page, 6, search);
            
            const uniqueReviews = Array.from(
                new Map(data.reviews.map(review => [review.id, review])).values()
            );
            
            setReviewsData({
                reviews: uniqueReviews,
                pagination: data.pagination
            });
        } catch (err) {
            setError("Error al cargar las reseñas. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadReviews(currentPage, searchTerm);
    }, [loadReviews, currentPage, searchTerm, refreshTrigger]);

    const handleSearch = (search) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditReview = (review) => {
        setSelectedReview(review);
        setShowEditModal(true);
    };

    const handleSaveReview = async (reviewId, reviewData) => {
        try {
            await ReviewsController.updateReview(reviewId, reviewData);
            setShowEditModal(false);
            setSelectedReview(null);
            setRefreshTrigger(prev => prev + 1);

            success('Reseña actualizada correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (error) {
            warning('Error al actualizar la reseña', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedReview(null);
    };

    const { reviews = [], pagination = {} } = reviewsData || {};

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={() => loadReviews(currentPage, searchTerm)} />;
    }

    return (
        <div className="max-w min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
            <div className="mx-auto space-y-6">
                
                <ReviewsHeader 
                    totalReviews={pagination.totalItems || 0}
                    searchTerm={searchTerm}
                    onSearch={handleSearch}
                />

                {isLoading && reviews.length > 0 && (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center space-x-2 text-primary">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span>Cargando...</span>
                        </div>
                    </div>
                )}

                {reviews.length === 0 ? (
                    <EmptyState searchTerm={searchTerm} />
                ) : (
                    <>
                        <ReviewsList 
                            reviews={reviews}
                            onEditReview={handleEditReview}
                        />

                        {pagination.totalPages > 1 && (
                            <ReviewsPagination 
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                totalItems={pagination.totalItems}
                                currentItems={reviews.length}
                                currentPage={currentPage}
                            />
                        )}

                        {pagination.totalItems > 0 && (
                            <div className="text-center text-sm text-accent dark:text-muted">
                                Mostrando {Math.min((currentPage - 1) * 6 + 1, pagination.totalItems)} - {Math.min(currentPage * 6, pagination.totalItems)} de {pagination.totalItems} reseñas
                            </div>
                        )}
                    </>
                )}

                <EditReviewModal
                    isOpen={showEditModal}
                    onClose={handleCloseModal}
                    reviewData={selectedReview}
                    onSave={handleSaveReview}
                />
            </div>
        </div>
    );
};

export default MyReviews;