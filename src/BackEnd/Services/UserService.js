import { UserDataAccess } from "../DataAccess/UserDataAccess.js";

export const UserService = {
    async getAllUsers() {
        const users = await UserDataAccess.getAllUsers();
        
        // Transformar a DTO del frontend
        return users.map(user => ({
            id: user.id,
            fullName: user.name,
            email: user.email.toLowerCase(),
            role: user.role,
            profileImage: user.profileImage || "https://cdn.example.com/default-avatar.png",
            phone: user.phone || "No disponible",
            location: user.location || "No disponible",
            suscription: user.suscription || "Basic",
            status: user.status || "active",
            joinedDate: user.joinedDate || new Date().toISOString(),
            lastLogin: user.lastLogin || new Date().toISOString()
        }));
    },

    async getUserById(id) {
        const user = await UserDataAccess.getUserById(id);
        
        return {
            id: user.id,
            fullName: user.name,
            email: user.email.toLowerCase(),
            role: user.role,
            profileImage: user.profileImage || "https://cdn.example.com/default-avatar.png",
            phone: user.phone || "No disponible",
            location: user.location || "No disponible",
            suscription: user.suscription || "Basic",
            status: user.status || "active",
            joinedDate: user.joinedDate || new Date().toISOString(),
            lastLogin: user.lastLogin || new Date().toISOString()
        };
    },

    async updateUser(id, userData) {
        // Validaciones para actualización completa de usuario
        console.log("UserService.updateUser:", userData);

        if (!userData.name || userData.name.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }

        if (!userData.email || !userData.email.includes("@")) {
            throw new Error("Email inválido");
        }

        if (!userData.role || !["admin", "client", "walker", "support"].includes(userData.role)) {
            throw new Error("Rol inválido");
        }

        const updatedUser = await UserDataAccess.updateUser(id, userData);

        // Transformar respuesta al DTO del frontend
        return {
            id: updatedUser.id,
            fullName: updatedUser.name,
            email: updatedUser.email.toLowerCase(),
            role: updatedUser.role,
            profileImage: updatedUser.profileImage || "https://cdn.example.com/default-avatar.png",
            phone: updatedUser.phone || "No disponible",
            location: updatedUser.location || "No disponible",
            suscription: updatedUser.suscription || "Basic",
            status: updatedUser.status || "active",
            joinedDate: updatedUser.joinedDate || new Date().toISOString(),
            lastLogin: updatedUser.lastLogin || new Date().toISOString()
        };
    },

    async updateUserByAdmin(id, adminUserData) {
        console.log("UserService.updateUserByAdmin:", adminUserData);

        if (!adminUserData.name || adminUserData.name.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }

        if (!adminUserData.role || !["admin", "client", "walker", "support"].includes(adminUserData.role)) {
            throw new Error("Rol inválido");
        }

        if (!adminUserData.status || !["active", "inactive"].includes(adminUserData.status)) {
            throw new Error("Estado inválido");
        }

        if (adminUserData.phone && !/^[\+]?[0-9\-\s\(\)]+$/.test(adminUserData.phone)) {
            throw new Error("Formato de teléfono inválido");
        }

        // Filtrar solo los campos que el admin puede editar
        const allowedFields = {
            name: adminUserData.name.trim(),
            role: adminUserData.role,
            status: adminUserData.status,
            phone: adminUserData.phone ? adminUserData.phone.trim() : "",
            location: adminUserData.location ? adminUserData.location.trim() : "",
            profileImage: adminUserData.profileImage || "https://cdn.example.com/default-avatar.png"
        };

        console.log("Campos permitidos para admin:", allowedFields);

        const updatedUser = await UserDataAccess.updateUserByAdmin(id, allowedFields);

        return {
            id: updatedUser.id,
            fullName: updatedUser.name,
            email: updatedUser.email.toLowerCase(),
            role: updatedUser.role,
            profileImage: updatedUser.profileImage || "https://cdn.example.com/default-avatar.png",
            phone: updatedUser.phone || "No disponible",
            location: updatedUser.location || "No disponible",
            suscription: updatedUser.suscription || "Basic",
            status: updatedUser.status || "active",
            joinedDate: updatedUser.joinedDate || new Date().toISOString(),
            lastLogin: updatedUser.lastLogin || new Date().toISOString()
        };
    },

    async deleteUser(id) {
        if (!id || typeof id !== 'number') {
            throw new Error("ID de usuario inválido");
        }

        return await UserDataAccess.deleteUser(id);
    },

    async getUserStats() {
        return await UserDataAccess.getUserStats();
    },

    async promoteUserToWalker(userId) {
        if (!userId || typeof userId !== 'number') {
            throw new Error("ID de usuario inválido");
        }

        // Obtener el usuario actual
        const currentUser = await UserDataAccess.getUserById(userId);
        
        if (!currentUser) {
            throw new Error("Usuario no encontrado");
        }

        if (currentUser.role === 'walker') {
            throw new Error("El usuario ya tiene rol de walker");
        }

        // Actualizar el rol a walker
        const updatedData = {
            ...currentUser,
            role: 'walker'
        };

        const updatedUser = await UserDataAccess.updateUser(userId, updatedData);

        return {
            success: true,
            message: 'Usuario promovido a walker exitosamente',
            user: {
                id: updatedUser.id,
                fullName: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        };
    },

    async changeUserPassword(userId, passwordData) {
        // Validaciones
        if (!userId || typeof userId !== 'number') {
            throw new Error("ID de usuario inválido");
        }

        if (!passwordData.currentPassword || passwordData.currentPassword.length < 6) {
            throw new Error("La contraseña actual debe tener al menos 6 caracteres");
        }

        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            throw new Error("La nueva contraseña debe ser diferente a la actual");
        }

        try {
            await UserDataAccess.changeUserPassword(userId, passwordData);
            return {
                success: true,
                message: 'Contraseña cambiada exitosamente'
            };
        } catch (error) {
            console.error('Error in UserService.changeUserPassword:', error);
            throw error;
        }
    }
};