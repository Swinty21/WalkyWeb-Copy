import { useState } from "react";
import { AiOutlineStar } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdGpsFixed, MdGpsOff } from "react-icons/md";
import GetServiceModal from "../../Modals/GetServiceModal";
import { useToast } from '../../../../BackEnd/Context/ToastContext';

const WalkerCard = ({ 
    walker, 
    onViewProfile
}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { success} = useToast();
    const StarRating = ({ rating }) => {
        return (
            <div className="flex items-center space-x-1">
                <AiOutlineStar className="text-yellow-400 text-lg" />
                <span className="text-sm font-semibold text-white">
                    {rating}
                </span>
            </div>
        );
    };

    const handleRequestWalk = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleRequestSent = () => {
        success('Solicitud de paseo enviada exitosamente', {
            title: 'Éxito',
            duration: 4000
        });
    };

    return (
        <>
            <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg border border-primary/20">

                <div className="relative h-48 overflow-hidden">
                    <img
                        src={walker.image}
                        alt={walker.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                        <StarRating rating={walker.rating} />
                    </div>

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
                </div>

                <div className="p-5">
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
                            
                            <div className="flex items-center space-x-1 text-sm text-accent dark:text-muted">
                                <FaMapMarkerAlt className="w-3 h-3" />
                                <span>{walker.location || "Ubicación no disponible"}</span>
                            </div>
                            
                            {walker.experience && (
                                <p className="text-accent dark:text-muted text-sm">
                                    {walker.experience}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <button 
                                onClick={handleRequestWalk}
                                className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                            >
                                Solicitar
                            </button>
                            <button 
                                onClick={() => onViewProfile(walker.id)}
                                className="w-full bg-background dark:bg-foreground border border-primary text-primary hover:bg-primary hover:text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                            >
                                Ver Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <GetServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                walker={walker}
                onRequestSent={handleRequestSent}
            />
        </>
    );
};

export default WalkerCard;