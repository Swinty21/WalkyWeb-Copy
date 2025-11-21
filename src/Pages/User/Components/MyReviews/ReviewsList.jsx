import { FiStar, FiEdit3, FiCalendar, FiUser } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ReviewsList = ({ reviews, onEditReview }) => {
    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar 
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating 
                                ? "text-yellow-400 fill-current" 
                                : "text-accent/30 dark:text-muted/30"
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium text-foreground dark:text-background">
                    {rating}/5
                </span>
            </div>
        );
    };

    const getRatingText = (rating) => {
        if (rating >= 4) return "Excelente";
        if (rating >= 3) return "Bueno";
        if (rating >= 2) return "Regular";
        return "Mejorable";
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
        if (rating >= 3) return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
        return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className={`
                        relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg border-l-4
                        ${getRatingColor(review.rating)}
                        border border-primary/20 bg-background dark:bg-foreground shadow-md
                    `}
                >
                    <div className="p-6">
                        <div className="space-y-4">
                            
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={review.walkerImage}
                                            alt={review.walkerName}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-foreground dark:text-background mb-1">
                                            {review.walkerName}
                                        </h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-accent dark:text-muted">
                                            <div className="flex items-center space-x-1">
                                                <FiUser className="w-4 h-4" />
                                                <span>Paseo con {review.petName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>{format(new Date(review.date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => onEditReview(review)}
                                    className="flex-shrink-0 p-2 text-accent dark:text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 group"
                                    title="Editar reseña"
                                >
                                    <FiEdit3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                                {renderStars(review.rating)}
                                <span className="text-sm font-medium text-foreground dark:text-background">
                                    {getRatingText(review.rating)}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-foreground/90 dark:text-background/90 leading-relaxed">
                                    {review.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewsList;