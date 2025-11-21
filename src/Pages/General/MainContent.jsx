import { FiArrowLeft } from 'react-icons/fi';
import { getComponentById, getMenuTitle } from '../../BackEnd/Generics/Menu.jsx';
import { useHistory } from '../../BackEnd/Context/HistoryContext.jsx';

const MainContent = ({ activeItem, contentParams, navigateToContent }) => {
    const { goBack, canGoBack } = useHistory();

    const ActiveComponent = getComponentById(activeItem);
    const pageTitle = getMenuTitle(activeItem);
    
    const handleGoBack = () => {
        const previousEntry = goBack();
        if (previousEntry) {
            navigateToContent(previousEntry.id, previousEntry.params);
        }
    };
    
    return (
        <main className="flex-1 p-8 overflow-auto bg-background dark:bg-foreground">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-foreground dark:text-background">
                            {pageTitle}
                        </h1>
                        <div className="h-1 w-20 bg-primary rounded mt-2"></div>
                    </div>
                    
                    {canGoBack() && (
                        <button
                            onClick={handleGoBack}
                            className="flex items-center space-x-2 px-4 py-2 bg-muted dark:bg-accent hover:bg-primary hover:text-white dark:hover:bg-primary rounded-lg transition-colors text-foreground dark:text-background"
                            title="Volver atrás"
                        >
                            <FiArrowLeft size={20} />
                            <span className="hidden sm:inline">Atrás</span>
                        </button>
                    )}
                </div>
            </div>
            
            <div className="rounded-lg min-h-[calc(100vh-200px)]">
                {ActiveComponent && (
                    <ActiveComponent 
                        contentParams={contentParams} 
                        navigateToContent={navigateToContent}
                    />
                )}
            </div>
        </main>
    );
};

export default MainContent;