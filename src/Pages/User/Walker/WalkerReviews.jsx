import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../../BackEnd/Context/UserContext";
import { ReviewsController } from "../../../BackEnd/Controllers/ReviewsController";
import WalkerReviewsHeader from "../Components/WalkerReviewsComponents/WalkerReviewsHeader";
import WalkerReviewsList from "../Components/WalkerReviewsComponents/WalkerReviewsList";
import WalkerReviewsPagination from "../Components/WalkerReviewsComponents/WalkerReviewsPagination";
import { LoadingState, EmptyState, ErrorState } from "../Components/WalkerReviewsComponents/WalkerStatusComponent";

const WalkerReviews = () => {
    const [reviewsData, setReviewsData] = useState({ reviews: [], pagination: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const user = useUser();

    const loadReviews = useCallback(async (page = 1, search = "") => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!user?.id) {
                setError("No se pudo obtener la información del usuario");
                return;
            }

            const data = await ReviewsController.fetchReviewsByWalker(user.id, page, 6, search);
            
            const uniqueReviews = Array.from(
                new Map(data.reviews.map(review => [review.id, review])).values()
            );
            
            setReviewsData({
                reviews: uniqueReviews,
                pagination: data.pagination
            });
        } catch (err) {
            console.error("Error loading reviews:", err);
            setError("Error al cargar las reseñas. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadReviews(currentPage, searchTerm);
    }, [loadReviews, currentPage, searchTerm]);

    const handleSearch = (search) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateAverageRating = () => {
        if (!reviewsData.reviews || reviewsData.reviews.length === 0) return 0;
        const sum = reviewsData.reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviewsData.reviews.length).toFixed(1);
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
                
                <WalkerReviewsHeader 
                    totalReviews={pagination.totalItems || 0}
                    averageRating={calculateAverageRating()}
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
                        <WalkerReviewsList reviews={reviews} />

                        {pagination.totalPages > 1 && (
                            <WalkerReviewsPagination 
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
            </div>
        </div>
    );
};

export default WalkerReviews;