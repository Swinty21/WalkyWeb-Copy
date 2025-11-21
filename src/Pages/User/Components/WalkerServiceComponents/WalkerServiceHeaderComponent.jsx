import { FaWalking } from "react-icons/fa";

const WalkerServiceHeaderComponent = ({ walkerData }) => {
    return (
        <div className="bg-gradient-to-r from-primary via-primary/90 to-success rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <FaWalking className="text-4xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            Dashboard del Paseador
                        </h1>
                        {walkerData && (
                            <p className="text-white/80 text-lg font-medium">
                                Bienvenido, {walkerData.fullName}
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="text-right text-white/80">
                    <p className="text-sm font-medium">Panel de Control</p>
                    <p className="text-xs">Gestiona tus servicios</p>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
    );
};

export default WalkerServiceHeaderComponent;