import { BannersService } from "../Services/BannersService.js";

export const BannersController = {
    async getAllBanners() {
        return await BannersService.getAllBanners();
    },

    async getActiveBanners() {
        return await BannersService.getActiveBanners();
    },

    async createBanner(bannerData) {
        return await BannersService.createBanner(bannerData);
    },

    async updateBanner(bannerId, bannerData) {
        return await BannersService.updateBanner(bannerId, bannerData);
    },

    async deleteBanner(bannerId) {
        return await BannersService.deleteBanner(bannerId);
    },

    async toggleBannerStatus(bannerId) {
        return await BannersService.toggleBannerStatus(bannerId);
    }
};