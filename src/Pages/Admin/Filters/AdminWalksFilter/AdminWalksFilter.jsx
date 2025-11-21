import { FiSearch, FiFilter, FiCalendar, FiUser } from "react-icons/fi";

const AdminWalksFilter = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    walkerFilter,
    setWalkerFilter,
    dateFilter,
    setDateFilter,
    uniqueWalkers,
    uniqueStatuses
}) => {
    const statusOptions = [
        { value: "all", label: "Todos los estados" },
        { value: "Solicitado", label: "Solicitado", color: "text-blue-600" },
        { value: "Esperando pago", label: "Esperando Pago", color: "text-orange-600" },
        { value: "Agendado", label: "Agendado", color: "text-yellow-600" },
        { value: "Activo", label: "Activo", color: "text-green-600" },
        { value: "Finalizado", label: "Finalizado", color: "text-gray-600" },
        { value: "Rechazado", label: "Rechazado", color: "text-red-600" },
        { value: "Cancelado", label: "Cancelado", color: "text-red-600" }
    ];

    const dateOptions = [
        { value: "all", label: "Todas las fechas" },
        { value: "today", label: "Hoy" },
        { value: "week", label: "Última semana" },
        { value: "month", label: "Último mes" }
    ];

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setWalkerFilter("all");
        setDateFilter("all");
    };

    const hasActiveFilters = searchQuery || statusFilter !== "all" || walkerFilter !== "all" || dateFilter !== "all";

    return (
        <div className="mb-8 bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <FiFilter className="text-primary" />
                    <h3 className="font-semibold text-foreground dark:text-background">Filtros</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-danger hover:text-danger/80 transition-colors duration-200 underline"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-accent dark:text-muted" size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por mascota o paseador..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background placeholder-accent dark:placeholder-muted transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value} className={option.color}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-accent dark:text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={walkerFilter}
                        onChange={(e) => setWalkerFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        <option value="all">Todos los paseadores</option>
                        {uniqueWalkers.map(walker => (
                            <option key={walker} value={walker}>
                                {walker}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-accent dark:text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        {dateOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-accent dark:text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {searchQuery && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            Búsqueda: "{searchQuery}"
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-primary hover:text-primary/80"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {statusFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
                            Estado: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                            <button
                                onClick={() => setStatusFilter("all")}
                                className="text-success hover:text-success/80"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {walkerFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-info/10 text-info rounded-full text-sm">
                            Paseador: {walkerFilter}
                            <button
                                onClick={() => setWalkerFilter("all")}
                                className="text-info hover:text-info/80"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {dateFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
                            Fecha: {dateOptions.find(opt => opt.value === dateFilter)?.label}
                            <button
                                onClick={() => setDateFilter("all")}
                                className="text-warning hover:text-warning/80"
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminWalksFilter;