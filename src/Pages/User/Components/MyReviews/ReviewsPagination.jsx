import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ReviewsPagination = ({ pagination, onPageChange, totalItems, currentItems, currentPage }) => {
    const { totalPages, hasNext, hasPrev } = pagination;

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); 
                i <= Math.min(totalPages - 1, currentPage + delta); 
                i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-8 mb-6">
            
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrev}
                className={`
                    flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${hasPrev 
                        ? 'text-primary hover:bg-primary hover:text-white border border-primary' 
                        : 'text-accent dark:text-muted cursor-not-allowed border border-accent/30 dark:border-muted/30'
                    }
                `}
            >
                <FiChevronLeft className="w-4 h-4 mr-1" />
                Anterior
            </button>

            <div className="flex space-x-1">
                {getPageNumbers().map((pageNum, index) => (
                    <button
                        key={index}
                        onClick={() => pageNum !== '...' && onPageChange(pageNum)}
                        disabled={pageNum === '...'}
                        className={`
                            px-4 py-2 rounded-lg font-medium transition-all duration-200
                            ${pageNum === currentPage
                                ? 'bg-primary text-white'
                                : pageNum === '...'
                                ? 'text-accent dark:text-muted cursor-default'
                                : 'text-foreground dark:text-background hover:bg-primary/10 border border-primary/30'
                            }
                        `}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className={`
                    flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${hasNext 
                        ? 'text-primary hover:bg-primary hover:text-white border border-primary' 
                        : 'text-accent dark:text-muted cursor-not-allowed border border-primary/30 dark:border-muted/30'
                    }
                `}
            >
                Siguiente
                <FiChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
};

export default ReviewsPagination;