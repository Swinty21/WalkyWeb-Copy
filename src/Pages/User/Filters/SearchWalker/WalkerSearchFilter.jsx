import { AiOutlineStar } from "react-icons/ai";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import { MdGpsFixed, MdWorkOutline } from "react-icons/md";

const WalkerSearchFilter = ({ 
    search, 
    setSearch, 
    location, 
    setLocation, 
    rating, 
    setRating, 
    hasGps, 
    setHasGps,
    experienceYears,
    setExperienceYears,
    availableLocations,
    clearFilters 
    }) => {
    
    const hasActiveFilters = search || location || rating > 0 || hasGps || experienceYears > 0;

    return (
        <div className="bg-background dark:bg-foreground rounded-2xl shadow-lg border border-primary/20 p-6 mb-8">
            <div className="flex flex-col space-y-4">
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-foreground dark:text-background">
                            Buscar Paseadores
                        </h2>
                        {hasActiveFilters && (
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full flex items-center gap-1">
                                <FiFilter className="w-3 h-3" />
                                Filtros activos
                            </span>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-accent dark:text-muted" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar paseadores por nombre..."
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Localidad
                        </label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background dark:bg-foreground text-foreground dark:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Todas las localidades</option>
                            {availableLocations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Rating Mínimo
                        </label>
                        <div className="flex items-center space-x-2 h-[42px]">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star === rating ? 0 : star)}
                                    className={`p-2 rounded-lg transition-all ${
                                        rating >= star 
                                        ? "text-yellow-400 bg-yellow-400/20" 
                                        : "text-accent dark:text-muted hover:text-yellow-400 hover:bg-yellow-400/10"
                                    }`}
                                    title={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                                >
                                    <AiOutlineStar className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Años de Experiencia
                        </label>
                        <select
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background dark:bg-foreground text-foreground dark:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        >
                            <option value="0">Cualquier experiencia</option>
                            <option value="1">1+ años</option>
                            <option value="2">2+ años</option>
                            <option value="3">3+ años</option>
                            <option value="5">5+ años</option>
                            <option value="10">10+ años</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Ubicación GPS
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer px-4 py-2.5 rounded-lg border border-primary/30 bg-background dark:bg-foreground hover:bg-primary/5 transition-all duration-200">
                            <input
                                type="checkbox"
                                checked={hasGps}
                                onChange={(e) => setHasGps(e.target.checked)}
                                className="w-4 h-4 text-primary rounded border-primary/30 focus:ring-primary/20"
                            />
                            <span className="text-sm font-medium text-foreground dark:text-background flex items-center space-x-1">
                                <MdGpsFixed className="text-primary" />
                                <span>Con GPS</span>
                            </span>
                        </label>
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

export default WalkerSearchFilter;