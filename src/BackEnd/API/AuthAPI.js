import apiClient from '../ApiClient.js';

export const AuthAPI = {
    async login(credentials) {
        console.log("Simulando llamada API login:", credentials);
        
        try {
            const response = await apiClient.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });

            const userData = response.data.user;
            
            if (userData.token) {
                apiClient.setToken(userData.token);
            }

            return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                password: credentials.password,
                role: userData.role,
                profileImage: userData.profileImage || userData.profile_image,
                suscription: userData.suscription || userData.subscription || 'Basic',
                phone: userData.phone || "",
                location: userData.location || "",
                joinedDate: userData.joinedDate || userData.joined_date,
                status: userData.status,
                lastLogin: userData.lastLogin || userData.last_login,
                token: userData.token
            };
        } catch (error) {
            console.error("Error en login:", error);
            throw new Error("Credenciales inválidas o cuenta inactiva");
        }
    },

    async register(data) {
        console.log("Simulando llamada API register:", data);
        
        try {
            const response = await apiClient.post('/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone || "",
                location: data.location || "",
                role: data.role || "client"
            });

            const userData = response.data.user;
            
            if (userData.token) {
                apiClient.setToken(userData.token);
            }

            return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                password: data.password,
                role: userData.role,
                profileImage: userData.profileImage || userData.profile_image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                suscription: "Basic",
                phone: userData.phone || "",
                location: userData.location || "",
                joinedDate: userData.joinedDate || userData.joined_date,
                status: "active",
                lastLogin: userData.lastLogin || userData.last_login,
                token: userData.token
            };
        } catch (error) {
            console.error("Error en register:", error);
            if (error.message.includes('email ya está registrado')) {
                throw new Error("El email ya está registrado");
            }
            throw new Error(error.message || 'Error al registrar usuario');
        }
    },

    async checkSession(token) {
        console.log("Simulando verificación de sesión con token:", token);
        
        try {
            const response = await apiClient.post('/auth/check-session', null, {
                headers: {
                    Authorization: `Bearer ${token || apiClient.getToken()}`
                }
            });

            const userData = response.data.user;
            
            if (userData.token) {
                apiClient.setToken(userData.token);
            }

            return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                profileImage: userData.profileImage || userData.profile_image,
                suscription: userData.suscription || userData.subscription || 'Basic',
                phone: userData.phone || "",
                location: userData.location || "",
                joinedDate: userData.joinedDate || userData.joined_date,
                status: userData.status,
                lastLogin: userData.lastLogin || userData.last_login,
                token: userData.token || token
            };
        } catch (error) {
            console.error("Error en checkSession:", error);
            apiClient.removeToken();
            throw new Error("Sesión inválida o expirada");
        }
    },

    async logout() {
        console.log("Simulando cierre de sesión");
        
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error("Error en logout:", error);
        }
        
        apiClient.removeToken();
        return { success: true };
    },

    async getAllUsers() {
        console.log("Simulando obtener todos los usuarios");
        
        try {
            const response = await apiClient.get('/users');
            
            return response.data.users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage || user.profile_image,
                suscription: user.suscription || user.subscription || 'Basic',
                phone: user.phone || "",
                location: user.location || "",
                joinedDate: user.joinedDate || user.joined_date,
                status: user.status,
                lastLogin: user.lastLogin || user.last_login
            }));
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            throw new Error(error.message || 'Error al obtener usuarios');
        }
    },

    async updateUser(id, userData) {
        console.log("Simulando actualización de usuario completa:", { id, userData });
        
        try {
            console.log("updateUser AUTH - Actualización completa");
            console.log(userData);
            const response = await apiClient.put(`/users/${id}`, userData);

            const updatedUser = response.data.user;
            
            return {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage || updatedUser.profile_image,
                suscription: updatedUser.suscription || updatedUser.subscription || 'Basic',
                phone: updatedUser.phone || "",
                location: updatedUser.location || "",
                joinedDate: updatedUser.joinedDate || updatedUser.joined_date,
                status: updatedUser.status,
                lastLogin: updatedUser.lastLogin || updatedUser.last_login
            };
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            if (error.message.includes('email ya está en uso')) {
                throw new Error("El email ya está en uso por otro usuario");
            }
            if (error.message.includes('Usuario no encontrado')) {
                throw new Error("Usuario no encontrado");
            }
            throw new Error(error.message || 'Error al actualizar usuario');
        }
    },

    async updateUserByAdmin(id, adminUserData) {
        console.log("Simulando actualización de usuario por admin:", { id, adminUserData });
        
        try {
            console.log("updateUserByAdmin AUTH - Solo campos permitidos para admin");
            console.log(adminUserData);
            
            const response = await apiClient.put(`/users/adminUpdate/${id}`, {
                ...adminUserData,
                isAdminUpdate: true 
            });

            const updatedUser = response.data.user;
            
            return {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage || updatedUser.profile_image,
                suscription: updatedUser.suscription || updatedUser.subscription || 'Basic',
                phone: updatedUser.phone || "",
                location: updatedUser.location || "",
                joinedDate: updatedUser.joinedDate || updatedUser.joined_date,
                status: updatedUser.status,
                lastLogin: updatedUser.lastLogin || updatedUser.last_login
            };
        } catch (error) {
            console.error("Error actualizando usuario por admin:", error);
            if (error.message.includes('Usuario no encontrado')) {
                throw new Error("Usuario no encontrado");
            }
            if (error.message.includes('sin permisos')) {
                throw new Error("No tienes permisos para realizar esta acción");
            }
            throw new Error(error.message || 'Error al actualizar usuario');
        }
    },

    async deleteUser(id) {
        console.log("Simulando eliminación de usuario:", id);
        
        try {
            const response = await apiClient.delete(`/users/${id}`);

            return {
                success: response.data.success,
                message: "Usuario eliminado correctamente"
            };
        } catch (error) {
            console.error("Error eliminando usuario:", error);
            if (error.message.includes('último administrador')) {
                throw new Error("No se puede eliminar el último administrador activo");
            }
            if (error.message.includes('Usuario no encontrado')) {
                throw new Error("Usuario no encontrado");
            }
            throw new Error(error.message || 'Error al eliminar usuario');
        }
    },

    async forgotPassword(email) {
        console.log("Simulando solicitud de recuperación de contraseña:", email);
        
        try {
            const response = await apiClient.post('/auth/forgot-password', {
                email: email.toLowerCase()
            });

            return {
                success: response.data.success || true,
                message: response.data.message || "Código enviado correctamente"
            };
        } catch (error) {
            console.error("Error en forgot password:", error);
            throw new Error(error.message || 'Error al solicitar recuperación de contraseña');
        }
    },

    async verifyResetToken(email, token) {
        console.log("Simulando verificación de código:", { email, token });
        
        try {
            const response = await apiClient.post('/auth/verify-reset-token', {
                email: email.toLowerCase(),
                token: token
            });

            return {
                valid: response.data.valid || true,
                message: response.data.message || "Código verificado correctamente"
            };
        } catch (error) {
            console.error("Error verificando código:", error);
            throw new Error(error.message || 'Código inválido o expirado');
        }
    },

    async resetPassword(email, token, newPassword) {
        console.log("Simulando cambio de contraseña con token");
        
        try {
            const response = await apiClient.post('/auth/reset-password', {
                email: email.toLowerCase(),
                token: token,
                newPassword: newPassword
            });

            return {
                success: response.data.success || true,
                message: response.data.message || "Contraseña actualizada correctamente"
            };
        } catch (error) {
            console.error("Error cambiando contraseña:", error);
            throw new Error(error.message || 'Error al cambiar contraseña');
        }
    }
};