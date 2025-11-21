import { BannersDataAccess } from "../DataAccess/BannersDataAccess.js";

export const BannersService = {
    async getAllBanners() {
        const banners = await BannersDataAccess.getAllBanners();
        return banners.map(banner => ({
            id: banner.id,
            title: banner.title,
            description: banner.description,
            image: banner.image,
            isActive: banner.isActive,
            order: banner.order,
            createdAt: banner.createdAt,
            updatedAt: banner.updatedAt
        }));
    },

    async getActiveBanners() {
        const banners = await BannersDataAccess.getActiveBanners();
        return banners.map(banner => ({
            id: banner.id,
            title: banner.title,
            description: banner.description,
            image: banner.image
        }));
    },

    async createBanner(bannerData) {
        if (!bannerData.title || !bannerData.description || !bannerData.image) {
            throw new Error("Título, descripción e imagen son requeridos");
        }

        if (bannerData.title.length > 100) {
            throw new Error("El título no puede tener más de 100 caracteres");
        }

        if (bannerData.description.length > 500) {
            throw new Error("La descripción no puede tener más de 500 caracteres");
        }

        if (!this.isValidUrl(bannerData.image)) {
            throw new Error("La URL de la imagen no es válida");
        }

        const activeBanners = await BannersDataAccess.getActiveBanners();
        if (bannerData.isActive && activeBanners.length >= 3) {
            throw new Error("Solo se pueden tener máximo 3 banners activos");
        }

        const newBanner = await BannersDataAccess.createBanner({
            ...bannerData,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return newBanner;
    },

    async updateBanner(bannerId, bannerData) {
        if (!bannerId) {
            throw new Error("ID del banner es requerido");
        }

        const existingBanner = await BannersDataAccess.getBannerById(bannerId);
        if (!existingBanner) {
            throw new Error("Banner no encontrado");
        }

        if (bannerData.title && bannerData.title.length > 100) {
            throw new Error("El título no puede tener más de 100 caracteres");
        }

        if (bannerData.description && bannerData.description.length > 500) {
            throw new Error("La descripción no puede tener más de 500 caracteres");
        }

        if (bannerData.image && !this.isValidUrl(bannerData.image)) {
            throw new Error("La URL de la imagen no es válida");
        }

        if (bannerData.isActive === true && !existingBanner.isActive) {
            const activeBanners = await BannersDataAccess.getActiveBanners();
            if (activeBanners.length >= 3) {
                throw new Error("Solo se pueden tener máximo 3 banners activos");
            }
        }

        const updatedBanner = await BannersDataAccess.updateBanner(bannerId, {
            ...bannerData,
            updatedAt: new Date()
        });

        return updatedBanner;
    },

    async deleteBanner(bannerId) {
        if (!bannerId) {
            throw new Error("ID del banner es requerido");
        }

        const existingBanner = await BannersDataAccess.getBannerById(bannerId);
        if (!existingBanner) {
            throw new Error("Banner no encontrado");
        }

        await BannersDataAccess.deleteBanner(bannerId);
        
        return { message: "Banner eliminado exitosamente" };
    },

    async toggleBannerStatus(bannerId) {
        if (!bannerId) {
            throw new Error("ID del banner es requerido");
        }

        const existingBanner = await BannersDataAccess.getBannerById(bannerId);
        if (!existingBanner) {
            throw new Error("Banner no encontrado");
        }

        if (!existingBanner.isActive) {
            const activeBanners = await BannersDataAccess.getActiveBanners();
            if (activeBanners.length >= 3) {
                throw new Error("Solo se pueden tener máximo 3 banners activos");
            }
        }

        const updatedBanner = await BannersDataAccess.updateBanner(bannerId, {
            isActive: !existingBanner.isActive,
            updatedAt: new Date()
        });

        return updatedBanner;
    },

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};