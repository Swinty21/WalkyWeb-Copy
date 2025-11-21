import { useState, useEffect, useCallback } from "react";
import { NotificationController } from '../../../BackEnd/Controllers/NotificationController';
import { useUser } from '../../../BackEnd/Context/UserContext';
import { useToast } from '../../../BackEnd/Context/ToastContext';
import NotificationFilter from '../Components/Notifications/NotificationFilter';
import NotificationCard from '../Components/Notifications/NotificationCard';
import { FiBell, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MyNotifications = () => {
    const [search, setSearch] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorState, seterrorState] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const {error, info } = useToast();

    const ITEMS_PER_PAGE = 10;
    const user = useUser();
    
    const loadNotifications = useCallback(async (page = 1, searchTerm = "") => {
        try {
            setLoading(true);
            seterrorState(null);
            
            if (!user?.id) {
                seterrorState('Usuario no autenticado');
                setLoading(false);
                return;
            }
            
            const response = await NotificationController.fetchNotifications(
                user.id,
                page, 
                ITEMS_PER_PAGE, 
                searchTerm
            );
            
            setNotifications(response.notifications);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
            setTotalCount(response.totalCount);
            setHasNextPage(response.hasNextPage);
            setHasPrevPage(response.hasPrevPage);
            
        } catch (err) {
            seterrorState('errorState loading notifications: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) { 
            loadNotifications(1, search);
            setCurrentPage(1);
        }
    }, [search, loadNotifications, user?.id]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            
            if (!user?.id) {
                return;
            }

            await NotificationController.markNotificationAsRead(notificationId, user.id);
            info('Notificación Leída', {
                title: 'Info',
                duration: 4000
            })
            setNotifications(prevNotifications => 
                prevNotifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (err) {
            error('Error al marcar como leída la notificacion', {
                title: 'Error',
                duration: 4000
            })
            seterrorState('errorState al marcar la notificación como leída: ' + err.message);
        }
    };

    const clearFilters = () => {
        setSearch("");
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            loadNotifications(newPage, search);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const PaginationControls = () => {
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`
                        flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${hasPrevPage 
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
                            onClick={() => pageNum !== '...' && handlePageChange(pageNum)}
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
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`
                        flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${hasNextPage 
                            ? 'text-primary hover:bg-primary hover:text-white border border-primary' 
                            : 'text-accent dark:text-muted cursor-not-allowed border border-accent/30 dark:border-muted/30'
                        }
                    `}
                >
                    Siguiente
                    <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        );
    };

    if (!user?.id) {
        return (
            <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center space-y-4">
                            <FiBell className="w-12 h-12 text-red-500 mx-auto" />
                            <p className="text-lg text-red-500">
                                Debes iniciar sesión para ver tus notificaciones
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading && notifications?.length === 0) {
        return (
            <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center space-y-4">
                            <FiBell className="w-12 h-12 text-primary mx-auto animate-pulse" />
                            <p className="text-lg text-foreground dark:text-background">
                                Cargando notificaciones...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (errorState) {
        return (
            <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center space-y-4">
                            <FiBell className="w-12 h-12 text-red-500 mx-auto" />
                            <p className="text-lg text-red-500">{errorState}</p>
                            <button 
                                onClick={() => loadNotifications(1, search)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                                disabled={!user?.id}
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
            <div className="mx-auto">
                
                <NotificationFilter
                    search={search}
                    setSearch={setSearch}
                    clearFilters={clearFilters}
                    totalCount={totalCount}
                />

                {loading && notifications?.length > 0 && (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center space-x-2 text-primary">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span>Cargando...</span>
                        </div>
                    </div>
                )}

                {notifications?.length === 0 && !loading ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔔</div>
                        <h3 className="text-xl font-bold text-foreground dark:text-background mb-2">
                            No se encontraron notificaciones
                        </h3>
                        <p className="text-accent dark:text-muted">
                            {search 
                                ? "Intenta ajustar tu búsqueda" 
                                : "No tienes notificaciones en este momento"
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                            {notifications?.map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                />
                            ))}
                        </div>

                        <PaginationControls />

                        {totalCount > 0 && (
                            <div className="text-center text-sm text-accent dark:text-muted">
                                Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount} notificaciones
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyNotifications;