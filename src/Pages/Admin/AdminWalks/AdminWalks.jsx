import { useState, useEffect } from "react";
import { FiCalendar, FiUsers, FiEye, FiFilter } from "react-icons/fi";
import { WalksController } from '../../../BackEnd/Controllers/WalksController';
import { useNavigation } from '../../../BackEnd/Context/NavigationContext';

import AdminWalksHeaderComponent from '../Components/AdminWalksComponents/AdminWalksHeaderComponent';
import AdminWalksCardComponent from '../Components/AdminWalksComponents/AdminWalksCardComponent';
import AdminWalksFilter from '../Filters/AdminWalksFilter/AdminWalksFilter';

const AdminWalks = () => {
    const [walks, setWalks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [walkerFilter, setWalkerFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    
    const { navigateToContent } = useNavigation();

    useEffect(() => {
        const loadWalks = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const walksData = await WalksController.fetchWalksForHome();
                setWalks(walksData);
            } catch (err) {
                setError('Error loading walks: ' + err.message);
                console.error('Error loading walks:', err);
            } finally {
                setLoading(false);
            }
        };

        loadWalks();
    }, []);

    const handleViewWalk = (tripId) => {
        console.log(tripId);
        navigateToContent('trip', { tripId });
    };

    const filteredWalks = walks.filter((walk) => {
        let tabMatch = true;
        switch (activeTab) {
            case "active":
                tabMatch = ["Solicitado", "Esperando pago", "Agendado", "Activo"].includes(walk.status);
                break;
            case "completed":
                tabMatch = ["Cancelado", "Finalizado", "Rechazado"].includes(walk.status);
                break;
            case "pending":
                tabMatch = ["Solicitado", "Esperando pago"].includes(walk.status);
                break;
            default: // "all"
                tabMatch = true;
        }

        const matchesSearch = searchQuery === "" || 
            walk.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            walk.walker?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || walk.status === statusFilter;

        const matchesWalker = walkerFilter === "all" || walk.walker === walkerFilter;

        let matchesDate = true;
        if (dateFilter !== "all") {
            const walkDate = new Date(walk.startTime);
            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            switch (dateFilter) {
                case "today":
                    matchesDate = walkDate >= startOfToday && walkDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
                    break;
                case "week":
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = walkDate >= weekAgo;
                    break;
                case "month":
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = walkDate >= monthAgo;
                    break;
            }
        }

        return tabMatch && matchesSearch && matchesStatus && matchesWalker && matchesDate;
    });

    const allWalksCount = walks.length;
    const activeWalksCount = walks.filter(walk => 
        ["Solicitado", "Esperando pago", "Agendado", "Activo"].includes(walk.status)
    ).length;
    const completedWalksCount = walks.filter(walk => 
        ["Cancelado", "Finalizado", "Rechazado"].includes(walk.status)
    ).length;
    const pendingWalksCount = walks.filter(walk => 
        ["Solicitado", "Esperando pago"].includes(walk.status)
    ).length;

    const uniqueWalkers = [...new Set(walks.map(walk => walk.walker).filter(Boolean))];
    const uniqueStatuses = [...new Set(walks.map(walk => walk.status))];

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg text-foreground dark:text-background ml-4">Cargando paseos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-danger">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
            <div className=" mx-auto">
                
                <AdminWalksHeaderComponent 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    allWalksCount={allWalksCount}
                    activeWalksCount={activeWalksCount}
                    completedWalksCount={completedWalksCount}
                    pendingWalksCount={pendingWalksCount}
                />

                <AdminWalksFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    walkerFilter={walkerFilter}
                    setWalkerFilter={setWalkerFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    uniqueWalkers={uniqueWalkers}
                    uniqueStatuses={uniqueStatuses}
                />

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                        <p className="text-danger font-medium">{error}</p>
                    </div>
                )}

                {filteredWalks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiUsers className="text-4xl text-primary" />
                            </div>
                            <p className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                No se encontraron paseos
                            </p>
                            <p className="text-accent dark:text-muted">
                                Ajusta los filtros para ver más resultados
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-sm text-accent dark:text-muted">
                                Mostrando {filteredWalks.length} de {walks.length} paseos
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {filteredWalks.map((walk) => (
                                <AdminWalksCardComponent 
                                    key={walk.id}
                                    walk={walk}
                                    onViewWalk={handleViewWalk}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminWalks;