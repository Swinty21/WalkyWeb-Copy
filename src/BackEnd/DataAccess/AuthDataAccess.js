import { AuthAPI } from "../API/AuthAPI.js";

export const AuthDataAccess = {
    async login(credentials) {
        return await AuthAPI.login(credentials);
    },

    async register(data) {
        return await AuthAPI.register(data);
    },

    async checkSession(token) {
        return await AuthAPI.checkSession(token);
    },

    async logout() {
        return await AuthAPI.logout();
    },

    async requestPasswordReset(email) {
        return await AuthAPI.forgotPassword(email);
    },

    async verifyResetCode(email, code) {
        return await AuthAPI.verifyResetToken(email, code);
    },

    async resetPasswordWithCode(email, code, newPassword) {
        return await AuthAPI.resetPassword(email, code, newPassword);
    }
};