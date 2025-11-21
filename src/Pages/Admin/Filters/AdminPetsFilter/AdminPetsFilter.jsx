import { FiSearch, FiFilter, FiUser, FiCalendar, FiPackage } from "react-icons/fi";

const AdminPetsFilter = ({
    searchQuery,
    setSearchQuery,
    ownerFilter,
    setOwnerFilter,
    ageFilter,
    setAgeFilter,
    weightFilter,
    setWeightFilter,
    uniqueOwners
}) => {
    const ageOptions = [
        { value: "all", label: "Todas las edades" },
        { value: "young", label: "Jóvenes (≤ 2 años)" },
        { value: "adult", label: "Adultos (3-7 años)" },
        { value: "senior", label: "Mayores (> 7 años)" }
    ];

    const weightOptions = [
        { value: "all", label: "Todos los pesos" },
        { value: "small", label: "Pequeños (≤ 10 kg)" },
        { value: "medium", label: "Medianos (11-25 kg)" },
        { value: "large", label: "Grandes (> 25 kg)" }
    ];

    const clearFilters = () => {
        setSearchQuery("");
        setOwnerFilter("all");
        setAgeFilter("all");
        setWeightFilter("all");
    };

    const hasActiveFilters = searchQuery || ownerFilter !== "all" || ageFilter !== "all" || weightFilter !== "all";

    return (
        <div className="mb-8 bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-500/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <FiFilter className="text-emerald-600" />
                    <h3 className="font-semibold text-foreground dark:text-background">Filtros de Mascotas</h3>
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
                        placeholder="Buscar por nombre o propietario..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background placeholder-accent dark:placeholder-muted transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={ownerFilter}
                        onChange={(e) => setOwnerFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        <option value="all">Todos los propietarios</option>
                        {uniqueOwners.map(owner => (
                            <option key={owner} value={owner}>
                                {owner}
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
                        value={ageFilter}
                        onChange={(e) => setAgeFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        {ageOptions.map(option => (
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

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPackage className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={weightFilter}
                        onChange={(e) => setWeightFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        {weightOptions.map(option => (
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
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm">
                            Búsqueda: "{searchQuery}"
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-emerald-600 hover:text-emerald-700"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {ownerFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-600 rounded-full text-sm">
                            Propietario: {ownerFilter}
                            <button
                                onClick={() => setOwnerFilter("all")}
                                className="text-teal-600 hover:text-teal-700"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {ageFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm">
                            Edad: {ageOptions.find(opt => opt.value === ageFilter)?.label}
                            <button
                                onClick={() => setAgeFilter("all")}
                                className="text-green-600 hover:text-green-700"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {weightFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-sm">
                            Peso: {weightOptions.find(opt => opt.value === weightFilter)?.label}
                            <button
                                onClick={() => setWeightFilter("all")}
                                className="text-cyan-600 hover:text-cyan-700"
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

export default AdminPetsFilter;