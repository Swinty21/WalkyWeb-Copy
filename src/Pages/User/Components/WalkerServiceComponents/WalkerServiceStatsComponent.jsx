import { FaWalking, FaPlus, FaClock, FaCalendarAlt, FaPlay, FaCheck, FaTimes } from "react-icons/fa";

const WalkerServiceStatsComponent = ({ stats }) => {
    const statsConfig = [
        { 
            title: "Paseos Totales", 
            value: stats.total, 
            icon: <FaWalking className="text-2xl" />, 
            color: "bg-gradient-to-br from-blue-500 to-blue-600" 
        },
        { 
            title: "Paseos Nuevos", 
            value: stats.new, 
            icon: <FaPlus className="text-2xl" />, 
            color: "bg-gradient-to-br from-green-500 to-green-600" 
        },
        { 
            title: "En espera de pago", 
            value: stats.awaitingPayment, 
            icon: <FaClock className="text-2xl" />, 
            color: "bg-gradient-to-br from-yellow-500 to-yellow-600" 
        },
        { 
            title: "Paseos Agendados", 
            value: stats.scheduled, 
            icon: <FaCalendarAlt className="text-2xl" />, 
            color: "bg-gradient-to-br from-purple-500 to-purple-600" 
        },
        { 
            title: "Paseos Activos", 
            value: stats.active, 
            icon: <FaPlay className="text-2xl" />, 
            color: "bg-gradient-to-br from-indigo-500 to-indigo-600" 
        },
        { 
            title: "Paseos Finalizados", 
            value: stats.completed, 
            icon: <FaCheck className="text-2xl" />, 
            color: "bg-gradient-to-br from-emerald-500 to-emerald-600" 
        },
        { 
            title: "Paseos Rechazados y Cancelados", 
            value: (stats.rejected + stats.canceled), 
            icon: <FaTimes className="text-2xl" />, 
            color: "bg-gradient-to-br from-red-500 to-red-600" 
        }
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-background mb-4">
                Resumen de Paseos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {statsConfig.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`${stat.color} p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 group`}
                    >
                        <div className="flex flex-col items-center text-white">
                            <div className="mb-3 p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                {stat.icon}
                            </div>
                            <p className="text-xs font-medium text-center mb-1 leading-tight">
                                {stat.title}
                            </p>
                            <p className="text-xl font-bold">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalkerServiceStatsComponent;