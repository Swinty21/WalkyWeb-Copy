import { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe ser usado dentro de ToastProvider');
    }
    return context;
};

const Toast = ({ toast, onRemove }) => {
    const getToastStyles = () => {
        switch (toast.type) {
            case 'success':
                return {
                    bg: 'bg-success/10 dark:bg-success/20 border-success/30 dark:border-success/40',
                    text: 'text-foreground dark:text-background',
                    icon: <FiCheckCircle className="text-success" size={20} />
                };
            case 'error':
                return {
                    bg: 'bg-danger/10 dark:bg-danger/20 border-danger/30 dark:border-danger/40',
                    text: 'text-foreground dark:text-background',
                    icon: <FiAlertCircle className="text-danger" size={20} />
                };
            case 'info':
                return {
                    bg: 'bg-info/10 dark:bg-info/20 border-info/30 dark:border-info/40',
                    text: 'text-foreground dark:text-background',
                    icon: <FiInfo className="text-info" size={20} />
                };
            case 'warning':
                return {
                    bg: 'bg-warning/10 dark:bg-warning/20 border-warning/30 dark:border-warning/40',
                    text: 'text-foreground dark:text-background',
                    icon: <FiAlertCircle className="text-warning" size={20} />
                };
            default:
                return {
                    bg: 'bg-neutral/10 dark:bg-neutral/20 border-neutral/30 dark:border-neutral/40',
                    text: 'text-foreground dark:text-background',
                    icon: <FiInfo className="text-neutral" size={20} />
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={`${styles.bg} ${styles.text} border rounded-lg p-4 shadow-lg backdrop-blur-sm transition-all duration-300 transform animate-in slide-in-from-right-full max-w-sm`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {styles.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <h4 className="font-semibold text-sm mb-1">
                            {toast.title}
                        </h4>
                    )}
                    <p className="text-sm opacity-90 break-words">
                        {toast.message}
                    </p>
                </div>
                
                <button
                    onClick={() => onRemove(toast.id)}
                    className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <FiX size={16} className="opacity-60 hover:opacity-100" />
                </button>
            </div>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({
        type = 'info',
        title,
        message,
        duration = 5000,
        persist = false
    }) => {
        const id = Date.now() + Math.random();
        const toast = { id, type, title, message, duration, persist };
        
        setToasts(prev => [...prev, toast]);

        if (!persist && duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const success = useCallback((message, options = {}) => {
        return addToast({ ...options, type: 'success', message });
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast({ ...options, type: 'error', message });
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast({ ...options, type: 'info', message });
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast({ ...options, type: 'warning', message });
    }, [addToast]);

    const contextValue = {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        info,
        warning
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast toast={toast} onRemove={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};