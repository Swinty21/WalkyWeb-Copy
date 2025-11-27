import { useState, useEffect } from "react";
import { WalksController } from '../../../BackEnd/Controllers/WalksController';
import { useNavigation } from '../../../BackEnd/Context/NavigationContext';
import { useToast } from '../../../BackEnd/Context/ToastContext';

import AdminWalksHeaderComponent from '../Components/WalksViewComponents/AdminWalksHeaderComponent';
import AdminActiveWalksTable from '../Components/WalksViewComponents/AdminActiveWalksTable';
import AdminAllWalksTable from '../Components/WalksViewComponents/AdminAllWalksTable';
import AdminWalksFilter from '../Filters/WalksViewFilter/AdminWalksFilter.jsx';

const AdminWalksView = () => {
    const [walks, setWalks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("active");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");

    const { navigateToContent } = useNavigation();

    const { success, warning } = useToast();

    useEffect(() => {
        loadAllWalks();
    }, []);

    const loadAllWalks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const walksData = await WalksController.fetchWalksForHome();
            
            // Expandir para obtener más detalles si es necesario
            const detailedWalks = await Promise.all(
                walksData.map(async (walk) => {
                    try {
                        const details = await WalksController.fetchWalkDetails(walk.id);
                        return {
                            ...walk,
                            ...details,
                            walker: details.walker?.name || walk.walker
                        };
                    } catch (err) {
                        // Si falla obtener detalles, usar los datos básicos
                        return walk;
                    }
                })
            );
            
            setWalks(detailedWalks);
        } catch (err) {
            setError('Error al cargar los paseos');
        } finally {
            setLoading(false);
        }
    };

    const handleViewWalk = (walkId) => {
        navigateToContent('trip', { tripId: walkId });
    };

    const handleRefresh = () => {
        loadAllWalks();
    };

    const filteredActiveWalks = walks.filter((walk) => {
        const isActive = ["Agendado", "Activo"].includes(walk.status);
        const matchesSearch = walk.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            walk.walker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            walk.id?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || walk.status === statusFilter;
        const matchesDate = !dateFilter || walk.startTime?.includes(dateFilter);

        return isActive && matchesSearch && matchesStatus && matchesDate;
    });

    const filteredAllWalks = walks.filter((walk) => {
        const isNotActiveOrScheduled = !["Agendado", "Activo"].includes(walk.status);
        const matchesSearch = walk.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            walk.walker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            walk.id?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || walk.status === statusFilter;
        const matchesDate = !dateFilter || walk.startTime?.includes(dateFilter);

        return isNotActiveOrScheduled && matchesSearch && matchesStatus && matchesDate;
    });

    const activeWalksCount = walks.filter(walk => 
        ["Agendado", "Activo"].includes(walk.status)
    ).length;

    const totalWalksCount = walks.filter(walk => 
        !["Agendado", "Activo"].includes(walk.status)
    ).length;

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
                    <div className="text-center">
                        <p className="text-lg text-danger mb-4">{error}</p>
                        <button 
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="max-w-full mx-auto">
                
                <AdminWalksHeaderComponent 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onRefresh={handleRefresh}
                    activeWalksCount={activeWalksCount}
                    totalWalksCount={totalWalksCount}
                    totalWalks={walks.length}
                />

                <AdminWalksFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                />

                {activeTab === "active" && (
                    <AdminActiveWalksTable 
                        walks={filteredActiveWalks}
                        onViewWalk={handleViewWalk}
                        searchQuery={searchQuery}
                    />
                )}

                {activeTab === "all" && (
                    <AdminAllWalksTable 
                        walks={filteredAllWalks}
                        searchQuery={searchQuery}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminWalksView;