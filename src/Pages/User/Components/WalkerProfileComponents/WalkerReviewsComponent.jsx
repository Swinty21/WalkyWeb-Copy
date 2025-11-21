import { AiOutlineStar } from "react-icons/ai";

const WalkerReviewsComponent = ({ 
    reviewsData, 
    loadingReviews, 
    reviewsError, 
    searchTerm, 
    currentPage,
    onSearchChange, 
    onPageChange 
}) => {
    const buttonBase = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm";
    const buttonInactive = "bg-background dark:bg-foreground border border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md";

    const uniqueReviews = reviewsData.reviews.reduce((acc, review) => {
        if (!acc.find(r => r.id === review.id)) {
            acc.push(review);
        }
        return acc;
    }, []);
    
    return (
        <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-foreground dark:text-background">
                    Reseñas de Clientes
                </h2>
                
                <div className="w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar reseñas..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {loadingReviews ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-accent dark:text-muted">Cargando reseñas...</p>
                </div>
            ) : reviewsError ? (
                <div className="text-center py-8">
                    <p className="text-red-500">{reviewsError}</p>
                </div>
            ) : uniqueReviews.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-accent dark:text-muted">
                        {searchTerm ? "No se encontraron reseñas con ese término de búsqueda." : "No hay reseñas disponibles."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    
                    {uniqueReviews.map((review) => (
                        <div
                            key={review.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start space-x-4">
                                <img
                                    src={review.ownerImage}
                                    alt={review.ownerName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-semibold text-foreground dark:text-background">
                                                {review.ownerName}
                                            </h4>
                                            <span className="text-sm text-accent dark:text-muted">
                                                con {review.petName}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <AiOutlineStar
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating
                                                                ? "text-yellow-400 fill-current"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-accent dark:text-muted">
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-foreground dark:text-background leading-relaxed">
                                        {review.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {reviewsData.pagination && reviewsData.pagination.totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!reviewsData.pagination.hasPrev}
                        className={`${buttonBase} ${
                            reviewsData.pagination.hasPrev 
                                ? buttonInactive 
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Anterior
                    </button>
                    
                    <span className="flex items-center px-4 py-2 text-foreground dark:text-background">
                        Página {reviewsData.pagination.currentPage} de {reviewsData.pagination.totalPages}
                    </span>
                    
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!reviewsData.pagination.hasNext}
                        className={`${buttonBase} ${
                            reviewsData.pagination.hasNext 
                                ? buttonInactive 
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalkerReviewsComponent;