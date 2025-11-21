import { useState, useEffect } from "react";
import { WalkerController } from '../../BackEnd/Controllers/WalkerController';
import { useNavigation } from "../../BackEnd/Context/NavigationContext";
import WalkerSearchFilter from './Filters/SearchWalker/WalkerSearchFilter';
import WalkerCard from './Components/SearchWalker/WalkerCard';

const SearchWalker = () => {
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [rating, setRating] = useState(0);
    const [hasGps, setHasGps] = useState(false);
    const [filteredWalkers, setFilteredWalkers] = useState([]);
    const [walkers, setWalkers] = useState([]);
    const [availableLocations, setAvailableLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { navigateToContent } = useNavigation();

    useEffect(() => {
        const loadWalkers = async () => {
            try {
                setLoading(true);
                setError(null);
                const walkersData = await WalkerController.fetchWalkers();
                
                const walkersForSearch = walkersData.filter(walker => !walker.isPlaceholder);
                
                const uniqueLocations = [...new Set(walkersForSearch.map(walker => walker.location))].filter(Boolean).sort();
                
                setWalkers(walkersForSearch);
                setFilteredWalkers(walkersForSearch);
                setAvailableLocations(uniqueLocations);
            } catch (err) {
                setError('Error loading walkers: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadWalkers();
    }, []);

    useEffect(() => {
        const filtered = walkers.filter(walker => {
            const matchesSearch = walker.name.toLowerCase().includes(search.toLowerCase());
            const matchesLocation = !location || walker.location === location;
            const matchesRating = !rating || walker.rating >= rating;
            const matchesGps = !hasGps || walker.hasGPSTracker === hasGps;
            return matchesSearch && matchesLocation && matchesRating && matchesGps;
        });
        setFilteredWalkers(filtered);
    }, [search, location, rating, hasGps, walkers]);

    const handleViewProfile = (walkerId) => {
        navigateToContent('walker-profile', { walkerId });
    };

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setRating(0);
        setHasGps(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-foreground dark:text-background">Cargando paseadores...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background dark:bg-foreground p-4 md:p-8">
            <div className=" mx-auto">
                <WalkerSearchFilter
                    search={search}
                    setSearch={setSearch}
                    location={location}
                    setLocation={setLocation}
                    rating={rating}
                    setRating={setRating}
                    hasGps={hasGps}
                    setHasGps={setHasGps}
                    availableLocations={availableLocations}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    clearFilters={clearFilters}
                />

                {filteredWalkers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🐕</div>
                        <h3 className="text-xl font-bold text-foreground dark:text-background mb-2">
                            No se encontraron paseadores
                        </h3>
                        <p className="text-accent dark:text-muted">
                            Intenta ajustar tus filtros de búsqueda
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                Paseadores Disponibles
                            </h2>
                            <span className="text-accent dark:text-muted">
                                {filteredWalkers.length} resultados
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                            {filteredWalkers.map((walker) => (
                                <WalkerCard
                                    key={walker.id}
                                    walker={walker}
                                    onViewProfile={handleViewProfile}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchWalker;