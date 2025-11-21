import { AiOutlineStar, AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
import { MdGpsFixed, MdClear } from "react-icons/md";

const WalkerSearchFilter = ({ 
    search, 
    setSearch, 
    location, 
    setLocation, 
    rating, 
    setRating, 
    hasGps, 
    setHasGps, 
    availableLocations,
    showFilters, 
    setShowFilters, 
    clearFilters 
    }) => {
    return (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 mb-8 border border-primary/20 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">

                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Buscar paseadores por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-4 pr-12 border border-primary/30 rounded-xl bg-background/50 dark:bg-foreground/10 backdrop-blur-sm text-foreground dark:text-background placeholder-accent/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <AiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-xl" />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md"
                >
                    <AiOutlineFilter />
                    <span>Filtros</span>
                </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-6 pt-6 border-t border-primary/20`}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Localidad
                        </label>
                        <select
                            className="w-full p-3 border border-primary/30 rounded-lg bg-background/50 dark:bg-foreground/10 text-foreground dark:text-background focus:border-primary focus:outline-none transition-all"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star === rating ? 0 : star)}
                                    className={`p-2 rounded-lg transition-all ${
                                        rating >= star 
                                        ? "text-yellow-400 bg-yellow-400/20" 
                                        : "text-accent hover:text-yellow-400 hover:bg-yellow-400/10"
                                    }`}
                                >
                                    <AiOutlineStar className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            Ubicación GPS
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-primary/5 transition-all">
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

                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="flex items-center space-x-2 px-4 py-3 text-accent hover:text-foreground dark:hover:text-background hover:bg-primary/10 rounded-lg transition-all"
                        >
                            <MdClear />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkerSearchFilter;