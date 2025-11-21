import { FiEdit3, FiTrash2, FiShield, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiClock } from "react-icons/fi";

const AdminUsersCardComponent = ({ user, onEditUser, onDeleteUser, currentUserId }) => {
    const getRoleInfo = (role) => {
        switch (role) {
            case "admin":
                return { name: "Administrador", color: "text-red-600 bg-red-100", bgColor: "from-red-500 to-pink-600" };
            case "client":
                return { name: "Cliente", color: "text-blue-600 bg-blue-100", bgColor: "from-blue-500 to-cyan-600" };
            case "walker":
                return { name: "Paseador", color: "text-green-600 bg-green-100", bgColor: "from-green-500 to-emerald-600" };
            case "support":
                return { name: "Soporte", color: "text-purple-600 bg-purple-100", bgColor: "from-purple-500 to-indigo-600" };
            default:
                return { name: "Usuario", color: "text-gray-600 bg-gray-100", bgColor: "from-gray-500 to-slate-600" };
        }
    };

    const getStatusInfo = (status) => {
        return status === "active" 
            ? { name: "Activo", color: "text-green-600 bg-green-100" }
            : { name: "Inactivo", color: "text-red-600 bg-red-100" };
    };

    const getSubscriptionInfo = (subscription) => {
        switch (subscription) {
            case "Premium":
                return { color: "text-purple-600 bg-purple-100" };
            case "Professional":
                return { color: "text-blue-600 bg-blue-100" };
            case "Staff":
                return { color: "text-indigo-600 bg-indigo-100" };
            default:
                return { color: "text-gray-600 bg-gray-100" };
        }
    };

    const roleInfo = getRoleInfo(user.role);
    const statusInfo = getStatusInfo(user.status);
    const subscriptionInfo = getSubscriptionInfo(user.suscription);
    const isCurrentUser = user.id === currentUserId;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-full flex flex-col ${
            isCurrentUser 
                ? 'border-yellow-500/30 hover:border-yellow-500/50' 
                : 'border-blue-500/10 hover:border-blue-500/30'
        }`}>

            <div className="absolute top-2 left-2 z-10">
                <div className={`backdrop-blur-sm rounded-full p-1.5 shadow-lg ${
                    isCurrentUser 
                        ? 'bg-yellow-500/90' 
                        : 'bg-blue-500/90'
                }`}>
                    {isCurrentUser ? (
                        <FiUser className="text-white text-xs" />
                    ) : (
                        <FiShield className="text-white text-xs" />
                    )}
                </div>
            </div>

            <div className="absolute top-2 right-2 z-10">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.name}
                </span>
            </div>

            {isCurrentUser && (
                <div className="absolute top-10 right-2 z-10">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-yellow-700 bg-yellow-100">
                        Tú
                    </span>
                </div>
            )}

            <div className="relative h-24 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${roleInfo.bgColor} opacity-80`}></div>
                <div className="absolute inset-0 bg-black/20"></div>
                
                <div className="relative z-10 p-4 flex items-center">
                    <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg flex-shrink-0"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">
                            {user.fullName}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color} bg-white/90`}>
                            {roleInfo.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative p-4 flex-1 flex flex-col space-y-3">
                
                <div className="flex items-center p-2 bg-blue-500/10 rounded-lg">
                    <FiMail className="mr-2 text-blue-600 flex-shrink-0" size={14} />
                    <span className="text-xs text-foreground dark:text-background truncate">
                        {user.email}
                    </span>
                </div>

                {user.phone && user.phone !== "No disponible" && (
                    <div className="flex items-center p-2 bg-green-500/10 rounded-lg">
                        <FiPhone className="mr-2 text-green-600 flex-shrink-0" size={14} />
                        <span className="text-xs text-foreground dark:text-background">
                            {user.phone}
                        </span>
                    </div>
                )}

                {user.location && user.location !== "No disponible" && (
                    <div className="flex items-center p-2 bg-purple-500/10 rounded-lg">
                        <FiMapPin className="mr-2 text-purple-600 flex-shrink-0" size={14} />
                        <span className="text-xs text-foreground dark:text-background truncate">
                            {user.location}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg">
                    <span className="text-xs text-foreground dark:text-background font-medium">
                        Suscripción:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${subscriptionInfo.color}`}>
                        {user.suscription}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-accent dark:text-muted">
                        <div className="flex items-center">
                            <FiCalendar className="mr-1" size={12} />
                            <span>Registrado:</span>
                        </div>
                        <span>{formatDate(user.joinedDate)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-accent dark:text-muted">
                        <div className="flex items-center">
                            <FiClock className="mr-1" size={12} />
                            <span>Último acceso:</span>
                        </div>
                        <span>{formatDateTime(user.lastLogin)}</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-2 border border-blue-500/20 mt-auto">
                    <div className="flex items-center justify-center text-xs">
                        <span className="text-blue-600 font-medium">ID: {user.id}</span>
                    </div>
                </div>

                {!isCurrentUser && (
                    <div className="flex items-center gap-2 pt-2">
                        <button
                            onClick={() => onEditUser(user)}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <FiEdit3 className="mr-1" size={12} />
                            Editar
                        </button>
                        <button
                            onClick={() => onDeleteUser(user)}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <FiTrash2 className="mr-1" size={12} />
                            Eliminar
                        </button>
                    </div>
                )}

                {isCurrentUser && (
                    <div className="pt-2">
                        <div className="flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-700">
                            No puedes editarte a ti mismo
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersCardComponent;