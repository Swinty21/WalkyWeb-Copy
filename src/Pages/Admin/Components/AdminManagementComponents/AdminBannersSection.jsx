import { FiPlus, FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import BannerCard from "./BannerCard";

const AdminBannersSection = ({
    banners,
    onCreateBanner,
    onEditBanner,
    onDeleteBanner,
    onToggleStatus,
    loading,
}) => {
    const activeBanners = banners.filter((banner) => banner.isActive);
    const inactiveBanners = banners.filter((banner) => !banner.isActive);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground dark:text-background">
                        Gestión de Banners
                    </h2>
                    <p className="text-accent dark:text-muted mt-1">
                        Administra los banners que aparecen en la página principal
                    </p>
                </div>
                <button
                    onClick={onCreateBanner}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
                >
                    <FiPlus size={16} />
                    Crear Banner
                </button>
            </div>

            {activeBanners.length > 0 && (
                <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-success/20">
                    <div className="flex items-center gap-2 mb-4">
                        <FiEye className="text-success" size={20} />
                        <h3 className="text-xl font-semibold text-foreground dark:text-background">
                            Banners Activos ({activeBanners.length}/3)
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeBanners.map((banner) => (
                            <BannerCard
                                key={banner.id}
                                banner={banner}
                                onEdit={onEditBanner}
                                onDelete={onDeleteBanner}
                                onToggleStatus={onToggleStatus}
                                loading={loading}
                                isActive={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {inactiveBanners.length > 0 && (
                <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-4">
                        <FiEyeOff className="text-accent" size={20} />
                        <h3 className="text-xl font-semibold text-foreground dark:text-background">
                            Banners Inactivos ({inactiveBanners.length})
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inactiveBanners.map((banner) => (
                            <BannerCard
                                key={banner.id}
                                banner={banner}
                                onEdit={onEditBanner}
                                onDelete={onDeleteBanner}
                                onToggleStatus={onToggleStatus}
                                loading={loading}
                                isActive={false}
                            />
                        ))}
                    </div>
                </div>
            )}

            {banners.length === 0 && (
                <div className="text-center py-16">
                    <div className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiImage className="text-4xl text-primary" />
                        </div>
                        <p className="text-xl font-semibold text-foreground dark:text-background mb-2">
                            No hay banners creados
                        </p>
                        <p className="text-accent dark:text-muted mb-4">
                            Crea tu primer banner para comenzar
                        </p>
                        <button
                            onClick={onCreateBanner}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                            Crear Primer Banner
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBannersSection;
