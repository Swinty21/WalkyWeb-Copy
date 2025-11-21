import { FiPlus } from "react-icons/fi";

const MyTripsHeaderComponent = ({ 
    activeTab, 
    setActiveTab, 
    setShowCreateForm, 
    activeTripsCount, 
    completedTripsCount 
}) => {
    return (
        <header className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-success p-8">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                    Mis Paseos
                </h1>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === "active" 
                                    ? "bg-white text-primary shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            Paseos Activos ({activeTripsCount})
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === "completed" 
                                    ? "bg-white text-primary shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            Historial ({completedTripsCount})
                        </button>
                    </div>
                    
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-white text-primary px-6 py-3 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                    >
                        <FiPlus size={18} />
                        Nuevo Paseo
                    </button>
                </div>
            </div>
        </header>
    );
};

export default MyTripsHeaderComponent;