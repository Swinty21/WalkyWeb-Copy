import { AuthAPI } from './AuthAPI.js';
import apiClient from '../ApiClient.js';
import { SettingsAPI } from './SettingsAPI.js';

export const UserAPI = {
    async getAllUsers() {
        console.log("UsersAPI - Obteniendo todos los usuarios");
        return await AuthAPI.getAllUsers();
    },

    async getUserById(id) {
        console.log("UsersAPI - Obteniendo usuario por ID:", id);
        
        try {
            const response = await apiClient.get(`/users/${id}`);
            const user = response.data.user;
            
            let userSubscription = 'free';
            try {
                const subscription = await SettingsAPI.getUserSubscription(id);
                if (subscription && subscription.plan) {
                    userSubscription = subscription.plan;
                }
            } catch (error) {
                console.error(`Error obteniendo suscripción para usuario ${id}:`, error);
            }
            
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage || user.profile_image,
                suscription: userSubscription,
                phone: user.phone || "",
                location: user.location || "",
                joinedDate: user.joinedDate || user.joined_date,
                status: user.status,
                lastLogin: user.lastLogin || user.last_login
            };
        } catch (error) {
            console.error("Error obteniendo usuario por ID:", error);
            throw new Error("Usuario no encontrado");
        }
    },

    async updateUser(id, userData) {
        console.log("UsersAPI - Actualizando usuario:", { id, userData });
        return await AuthAPI.updateUser(id, userData);
    },

    async updateUserByAdmin(id, adminUserData) {
        console.log("UsersAPI - Actualizando usuario por admin:", { id, adminUserData });
        return await AuthAPI.updateUserByAdmin(id, adminUserData);
    },

    async deleteUser(id) {
        console.log("UsersAPI - Eliminando usuario:", id);
        return await AuthAPI.deleteUser(id);
    },

    async getUserStats() {
        console.log("UsersAPI - Obteniendo estadísticas de usuarios");
        
        try {
            const response = await apiClient.get('/users/stats');
            
            const stats = response.data.stats;
            
            return {
                total: stats.total,
                active: stats.active,
                inactive: stats.inactive,
                byRole: {
                    admin: stats.byRole.admin,
                    client: stats.byRole.client,
                    walker: stats.byRole.walker,
                    support: stats.byRole.support
                },
                recentJoins: stats.recentJoins
            };
        } catch (error) {
            console.error("Error obteniendo estadísticas:", error);
            
            try {
                const users = await this.getAllUsers();
                
                const stats = {
                    total: users.length,
                    active: users.filter(u => u.status === 'active').length,
                    inactive: users.filter(u => u.status === 'inactive').length,
                    byRole: {
                        admin: users.filter(u => u.role === 'admin').length,
                        client: users.filter(u => u.role === 'client').length,
                        walker: users.filter(u => u.role === 'walker').length,
                        support: users.filter(u => u.role === 'support').length
                    },
                    recentJoins: users.filter(u => {
                        const joinDate = new Date(u.joinedDate);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return joinDate > thirtyDaysAgo;
                    }).length
                };

                return stats;
            } catch (fallbackError) {
                console.error("Error en fallback de estadísticas:", fallbackError);
                throw new Error('Error al obtener estadísticas de usuarios');
            }
        }
    },

    async changeUserPassword(userId, passwordData) {
        console.log("UserAPI - Cambiando contraseña para usuario:", userId);
        
        try {
            const response = await apiClient.put(`/users/${userId}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            return {
                success: response.data.success,
                message: response.data.message || "Contraseña cambiada correctamente"
            };
        } catch (error) {
            console.error("Error cambiando contraseña:", error);
            
            if (error.message.includes('contraseña actual incorrecta') || 
                error.message.includes('current password')) {
                throw new Error("La contraseña actual es incorrecta");
            }
            
            if (error.message.includes('Usuario no encontrado')) {
                throw new Error("Usuario no encontrado");
            }
            
            if (error.message.includes('misma contraseña') || 
                error.message.includes('same password')) {
                throw new Error("La nueva contraseña debe ser diferente a la actual");
            }
            
            throw new Error(error.message || 'Error al cambiar la contraseña');
        }
    }
};