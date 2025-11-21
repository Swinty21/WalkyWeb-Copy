import { BannersAPI } from "../API/BannersAPI.js";

export const BannersDataAccess = {
    async getAllBanners() {
        return await BannersAPI.getAllBanners();
    },

    async getActiveBanners() {
        return await BannersAPI.getActiveBanners();
    },

    async getBannerById(bannerId) {
        return await BannersAPI.getBannerById(bannerId);
    },

    async createBanner(bannerData) {
        return await BannersAPI.createBanner(bannerData);
    },

    async updateBanner(bannerId, bannerData) {
        return await BannersAPI.updateBanner(bannerId, bannerData);
    },

    async deleteBanner(bannerId) {
        return await BannersAPI.deleteBanner(bannerId);
    }
};