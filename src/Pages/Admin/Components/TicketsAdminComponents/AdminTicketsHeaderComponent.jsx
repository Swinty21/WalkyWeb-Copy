import { FiRefreshCw, FiMessageSquare, FiClock, FiCheck } from "react-icons/fi";

const AdminTicketsHeaderComponent = ({ 
    activeTab, 
    setActiveTab, 
    onRefresh,
    pendingTicketsCount, 
    resolvedTicketsCount,
    totalTickets
}) => {
    return (
        <header className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-8">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            Administración de Tickets
                        </h1>
                        <p className="text-white/80 text-lg">
                            Panel de control para gestión de consultas y soporte
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
                            <div className="flex items-center justify-center mb-1">
                                <FiClock className="text-white mr-2" size={18} />
                                <span className="text-2xl font-bold text-white">{pendingTicketsCount}</span>
                            </div>
                            <p className="text-white/80 text-xs font-medium">Pendientes</p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
                            <div className="flex items-center justify-center mb-1">
                                <FiMessageSquare className="text-white mr-2" size={18} />
                                <span className="text-2xl font-bold text-white">{totalTickets}</span>
                            </div>
                            <p className="text-white/80 text-xs font-medium">Total</p>
                        </div>
                        
                        <button
                            onClick={onRefresh}
                            className="bg-white/20 text-white px-4 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl backdrop-blur-sm"
                            title="Actualizar datos"
                        >
                            <FiRefreshCw size={18} />
                            <span className="hidden sm:inline">Actualizar</span>
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "pending" 
                                    ? "bg-white text-purple-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiClock size={16} />
                            Pendientes ({pendingTicketsCount})
                        </button>
                        <button
                            onClick={() => setActiveTab("resolved")}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "resolved" 
                                    ? "bg-white text-purple-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiCheck size={16} />
                            Resueltos ({resolvedTicketsCount})
                        </button>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                        <p className="text-white/90 text-sm">
                            Panel de administración - Soporte técnico
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminTicketsHeaderComponent;