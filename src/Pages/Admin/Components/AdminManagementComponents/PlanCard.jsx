import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiLock } from "react-icons/fi";

const PlanCard = ({ plan, onEdit, onDelete, onToggleStatus, loading, isActive, isEditable }) => {
    const getCategoryColor = (category) => {
        switch (category) {
            case "basic": return "from-blue-500 to-cyan-600";
            case "standard": return "from-indigo-500 to-purple-600";
            case "premium": return "from-purple-600 to-pink-600";
            case "vip": return "from-yellow-500 to-orange-500";
            case "exclusive": return "from-emerald-500 to-teal-600";
            default: return "from-gray-500 to-slate-600";
        }
    };

    const formatPrice = (price) => {
        const numericPrice = Number(price);
        if (numericPrice === 0) return "Gratis";
        return `${numericPrice.toFixed(2)}`;
    };

    const calculateDiscountedPrice = (price, discountPercentage) => {
        const numericPrice = Number(price);
        const discount = Number(discountPercentage) || 0;
        if (discount > 0) {
            return numericPrice - (numericPrice * discount / 100);
        }
        return numericPrice;
    };

    const hasDiscount = plan.discount_percentage > 0;
    const originalPrice = Number(plan.price);
    const discountedPrice = calculateDiscountedPrice(plan.price, plan.discount_percentage);

    // Normalizar características desde diferentes formatos
    const normalizeFeatures = (features) => {
        if (!features) return [];
        
        if (Array.isArray(features)) {
            return features.filter(f => f && f.trim());
        }
        
        if (typeof features === 'string') {
            try {
                const parsed = JSON.parse(features);
                if (Array.isArray(parsed)) {
                    return parsed.filter(f => f && f.trim());
                }
            } catch {
                return [features];
            }
        }
        
        if (typeof features === 'object') {
            // Si es un objeto con boolean values, extraer solo los true
            return Object.entries(features)
                .filter(([key, value]) => value === true)
                .map(([key]) => key.replace(/_/g, " "));
        }
        
        return [];
    };

    const featureList = normalizeFeatures(plan.features);

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                isActive
                    ? "border-green-500/30 hover:border-green-500/50"
                    : "border-gray-400/20 hover:border-gray-400/40"
            }`}
        >
            <div className={`bg-gradient-to-r ${getCategoryColor(plan.category)} p-4 text-white relative`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="text-lg font-bold">{plan.name}</h4>
                        <span className="text-sm opacity-90 capitalize">{plan.category}</span>
                    </div>

                    <div className="text-right">
                        <span
                            className={`block mb-1 px-2 py-1 rounded-full text-xs font-bold ${
                                isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                            {isActive ? "Activo" : "Inactivo"}
                        </span>

                        {hasDiscount ? (
                            <div className="flex flex-col items-end">
                                <div className="text-sm line-through opacity-60">
                                    {formatPrice(originalPrice)}
                                </div>
                                <div className="text-2xl font-bold">
                                    {formatPrice(discountedPrice)}
                                </div>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold">{formatPrice(plan.price)}</div>
                        )}
                        
                        {plan.price > 0 && <div className="text-xs opacity-90">/{plan.duration}</div>}
                    </div>
                </div>

                {!isEditable && (
                    <div className="absolute top-2 left-2">
                        <FiLock className="text-white/80" size={16} />
                    </div>
                )}
            </div>

            <div className="p-4">
                <p className="text-sm text-accent dark:text-muted mb-3 line-clamp-2">{plan.description}</p>

                <div className="mb-4">
                    <h5 className="text-sm font-semibold text-foreground dark:text-background mb-2">
                        Características ({featureList.length || 0})
                    </h5>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                        {featureList.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                                <span className="text-xs text-accent dark:text-muted line-clamp-1 capitalize">{feature}</span>
                            </div>
                        ))}
                        {featureList.length > 3 && (
                            <span className="text-xs text-accent dark:text-muted italic">
                                +{featureList.length - 3} más...
                            </span>
                        )}
                        {featureList.length === 0 && (
                            <span className="text-xs text-accent dark:text-muted italic">
                                Sin características definidas
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-xs text-accent dark:text-muted mb-4">
                    <p><strong>Max Paseos:</strong> {plan.max_walks === -1 ? 'Ilimitados' : plan.max_walks}</p>
                    <p><strong>Soporte:</strong> {plan.support_level}</p>
                    <p><strong>Cancelación:</strong> {plan.cancellation_policy}</p>
                </div>

                {plan.created_at && (
                    <div className="text-xs text-accent dark:text-muted mb-4">
                        <p>Creado: {new Date(plan.created_at).toLocaleDateString()}</p>
                        <p>Actualizado: {new Date(plan.updated_at).toLocaleDateString()}</p>
                    </div>
                )}

                {isEditable ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(plan)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                        >
                            <FiEdit2 size={14} />
                            Editar
                        </button>

                        <button
                            onClick={() => onToggleStatus(plan.plan_id)}
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
                            onClick={() => onDelete(plan.plan_id)}
                            disabled={loading}
                            className="flex items-center justify-center p-2 rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                            title="Eliminar"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-500/10 text-blue-600 border-2 border-blue-500/20">
                        <FiLock size={14} className="mr-2" />
                        Plan del sistema
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanCard;