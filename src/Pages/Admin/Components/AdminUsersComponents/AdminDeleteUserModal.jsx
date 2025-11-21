import { FiX, FiTrash2, FiAlertTriangle, FiShield } from "react-icons/fi";

const AdminDeleteUserModal = ({ isOpen, onClose, userData, onConfirm }) => {
    if (!isOpen || !userData) return null;

    const handleConfirm = () => {
        onConfirm(userData.id);
    };

    const getRoleInfo = (role) => {
        switch (role) {
            case "admin":
                return { name: "Administrador", color: "text-red-600", bgColor: "bg-red-100" };
            case "client":
                return { name: "Cliente", color: "text-blue-600", bgColor: "bg-blue-100" };
            case "walker":
                return { name: "Paseador", color: "text-green-600", bgColor: "bg-green-100" };
            case "support":
                return { name: "Soporte", color: "text-purple-600", bgColor: "bg-purple-100" };
            default:
                return { name: "Usuario", color: "text-gray-600", bgColor: "bg-gray-100" };
        }
    };

    const roleInfo = getRoleInfo(userData.role);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-lg shadow-xl w-full max-w-md border border-red-500/20">
                
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-muted bg-gradient-to-r from-red-500/10 to-pink-500/5">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <FiTrash2 className="text-red-600 text-sm" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading text-foreground dark:text-background">
                                Eliminar Usuario
                            </h2>
                            <p className="text-xs text-accent dark:text-muted">
                                Esta acción no se puede deshacer
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted/30 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-foreground dark:text-background" />
                    </button>
                </div>

                <div className="p-6">
                    
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <FiAlertTriangle className="text-red-600 text-xl mr-3 flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                                    ¿Estás seguro que deseas eliminar este usuario?
                                </p>
                                <p className="text-red-600 dark:text-red-300 text-sm">
                                    Esta acción eliminará permanentemente todos los datos del usuario y no podrá revertirse.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-foreground dark:text-background mb-3">
                            Información del usuario a eliminar:
                        </h3>
                        
                        <div className="flex items-center space-x-4 mb-4">
                            <img
                                src={userData.profileImage}
                                alt={userData.fullName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                            />
                            <div>
                                <h4 className="font-semibold text-foreground dark:text-background text-lg">
                                    {userData.fullName}
                                </h4>
                                <p className="text-accent dark:text-muted text-sm">
                                    {userData.email}
                                </p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color} ${roleInfo.bgColor} mt-1`}>
                                    {roleInfo.name}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-accent dark:text-muted">ID:</span>
                                <p className="font-medium text-foreground dark:text-background">{userData.id}</p>
                            </div>
                            <div>
                                <span className="text-accent dark:text-muted">Estado:</span>
                                <p className={`font-medium ${userData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                    {userData.status === 'active' ? 'Activo' : 'Inactivo'}
                                </p>
                            </div>
                            <div>
                                <span className="text-accent dark:text-muted">Suscripción:</span>
                                <p className="font-medium text-foreground dark:text-background">{userData.suscription}</p>
                            </div>
                            <div>
                                <span className="text-accent dark:text-muted">Registrado:</span>
                                <p className="font-medium text-foreground dark:text-background">
                                    {formatDate(userData.joinedDate)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {userData.role === 'admin' && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <FiShield className="text-yellow-600 text-lg mr-2 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                        Advertencia: Usuario Administrador
                                    </p>
                                    <p className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                                        Este usuario tiene permisos de administrador. Asegúrate de que haya otros administradores activos antes de eliminarlo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-border dark:border-muted text-foreground dark:text-background rounded-lg hover:bg-muted/30 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                        >
                            <FiTrash2 className="mr-2 w-4 h-4" />
                            Eliminar Usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDeleteUserModal;