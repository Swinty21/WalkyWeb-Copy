import { FaClock, FaCheckCircle, FaTimes, FaEye, FaUser, FaIdCard } from 'react-icons/fa';

const ApplicationsList = ({ 
    applications, 
    selectedApplication, 
    onApplicationSelect, 
    activeFilter 
}) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClock className="text-orange-500" />;
            case 'under_review':
                return <FaEye className="text-blue-500" />;
            case 'approved':
                return <FaCheckCircle className="text-green-500" />;
            case 'rejected':
                return <FaTimes className="text-red-500" />;
            default:
                return <FaClock className="text-orange-500" />;
        }
    };

    const getStatusText = (status) => {
        const statusTexts = {
            pending: 'Pendiente',
            under_review: 'En Revisión',
            approved: 'Aprobado',
            rejected: 'Rechazado'
        };
        return statusTexts[status] || status;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-500/70 text-white';
            case 'under_review':
                return 'bg-blue-500/70 text-white';
            case 'approved':
                return 'bg-green-500/70 text-white';
            case 'rejected':
                return 'bg-red-500/70 text-white';
            default:
                return 'bg-orange-500/70 text-white';
        }
    };

    const getPriorityColor = (status) => {
        switch (status) {
            case 'pending':
                return 'border-l-orange-500';
            case 'under_review':
                return 'border-l-blue-500';
            case 'approved':
                return 'border-l-green-500';
            case 'rejected':
                return 'border-l-red-500';
            default:
                return 'border-l-gray-300';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFilterTitle = () => {
        switch (activeFilter) {
            case 'all':
                return 'Todas las Solicitudes';
            case 'new':
                return 'Solicitudes Nuevas';
            case 'reviewed':
                return 'Solicitudes Revisadas';
            case 'pending':
                return 'Solicitudes Pendientes';
            case 'approved':
                return 'Solicitudes Aprobadas';
            case 'rejected':
                return 'Solicitudes Rechazadas';
            default:
                return 'Solicitudes';
        }
    };

    return (
        <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg">
            <div className="p-6 border-b border-primary/10">
                <h2 className="text-xl font-bold text-foreground dark:text-background">
                    {getFilterTitle()}
                </h2>
                <p className="text-sm text-accent dark:text-muted mt-1">
                    {applications.length} solicitud{applications.length !== 1 ? 'es' : ''} encontrada{applications.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
                {applications.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaUser className="text-4xl text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-2">
                            No hay solicitudes
                        </h3>
                        <p className="text-accent dark:text-muted">
                            No se encontraron solicitudes con el filtro actual
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-primary/10">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                onClick={() => onApplicationSelect(application)}
                                className={`group relative overflow-hidden p-4 cursor-pointer transition-all duration-300 hover:bg-indigo-500/5 border-l-4 ${getPriorityColor(application.status)} ${
                                    selectedApplication?.id === application.id
                                        ? 'bg-indigo-500/10 shadow-lg'
                                        : ''
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                                                    <span className="text-white font-bold text-sm">
                                                        {application.fullName?.[0] || 'A'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-foreground dark:text-background group-hover:text-indigo-600 transition-colors duration-300 truncate">
                                                        {application.fullName}
                                                    </h3>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-3">
                                                <div className="flex items-center p-2 bg-indigo-500/10 rounded-lg">
                                                    <FaIdCard className="text-indigo-600 mr-2 flex-shrink-0" size={12} />
                                                    <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                                        DNI: {application.dni}
                                                    </span>
                                                </div>

                                                {application.city && application.province && (
                                                    <div className="flex items-center p-2 bg-purple-500/10 rounded-lg">
                                                        <span className="text-purple-600 mr-2 flex-shrink-0 text-xs">📍</span>
                                                        <span className="text-xs font-semibold text-foreground dark:text-background truncate">
                                                            {application.city}, {application.province}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-indigo-600 font-medium">ID: {application.id}</span>
                                                    <span className="text-purple-600 font-medium">
                                                        {formatDate(application.submittedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(application.status)}`}
                                            >
                                                {getStatusIcon(application.status)}
                                                <span className="ml-1">
                                                    {getStatusText(application.status)}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationsList;