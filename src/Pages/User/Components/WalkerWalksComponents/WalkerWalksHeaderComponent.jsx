const WalkerWalksHeaderComponent = ({ 
    activeTab, 
    setActiveTab, 
    requestsCount, 
    activeCount, 
    historyCount 
}) => {
    return (
        <header className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-success via-success/90 to-primary p-8">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                    Mis Servicios de Paseo
                </h1>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex space-x-4 flex-wrap">
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === "requests" 
                                    ? "bg-white text-success shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            Solicitudes ({requestsCount})
                        </button>
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === "active" 
                                    ? "bg-white text-success shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            Activos ({activeCount})
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === "history" 
                                    ? "bg-white text-success shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            Historial ({historyCount})
                        </button>
                    </div>
                    
                    <div className="text-white/80 text-sm font-medium">
                        Panel de Paseador
                    </div>
                </div>
            </div>
        </header>
    );
};

export default WalkerWalksHeaderComponent;