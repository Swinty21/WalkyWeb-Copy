import { FiMessageSquare, FiAlertCircle, FiRefreshCw, FiSearch } from "react-icons/fi";

export const LoadingState = () => {
    return (
        <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                
                <div className="bg-background dark:bg-foreground rounded-2xl shadow-lg border border-primary/20 p-6 animate-pulse">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-8 bg-primary/20 rounded w-32"></div>
                            <div className="h-6 bg-accent/20 dark:bg-muted/20 rounded w-24"></div>
                        </div>
                        <div className="h-12 bg-primary/20 rounded-lg"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-background dark:bg-foreground rounded-xl shadow-md border border-primary/20 p-6 animate-pulse">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className="w-14 h-14 bg-primary/20 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-primary/20 rounded mb-2 w-1/3"></div>
                                            <div className="h-4 bg-accent/20 dark:bg-muted/20 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-accent/20 dark:bg-muted/20 rounded"></div>
                                </div>
                                
                                <div className="bg-primary/10 rounded-lg p-4">
                                    <div className="h-4 bg-primary/20 rounded w-1/4"></div>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-4 bg-accent/20 dark:bg-muted/20 rounded"></div>
                                    <div className="h-4 bg-accent/20 dark:bg-muted/20 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center py-4">
                    <div className="inline-flex items-center space-x-2 text-primary">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando reseñas...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ErrorState = ({ error, onRetry }) => {
    return (
        <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center space-y-4">
                        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <p className="text-lg text-red-500">{error}</p>
                        <button 
                            onClick={onRetry}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const EmptyState = ({ searchTerm }) => {
    return (
        <div className="text-center py-16">
            <div className="relative mx-auto mb-6">
                <div className="p-6 bg-primary/10 rounded-full inline-block">
                    <FiMessageSquare className="w-16 h-16 text-primary" />
                </div>
                {searchTerm && (
                    <div className="absolute -top-2 -right-2 p-2 bg-accent/20 dark:bg-muted/20 rounded-full">
                        <FiSearch className="w-4 h-4 text-accent dark:text-muted" />
                    </div>
                )}
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
                <h3 className="text-xl font-bold text-foreground dark:text-background">
                    {searchTerm ? "No se encontraron reseñas" : "No tienes reseñas aún"}
                </h3>
                <p className="text-accent dark:text-muted leading-relaxed">
                    {searchTerm 
                        ? `No encontramos reseñas que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                        : "Tus reseñas aparecerán aquí después de completar paseos con paseadores. ¡Reserva tu primer paseo para comenzar!"
                    }
                </p>

                {searchTerm && (
                    <div className="pt-4 mt-6 border-t border-primary/20">
                        <p className="text-sm font-medium text-accent dark:text-muted mb-2">
                            Sugerencias:
                        </p>
                        <ul className="text-sm text-accent dark:text-muted space-y-1">
                            <li>• Verifica la ortografía</li>
                            <li>• Usa términos más generales</li>
                            <li>• Prueba con el nombre de la mascota o paseador</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};