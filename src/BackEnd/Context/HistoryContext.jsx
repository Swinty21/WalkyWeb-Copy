import { createContext, useContext, useState, useCallback } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const addToHistory = useCallback((activeItem, contentParams = null) => {
        setHistory(prevHistory => {
            
            const newEntry = { 
                id: activeItem, 
                params: contentParams,
                timestamp: Date.now()
            };

            let newHistory = currentIndex >= 0 ? prevHistory.slice(0, currentIndex + 1) : prevHistory;

            const lastEntry = newHistory[newHistory.length - 1];
            if (lastEntry && lastEntry.id === newEntry.id && 
                JSON.stringify(lastEntry.params) === JSON.stringify(newEntry.params)) {
                return newHistory;
            }

            newHistory = [...newHistory, newEntry];

            if (newHistory.length > 8) {
                newHistory = newHistory.slice(1);
            }

            return newHistory;
        });

        setCurrentIndex(prevIndex => {
            const newHistoryLength = history.length + 1 > 8 ? 8 : history.length + 1;
            return newHistoryLength - 1;
        });
    }, [history.length, currentIndex]);

    const goBack = useCallback(() => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            return history[newIndex];
        }
        return null;
    }, [history, currentIndex]);

    const canGoBack = useCallback(() => {
        return currentIndex > 0;
    }, [currentIndex]);

    const clearHistory = useCallback(() => {
        setHistory([]);
        setCurrentIndex(-1);
    }, []);

    const getCurrentEntry = useCallback(() => {
        return currentIndex >= 0 ? history[currentIndex] : null;
    }, [history, currentIndex]);

    const value = {
        history,
        currentIndex,
        addToHistory,
        goBack,
        canGoBack,
        clearHistory,
        getCurrentEntry
    };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory debe ser usado dentro de HistoryProvider');
    }
    return context;
};