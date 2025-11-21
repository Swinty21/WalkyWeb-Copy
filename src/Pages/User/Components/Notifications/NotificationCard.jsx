import { useState } from "react";
import { FiBell, FiCheckCircle, FiAlertTriangle, FiInfo, FiCalendar, FiUser } from "react-icons/fi";

const NotificationCard = ({ notification, onMarkAsRead }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success':
                return <FiCheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <FiInfo className="w-5 h-5 text-blue-500" />;
            default:
                return <FiBell className="w-5 h-5 text-primary" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'success':
                return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
            case 'warning':
                return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
            case 'info':
                return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10';
            default:
                return 'border-l-primary bg-primary/5';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 60) {
            return `Hace ${diffMinutes} minutos`;
        } else if (diffHours < 24) {
            return `Hace ${diffHours} horas`;
        } else if (diffDays < 7) {
            return `Hace ${diffDays} días`;
        } else {
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!notification.read && !isExpanded) {
            onMarkAsRead(notification.id);
        }
    };

    return (
        <div className={`
            relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg border-l-4
            ${getTypeColor(notification?.type)}
            ${!notification.read ? 'shadow-md' : 'shadow-sm'}
            border border-primary/20 bg-background dark:bg-foreground
        `}>
            
            {!notification?.read && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full animate-pulse" />
            )}

            <div className="p-6">
                <div className="space-y-4">
                    
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                                {getTypeIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`
                                    font-bold text-lg leading-tight
                                    ${!notification.read 
                                        ? 'text-foreground dark:text-background' 
                                        : 'text-foreground/80 dark:text-background/80'
                                    }
                                `}>
                                    {notification.title}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-accent dark:text-muted">
                        <div className="flex items-center space-x-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{formatDate(notification.date)}</span>
                        </div>
                        {notification.walkerName && (
                            <div className="flex items-center space-x-1">
                                <FiUser className="w-4 h-4" />
                                <span>{notification.walkerName}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <p className={`
                            text-foreground/90 dark:text-background/90 leading-relaxed
                            ${!isExpanded ? 'line-clamp-3' : ''}
                        `}>
                            {isExpanded ? notification.fullContent : notification.preview}
                        </p>

                        <div className="flex justify-between items-center pt-2">
                            <button
                                onClick={handleToggleExpand}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                {isExpanded ? 'Ver menos' : 'Leer completo'}
                                <svg 
                                    className={`ml-2 w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <span className={`
                                px-3 py-1 text-xs font-medium rounded-full
                                ${!notification.read 
                                    ? 'bg-primary/20 text-primary' 
                                    : 'bg-accent/20 text-accent dark:bg-muted/20 dark:text-muted'
                                }
                            `}>
                                {!notification.read ? 'Nueva' : 'Leída'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;