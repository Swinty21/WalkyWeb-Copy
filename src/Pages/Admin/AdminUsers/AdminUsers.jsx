import { useState, useEffect } from "react";
import { FiUsers, FiShield, FiUserPlus } from "react-icons/fi";
import { UserController } from '../../../BackEnd/Controllers/UserController';
import { useUser } from "../../../BackEnd/Context/UserContext";

import AdminUsersHeaderComponent from '../Components/AdminUsersComponents/AdminUsersHeaderComponent';
import AdminUsersCardComponent from '../Components/AdminUsersComponents/AdminUsersCardComponent';
import AdminEditUserModal from '../Components/AdminUsersComponents/AdminEditUserModal';
import AdminDeleteUserModal from '../Components/AdminUsersComponents/AdminDeleteUserModal';
import AdminUsersFilter from '../Filters/AdminUsersFilter/AdminUsersFilter';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userStats, setUserStats] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subscriptionFilter, setSubscriptionFilter] = useState("all");

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Obtener el usuario logueado
    const currentUser = useUser();
    const currentUserId = currentUser?.id;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [usersData, statsData] = await Promise.all([
                    UserController.fetchAllUsers(),
                    UserController.fetchUserStats()
                ]);
                
                setUsers(usersData);
                setUserStats(statsData);
            } catch (err) {
                setError('Error loading users: ' + err.message);
                console.error('Error loading users:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [refreshTrigger]);

    const handleEditUser = (user) => {
        // Prevenir que el usuario se edite a sí mismo
        if (user.id === currentUserId) {
            alert("No puedes editarte a ti mismo");
            return;
        }
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDeleteUser = (user) => {
        // Prevenir que el usuario se elimine a sí mismo
        if (user.id === currentUserId) {
            alert("No puedes eliminarte a ti mismo");
            return;
        }
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleSaveEditUser = async (userId, userData) => {
        try {
            console.log("AdminUsers - Guardando con updateUserByAdmin:", { userId, userData });
            
            await UserController.updateUserByAdmin(userId, userData);
            setRefreshTrigger(prev => prev + 1);
            setShowEditModal(false);
            setSelectedUser(null);
            alert("Usuario actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert(`Error al actualizar el usuario: ${error.message}`);
        }
    };

    const handleConfirmDeleteUser = async (userId) => {
        try {
            await UserController.deleteUser(userId);
            setRefreshTrigger(prev => prev + 1);
            setShowDeleteModal(false);
            setSelectedUser(null);
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert(`Error al eliminar el usuario: ${error.message}`);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = searchQuery === "" || 
            user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;
        const matchesSubscription = subscriptionFilter === "all" || user.suscription === subscriptionFilter;

        return matchesSearch && matchesRole && matchesStatus && matchesSubscription;
    });

    const uniqueRoles = [...new Set(users.map(user => user.role).filter(Boolean))];
    const uniqueSubscriptions = [...new Set(users.map(user => user.suscription).filter(Boolean))];

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg text-foreground dark:text-background ml-4">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-danger">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
            <div className=" mx-auto">
                
                <AdminUsersHeaderComponent 
                    totalUsers={userStats.total || 0}
                    activeUsers={userStats.active || 0}
                    inactiveUsers={userStats.inactive || 0}
                    recentJoins={userStats.recentJoins || 0}
                    roleStats={userStats.byRole || {}}
                />

                <AdminUsersFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    subscriptionFilter={subscriptionFilter}
                    setSubscriptionFilter={setSubscriptionFilter}
                    uniqueRoles={uniqueRoles}
                    uniqueSubscriptions={uniqueSubscriptions}
                />

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                        <p className="text-danger font-medium">{error}</p>
                    </div>
                )}

                {filteredUsers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiUsers className="text-4xl text-blue-600" />
                            </div>
                            <p className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                No se encontraron usuarios
                            </p>
                            <p className="text-accent dark:text-muted">
                                Ajusta los filtros para ver más resultados
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-sm text-accent dark:text-muted">
                                Mostrando {filteredUsers.length} de {users.length} usuarios
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
                            {filteredUsers.map((user) => (
                                <AdminUsersCardComponent 
                                    key={user.id}
                                    user={user}
                                    onEditUser={handleEditUser}
                                    onDeleteUser={handleDeleteUser}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    </>
                )}

                <AdminEditUserModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                    }}
                    userData={selectedUser}
                    onSave={handleSaveEditUser}
                />

                <AdminDeleteUserModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedUser(null);
                    }}
                    userData={selectedUser}
                    onConfirm={handleConfirmDeleteUser}
                />
            </div>
        </div>
    );
};

export default AdminUsers;