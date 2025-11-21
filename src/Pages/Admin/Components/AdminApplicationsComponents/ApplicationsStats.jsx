import { FaUsers, FaClock, FaCheckCircle, FaTimes, FaEye } from 'react-icons/fa';

const ApplicationsStats = ({ stats }) => {
    const statCards = [
        {
            title: 'Total',
            value: stats.total,
            icon: FaUsers,
            gradient: 'from-indigo-500 to-purple-600',
            bgColor: 'bg-indigo-500/10',
            textColor: 'text-indigo-600',
            borderColor: 'border-indigo-500/20'
        },
        {
            title: 'Pendientes',
            value: stats.pending + stats.under_review,
            icon: FaClock,
            gradient: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            textColor: 'text-orange-600',
            borderColor: 'border-orange-500/20'
        },
        {
            title: 'Aprobadas',
            value: stats.approved,
            icon: FaCheckCircle,
            gradient: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            textColor: 'text-green-600',
            borderColor: 'border-green-500/20'
        },
        {
            title: 'Rechazadas',
            value: stats.rejected,
            icon: FaTimes,
            gradient: 'from-red-500 to-pink-500',
            bgColor: 'bg-red-500/10',
            textColor: 'text-red-600',
            borderColor: 'border-red-500/20'
        },
        {
            title: 'En Revisión',
            value: stats.under_review,
            icon: FaEye,
            gradient: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border ${stat.borderColor}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                                <stat.icon className="text-xl text-white" />
                            </div>
                            <div className={`px-2 py-1 ${stat.bgColor} rounded-full ${stat.borderColor} border backdrop-blur-sm`}>
                                <p className={`text-xs font-bold ${stat.textColor}`}>
                                    {stat.title}
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className={`text-3xl font-bold ${stat.textColor} mb-1 group-hover:scale-110 transition-transform duration-300`}>
                                {stat.value}
                            </p>
                            <div className="h-1 bg-gradient-to-r opacity-30 rounded-full group-hover:opacity-60 transition-opacity duration-300">
                                <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ApplicationsStats;