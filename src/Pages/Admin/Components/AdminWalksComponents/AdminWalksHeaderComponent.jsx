import { FiUsers, FiActivity, FiCheck, FiClock } from "react-icons/fi";

const AdminWalksHeaderComponent = ({ 
    activeTab, 
    setActiveTab, 
    allWalksCount, 
    activeWalksCount, 
    completedWalksCount, 
    pendingWalksCount 
}) => {
    return (
        <header className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                        <FiUsers className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                            Gestión de Paseos
                        </h1>
                        <p className="text-white/80 text-sm mt-1">
                            Panel de administración - Vista general de todos los paseos
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "all" 
                                    ? "bg-white text-indigo-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiUsers size={16} />
                            Todos ({allWalksCount})
                        </button>
                        
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "active" 
                                    ? "bg-white text-indigo-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiActivity size={16} />
                            Activos ({activeWalksCount})
                        </button>
                        
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "pending" 
                                    ? "bg-white text-indigo-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiClock size={16} />
                            Pendientes ({pendingWalksCount})
                        </button>
                        
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "completed" 
                                    ? "bg-white text-indigo-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiCheck size={16} />
                            Historial ({completedWalksCount})
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <div className="text-white/80 text-xs">Total Hoy</div>
                            <div className="text-white font-bold text-lg">{activeWalksCount}</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <div className="text-white/80 text-xs">Completados</div>
                            <div className="text-white font-bold text-lg">{completedWalksCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminWalksHeaderComponent;