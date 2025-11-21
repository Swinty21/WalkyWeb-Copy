import { FiSearch, FiX } from "react-icons/fi";

const NotificationFilter = ({
    search,
    setSearch,
    clearFilters,
    totalCount
}) => {
    return (
        <div className="bg-background dark:bg-foreground rounded-2xl shadow-lg border border-primary/20 p-6 mb-8">
            <div className="flex flex-col space-y-4">
                
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground dark:text-background">
                        Mis Notificaciones
                    </h2>
                    {totalCount !== undefined && (
                        <span className="text-accent dark:text-muted">
                            {totalCount} notificaciones
                        </span>
                    )}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-accent dark:text-muted" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar notificaciones..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 rounded-lg border border-primary/30 bg-background dark:bg-foreground text-foreground dark:text-background placeholder-accent dark:placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    {search && (
                        <button
                            onClick={clearFilters}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            <FiX className="h-5 w-5 text-accent dark:text-muted hover:text-foreground dark:hover:text-background transition-colors duration-200" />
                        </button>
                    )}
                </div>

                {search && (
                    <div className="flex justify-end">
                        <button
                            onClick={clearFilters}
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

export default NotificationFilter;