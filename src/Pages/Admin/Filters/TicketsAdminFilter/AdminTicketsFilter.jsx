import { FiSearch, FiFilter, FiCalendar } from "react-icons/fi";

const AdminTicketsFilter = ({ 
    searchQuery, 
    setSearchQuery, 
    categoryFilter, 
    setCategoryFilter,
    dateFilter,
    setDateFilter
}) => {
    const categoryOptions = [
        { value: "all", label: "Todas las categorías" },
        { value: "Consulta General", label: "Consulta General" },
        { value: "Problema Técnico", label: "Problema Técnico" },
        { value: "Facturación", label: "Facturación" },
        { value: "Cuenta de Usuario", label: "Cuenta de Usuario" },
        { value: "Paseadores", label: "Paseadores" },
        { value: "Servicios de Paseo", label: "Servicios de Paseo" }
    ];

    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all");
        setDateFilter("");
    };

    const hasActiveFilters = searchQuery || categoryFilter !== "all" || dateFilter;

    return (
        <div className="mb-6 bg-white dark:bg-foreground rounded-xl shadow-lg p-6 border border-border dark:border-muted">
            <div className="flex flex-col lg:flex-row gap-4">
                
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent dark:text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por ID, asunto o mensaje..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background dark:bg-foreground border border-border dark:border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground dark:text-background placeholder-accent dark:placeholder-muted transition-all duration-200"
                    />
                </div>

                <div className="relative min-w-[220px]">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent dark:text-muted z-10" size={18} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 bg-background dark:bg-foreground border border-border dark:border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative min-w-[180px]">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent dark:text-muted z-10" size={18} />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background dark:bg-foreground border border-border dark:border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground dark:text-background cursor-pointer transition-all duration-200"
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-3 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {searchQuery && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            Búsqueda: "{searchQuery}"
                        </span>
                    )}
                    {categoryFilter !== "all" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-info/10 text-info">
                            Categoría: {categoryOptions.find(opt => opt.value === categoryFilter)?.label}
                        </span>
                    )}
                    {dateFilter && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            Fecha: {new Date(dateFilter).toLocaleDateString('es-ES')}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminTicketsFilter;