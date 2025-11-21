import { FiUsers, FiShield, FiUserCheck, FiUserX, FiUserPlus } from "react-icons/fi";

const AdminUsersHeaderComponent = ({ 
    totalUsers, 
    activeUsers, 
    inactiveUsers,
    recentJoins,
    roleStats
}) => {
    return (
        <>
            <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                            <FiUsers className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center">
                                Gestión de Usuarios
                                <div className="ml-3 bg-white/20 backdrop-blur-sm rounded-full p-2">
                                    <FiShield className="text-white text-lg" />
                                </div>
                            </h1>
                            <p className="text-white/80 text-sm mt-1">
                                Panel de administración - Vista general de todos los usuarios registrados
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Total Usuarios</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">{totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 p-6 rounded-xl border border-green-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Usuarios Activos</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">{activeUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <FiUserCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/5 p-6 rounded-xl border border-red-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Usuarios Inactivos</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">{inactiveUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                            <FiUserX className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/5 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Nuevos (30 días)</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">{recentJoins}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <FiUserPlus className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/5 p-4 rounded-xl border border-emerald-500/20">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-foreground dark:text-background">{roleStats.admin || 0}</p>
                        <p className="text-sm text-emerald-600 font-medium">Administradores</p>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 p-4 rounded-xl border border-blue-500/20">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-foreground dark:text-background">{roleStats.client || 0}</p>
                        <p className="text-sm text-blue-600 font-medium">Clientes</p>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/5 p-4 rounded-xl border border-orange-500/20">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-foreground dark:text-background">{roleStats.walker || 0}</p>
                        <p className="text-sm text-orange-600 font-medium">Paseadores</p>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/5 p-4 rounded-xl border border-teal-500/20">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-foreground dark:text-background">{roleStats.support || 0}</p>
                        <p className="text-sm text-teal-600 font-medium">Soporte</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminUsersHeaderComponent;