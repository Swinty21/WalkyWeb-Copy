import { UserAPI } from "../API/UserAPI.js";

export const UserDataAccess = {
    async getAllUsers() {
        return await UserAPI.getAllUsers();
    },

    async getUserById(id) {
        return await UserAPI.getUserById(id);
    },

    async updateUser(id, userData) {
        return await UserAPI.updateUser(id, userData);
    },

    async updateUserByAdmin(id, adminUserData) {
        return await UserAPI.updateUserByAdmin(id, adminUserData);
    },

    async deleteUser(id) {
        return await UserAPI.deleteUser(id);
    },

    async getUserStats() {
        return await UserAPI.getUserStats();
    },

    async changeUserPassword(userId, passwordData) {
        return await UserAPI.changeUserPassword(userId, passwordData);
    }
};