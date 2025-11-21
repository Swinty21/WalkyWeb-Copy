import { FiSettings, FiImage, FiDollarSign, FiActivity, FiCheck } from "react-icons/fi";

const AdminManagementHeaderComponent = ({ 
    activeTab, 
    setActiveTab,
    activeBannersCount,
    activePlansCount,
    totalBanners,
    totalPlans
}) => {
    return (
        <header className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                        <FiSettings className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                            Gestión de Contenido
                        </h1>
                        <p className="text-white/80 text-sm mt-1">
                            Administrar banners y planes de suscripción
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab("banners")}
                            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "banners" 
                                    ? "bg-white text-purple-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiImage size={16} />
                            Banners ({totalBanners})
                        </button>
                        
                        <button
                            onClick={() => setActiveTab("plans")}
                            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "plans" 
                                    ? "bg-white text-purple-600 shadow-lg transform scale-105" 
                                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                            }`}
                        >
                            <FiDollarSign size={16} />
                            Planes ({totalPlans})
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <div className="text-white/80 text-xs">Banners Activos</div>
                            <div className="text-white font-bold text-lg flex items-center gap-1">
                                <FiActivity size={16} />
                                {activeBannersCount}/3
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <div className="text-white/80 text-xs">Planes Activos</div>
                            <div className="text-white font-bold text-lg flex items-center gap-1">
                                <FiCheck size={16} />
                                {activePlansCount + 1}/4
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/90 text-sm font-medium">Banners</span>
                            <span className="text-white/70 text-xs">{activeBannersCount}/3 máximo</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                                className="bg-white rounded-full h-2 transition-all duration-300" 
                                style={{ width: `${(activeBannersCount / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/90 text-sm font-medium">Planes</span>
                            <span className="text-white/70 text-xs">{activePlansCount + 1}/4 máximo</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                                className="bg-white rounded-full h-2 transition-all duration-300" 
                                style={{ width: `${((activePlansCount + 1) / 4) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminManagementHeaderComponent;