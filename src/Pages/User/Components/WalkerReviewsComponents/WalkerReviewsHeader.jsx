import { FiSearch, FiStar, FiX, FiAward } from "react-icons/fi";

const WalkerReviewsHeader = ({ totalReviews, averageRating, searchTerm, onSearch }) => {
    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    const clearSearch = () => {
        onSearch("");
    };

    const getRatingColor = () => {
        if (averageRating >= 4) return 'text-green-500';
        if (averageRating >= 3) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getRatingText = () => {
        if (averageRating >= 4.5) return 'Excelente';
        if (averageRating >= 4) return 'Muy bueno';
        if (averageRating >= 3) return 'Bueno';
        if (averageRating >= 2) return 'Regular';
        return 'Necesita mejorar';
    };

    return (
        <div className="bg-background dark:bg-foreground rounded-2xl shadow-lg border border-primary/20 p-6">
            <div className="flex flex-col space-y-6">
                
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground dark:text-background">
                        Mis Reseñas Recibidas
                    </h2>
                    {totalReviews !== undefined && (
                        <span className="text-accent dark:text-muted">
                            {totalReviews === 0 
                                ? "No tienes reseñas aún" 
                                : totalReviews === 1 
                                    ? "1 reseña" 
                                    : `${totalReviews} reseñas`
                            }
                        </span>
                    )}
                </div>

                {totalReviews > 0 && (
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                            
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FiStar className={`w-6 h-6 fill-current ${getRatingColor()}`} />
                                    <span className={`text-2xl font-bold ${getRatingColor()}`}>
                                        {averageRating}
                                    </span>
                                    <span className="text-foreground/70 dark:text-background/70">
                                        / 5.0
                                    </span>
                                </div>
                                
                                <div className="h-8 w-px bg-primary/30"></div>
                                
                                <div className="flex items-center space-x-2">
                                    <FiAward className="w-5 h-5 text-primary" />
                                    <span className="font-semibold text-foreground dark:text-background">
                                        {getRatingText()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar 
                                        key={star}
                                        className={`w-5 h-5 ${
                                            star <= Math.round(averageRating) 
                                                ? "text-yellow-400 fill-current" 
                                                : "text-accent/30 dark:text-muted/30"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-accent dark:text-muted" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar por cliente, mascota o contenido..."
                        className="w-full pl-12 pr-12 py-3 rounded-lg border border-primary/30 bg-background dark:bg-foreground text-foreground dark:text-background placeholder-accent dark:placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            <FiX className="h-5 w-5 text-accent dark:text-muted hover:text-foreground dark:hover:text-background transition-colors duration-200" />
                        </button>
                    )}
                </div>

                {searchTerm && (
                    <div className="flex justify-end">
                        <button
                            onClick={clearSearch}
                            className="px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalkerReviewsHeader;