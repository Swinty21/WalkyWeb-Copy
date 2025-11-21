import { FiSearch, FiFilter, FiUser, FiUserCheck, FiCreditCard } from "react-icons/fi";

const AdminUsersFilter = ({
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    subscriptionFilter,
    setSubscriptionFilter,
    uniqueRoles,
    uniqueSubscriptions
}) => {
    const roleOptions = [
        { value: "all", label: "Todos los roles" },
        { value: "admin", label: "Administrador" },
        { value: "client", label: "Cliente" },
        { value: "walker", label: "Paseador" },
        { value: "support", label: "Soporte" }
    ];

    const statusOptions = [
        { value: "all", label: "Todos los estados" },
        { value: "active", label: "Activos" },
        { value: "inactive", label: "Inactivos" }
    ];

    const clearFilters = () => {
        setSearchQuery("");
        setRoleFilter("all");
        setStatusFilter("all");
        setSubscriptionFilter("all");
    };

    const hasActiveFilters = searchQuery || roleFilter !== "all" || statusFilter !== "all" || subscriptionFilter !== "all";

    return (
        <div className="mb-8 bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <FiFilter className="text-blue-600" />
                    <h3 className="font-semibold text-foreground dark:text-background">Filtros de Usuarios</h3>
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
                        placeholder="Buscar por nombre o email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background placeholder-accent dark:placeholder-muted transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        {roleOptions.map(option => (
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
                        <FiUserCheck className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        {statusOptions.map(option => (
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
                        <FiCreditCard className="text-accent dark:text-muted" size={16} />
                    </div>
                    <select
                        value={subscriptionFilter}
                        onChange={(e) => setSubscriptionFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 bg-white/50 dark:bg-foreground/50 dark:border-gray-600 text-foreground dark:text-background appearance-none cursor-pointer transition-all duration-200"
                    >
                        <option value="all">Todas las suscripciones</option>
                        {uniqueSubscriptions.map(subscription => (
                            <option key={subscription} value={subscription}>
                                {subscription}
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
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm">
                            Búsqueda: "{searchQuery}"
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {roleFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-sm">
                            Rol: {roleOptions.find(opt => opt.value === roleFilter)?.label}
                            <button
                                onClick={() => setRoleFilter("all")}
                                className="text-indigo-600 hover:text-indigo-700"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {statusFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm">
                            Estado: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                            <button
                                onClick={() => setStatusFilter("all")}
                                className="text-green-600 hover:text-green-700"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {subscriptionFilter !== "all" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm">
                            Suscripción: {subscriptionFilter}
                            <button
                                onClick={() => setSubscriptionFilter("all")}
                                className="text-purple-600 hover:text-purple-700"
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

export default AdminUsersFilter;