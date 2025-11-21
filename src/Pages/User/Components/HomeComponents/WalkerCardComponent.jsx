import { useState } from "react";
import { AiOutlineStar } from "react-icons/ai";
import { MdGpsFixed, MdGpsOff } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigation } from "../../../../BackEnd/Context/NavigationContext";
import GetServiceModal from "../../Modals/GetServiceModal";
import { useToast } from '../../../../BackEnd/Context/ToastContext';

const WalkerCardComponent = ({ walkers }) => {

    const { success} = useToast();
    const { navigateToContent } = useNavigation();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWalker, setSelectedWalker] = useState(null);
    
    const handleViewProfile = (walkerId) => {
        navigateToContent('walker-profile', { walkerId });
    };

    const handleRequestWalk = (walker) => {
        setSelectedWalker(walker);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWalker(null);
    };

    const handleRequestSent = () => {
        success('Solicitud de paseo enviada exitosamente', {
                    title: 'Éxito',
                    duration: 4000
                });
    };

    const handleJoinToUs = () => {
        navigateToContent('join-to-us');
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-background">
                Mejores Paseadores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {walkers.map((walker) => (
                    <div
                        key={walker.id}
                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                            walker.isPlaceholder 
                                ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-dashed border-primary/40 shadow-lg' 
                                : 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg border border-primary/20'
                        }`}
                    >
                        
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={walker.image}
                                alt={walker.name || walker.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                                }}
                            />
                            {!walker.isPlaceholder && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                            
                            {!walker.isPlaceholder && (
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                                    <AiOutlineStar className="text-yellow-400 text-sm" />
                                    <span className="text-sm font-semibold text-white">
                                        {walker.rating}
                                    </span>
                                </div>
                            )}

                            {!walker.isPlaceholder && (
                                <div className="absolute top-3 left-3">
                                    {walker.hasGPSTracker ? (
                                        <div className="bg-green-500/90 backdrop-blur-sm rounded-full p-1.5 tooltip-container">
                                            <MdGpsFixed className="text-white w-4 h-4" />
                                            <div className="tooltip absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                GPS Activo
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-500/90 backdrop-blur-sm rounded-full p-1.5 tooltip-container">
                                            <MdGpsOff className="text-white w-4 h-4" />
                                            <div className="tooltip absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Sin GPS
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            {walker.isPlaceholder ? (
                                <div className="text-center space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-xl text-primary mb-1">
                                            {walker.title}
                                        </h3>
                                        <p className="text-accent dark:text-muted font-medium text-sm">
                                            {walker.subtitle}
                                        </p>
                                    </div>
                                    <p className="text-sm text-foreground/80 dark:text-background/80 leading-relaxed">
                                        {walker.description}
                                    </p>
                                    <button 
                                        onClick={() => handleJoinToUs()}
                                        className="w-full bg-gradient-to-r from-primary to-success text-white py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-success/90 transform hover:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl">
                                        Únete Ahora
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-bold text-lg text-foreground dark:text-background leading-tight flex-1">
                                                {walker.name}
                                            </h3>
                                            
                                            <div className="ml-2 flex items-center">
                                                {walker.hasGPSTracker ? (
                                                    <MdGpsFixed className="text-green-500 w-5 h-5" />
                                                ) : (
                                                    <MdGpsOff className="text-gray-400 w-5 h-5" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-1 text-accent dark:text-muted">
                                                <FaMapMarkerAlt className="w-3 h-3" />
                                                <span className="font-medium">
                                                    {walker.location || "Ubicación no disponible"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-accent dark:text-muted">
                                            <span>{walker.experience?.replace(' years', '') + ' años de experiencia'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <button 
                                            onClick={() => handleRequestWalk(walker)}
                                            className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                                        >
                                            Solicitar
                                        </button>
                                        <button 
                                            onClick={() => handleViewProfile(walker.id)}
                                            className="w-full bg-background dark:bg-foreground border border-primary text-primary hover:bg-primary hover:text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                                        >
                                            Ver Perfil
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {walker.isPlaceholder && (
                            <>
                                <div className="absolute top-4 left-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                                <div className="absolute bottom-4 right-4 w-6 h-6 bg-success/20 rounded-full animate-pulse delay-300" />
                                <div className="absolute top-1/2 right-4 w-4 h-4 bg-warning/20 rounded-full animate-pulse delay-700" />
                            </>
                        )}
                    </div>
                ))}
            </div>

            <GetServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                walker={selectedWalker}
                onRequestSent={handleRequestSent}
            />
        </div>
    );
};

export default WalkerCardComponent;