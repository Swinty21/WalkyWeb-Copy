import { AiOutlineStar } from "react-icons/ai";
import { MdGpsFixed, MdGpsOff, MdLocationOn, MdWork } from "react-icons/md";

const WalkerHeaderComponent = ({ 
    walkerData, 
    averageRating, 
    reviewsCount, 
    onRequestWalk 
}) => {
    const buttonBase = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm";
    const buttonActive = "bg-primary text-white shadow-md";

    return (
        <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">

                <div className="relative">
                    <img
                        src={walkerData.profileImage}
                        alt={walkerData.fullName}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20"
                    />
                    {walkerData.hasGPSTracking && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                            <MdGpsFixed className="text-white w-6 h-6" />
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left">
                    
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                        <h1 className="text-3xl font-bold text-foreground dark:text-background">
                            {walkerData.fullName}
                        </h1>
                        {walkerData.hasGPSTracker ? (
                            <MdGpsFixed className="text-green-500 w-6 h-6" />
                        ) : (
                            <MdGpsOff className="text-gray-400 w-6 h-6" />
                        )}
                    </div>

                    <div className="flex items-center justify-center md:justify-start space-x-6 mb-4">
                        <div className="flex items-center space-x-1">
                            <AiOutlineStar className="text-yellow-400 w-5 h-5" />
                            <span className="text-lg font-semibold text-foreground dark:text-background">
                                {averageRating}
                            </span>
                            <span className="text-sm text-accent dark:text-muted">
                                ({reviewsCount} reseñas)
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MdWork className="text-primary w-5 h-5" />
                            <span className="text-sm text-accent dark:text-muted">
                                {walkerData.experienceYears} años de experiencia
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                        <MdLocationOn className="text-red-500 w-5 h-5" />
                        <span className="text-accent dark:text-muted">
                            {walkerData.location}
                        </span>
                    </div>

                    <div className="flex justify-center md:justify-start mt-6">
                        <button 
                            onClick={onRequestWalk}
                            className={`${buttonBase} ${buttonActive} w-full md:w-auto px-8`}
                        >
                            Solicitar Paseo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkerHeaderComponent;