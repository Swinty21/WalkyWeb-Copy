import { createContext, useContext } from 'react';
import { useHistory } from './HistoryContext';

const NavigationContext = createContext();

export const NavigationProvider = ({ children, navigateToContent }) => {
    const { addToHistory, clearHistory } = useHistory();

    const enhancedNavigateToContent = (contentId, params = null) => {

        navigateToContent(contentId, params);
        addToHistory(contentId, params);
    };

    const handleLogout = () => {
        clearHistory();
    };

    return (
        <NavigationContext.Provider value={{ 
            navigateToContent: enhancedNavigateToContent,
            handleLogout 
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation debe ser usado dentro de NavigationProvider');
    }
    return context;
};