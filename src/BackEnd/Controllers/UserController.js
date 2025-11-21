import { UserService } from "../Services/UserService.js";

export const UserController = {
    async fetchAllUsers() {
        try {
            return await UserService.getAllUsers();
        } catch (error) {
            console.error('Error in UserController.fetchAllUsers:', error);
            throw error;
        }
    },

    async fetchUserById(id) {
        try {
            return await UserService.getUserById(id);
        } catch (error) {
            console.error('Error in UserController.fetchUserById:', error);
            throw error;
        }
    },

    async updateUser(id, userData) {
        try {
            return await UserService.updateUser(id, userData);
        } catch (error) {
            console.error('Error in UserController.updateUser:', error);
            throw error;
        }
    },

    async updateUserByAdmin(id, adminUserData) {
        try {
            return await UserService.updateUserByAdmin(id, adminUserData);
        } catch (error) {
            console.error('Error in UserController.updateUserByAdmin:', error);
            throw error;
        }
    },

    async deleteUser(id) {
        try {
            return await UserService.deleteUser(id);
        } catch (error) {
            console.error('Error in UserController.deleteUser:', error);
            throw error;
        }
    },

    async fetchUserStats() {
        try {
            return await UserService.getUserStats();
        } catch (error) {
            console.error('Error in UserController.fetchUserStats:', error);
            throw error;
        }
    },

    async promoteUserToWalker(userId) {
        try {
            return await UserService.promoteUserToWalker(userId);
        } catch (error) {
            console.error('Error in UserController.promoteUserToWalker:', error);
            throw error;
        }
    },

    async changeUserPassword(userId, passwordData) {
        try {
            return await UserService.changeUserPassword(userId, passwordData);
        } catch (error) {
            console.error('Error in UserController.changeUserPassword:', error);
            throw error;
        }
    }
};