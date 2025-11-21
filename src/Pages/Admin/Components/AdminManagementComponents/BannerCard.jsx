import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const BannerCard = ({ banner, onEdit, onDelete, onToggleStatus, loading, isActive }) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                isActive ? "border-green-500/30 hover:border-green-500/50" : "border-gray-400/20 hover:border-gray-400/40"
            }`}
        >
            <div className="relative h-32 overflow-hidden">
                <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Badge de estado */}
                <div className="absolute top-2 right-2 z-10">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isActive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                        }`}
                    >
                        {isActive ? "Activo" : "Inactivo"}
                    </span>
                </div>
            </div>

            <div className="p-4 flex flex-col space-y-3">
                <h4 className="text-lg font-semibold text-foreground dark:text-background line-clamp-1">
                    {banner.title}
                </h4>
                <p className="text-sm text-accent dark:text-muted line-clamp-2">
                    {banner.description}
                </p>

                <div className="text-xs text-accent dark:text-muted">
                    <p>Creado: {new Date(banner.createdAt).toLocaleDateString()}</p>
                    <p>Actualizado: {new Date(banner.updatedAt).toLocaleDateString()}</p>
                </div>

                {/* Botones */}
                <div className="flex items-center gap-2 mt-auto">
                    <button
                        onClick={() => onEdit(banner)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                    >
                        <FiEdit2 size={14} />
                        Editar
                    </button>

                    <button
                        onClick={() => onToggleStatus(banner.id)}
                        disabled={loading}
                        className={`flex items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 ${
                            isActive
                                ? "border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                                : "border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                        }`}
                        title={isActive ? "Desactivar" : "Activar"}
                    >
                        {isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                    </button>

                    <button
                        onClick={() => onDelete(banner.id)}
                        disabled={loading}
                        className="flex items-center justify-center p-2 rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                        title="Eliminar"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerCard;
