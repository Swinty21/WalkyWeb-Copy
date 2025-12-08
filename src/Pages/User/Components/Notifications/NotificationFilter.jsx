import { FiSearch, FiX, FiFilter } from "react-icons/fi";

const NotificationFilter = ({
    search,
    setSearch,
    clearFilters,
    totalCount,
    typeFilter,
    setTypeFilter,
    readFilter,
    setReadFilter,
    timeFilter,
    setTimeFilter
}) => {
    const hasActiveFilters = search || typeFilter !== 'all' || readFilter !== 'all' || timeFilter !== 'all';

    return (
        <div className="bg-background dark:bg-foreground rounded-2xl shadow-lg border border-primary/20 p-6 mb-8">
            <div className="flex flex-col space-y-4">
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-foreground dark:text-background">
                            Mis Notificaciones
                        </h2>
                        {hasActiveFilters && (
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full flex items-center gap-1">
                                <FiFilter className="w-3 h-3" />
                                Filtros activos
                            </span>
                        )}
                    </div>
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
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            <FiX className="h-5 w-5 text-accent dark:text-muted hover:text-foreground dark:hover:text-background transition-colors duration-200" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Tipo
                        </label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background dark:bg-foreground text-foreground dark:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="success">✓ Éxito</option>
                            <option value="warning">⚠ Advertencia</option>
                            <option value="info">ℹ Información</option>
                            <option value="default">🔔 General</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Estado de lectura
                        </label>
                        <select
                            value={readFilter}
                            onChange={(e) => setReadFilter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background dark:bg-foreground text-foreground dark:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        >
                            <option value="all">Todas</option>
                            <option value="unread">No leídas</option>
                            <option value="read">Leídas</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Período
                        </label>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background dark:bg-foreground text-foreground dark:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        >
                            <option value="all">Todo el tiempo</option>
                            <option value="today">Hoy</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                            <option value="3months">Últimos 3 meses</option>
                        </select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm text-white bg-primary hover:bg-primary/90 font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                        >
                            <FiX className="w-4 h-4" />
                            Limpiar todos los filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationFilter;