import { FiTrash2, FiX, FiAlertTriangle, FiImage, FiDollarSign } from "react-icons/fi";

const ConfirmationDeleteModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isLoading,
    itemData,
    itemType = 'plan'
}) => {
    if (!isOpen || !itemData) return null;

    const getItemConfig = () => {
        console.log(itemData);
        switch (itemType) {
            case 'banner':
                return {
                    title: 'Eliminar Banner',
                    subtitle: 'Esta acción no se puede deshacer',
                    icon: FiImage,
                    headerGradient: 'from-red-600 to-pink-600',
                    itemName: itemData.title,
                    itemId: itemData.id,
                    itemDetails: [
                        { label: 'ID', value: itemData.id },
                        { label: 'URL', value: itemData.image || 'N/A' },
                        { label: 'Descripción', value: itemData.description || 'N/A'},
                        { label: 'Estado', value: itemData.isActive ? 'Activo' : 'Inactivo' }
                    ],
                    warnings: [
                        'El banner desaparecerá inmediatamente de la aplicación',
                        'Los usuarios no podrán ver este banner',
                        'No se podrá recuperar la información del banner',
                        'Se liberará un espacio para crear nuevos banners'
                    ],
                    buttonText: 'Eliminar Banner'
                };
            case 'plan':
            default:
                return {
                    title: 'Eliminar Plan',
                    subtitle: 'Esta acción no se puede deshacer',
                    icon: FiDollarSign,
                    headerGradient: 'from-red-600 to-pink-600',
                    itemName: itemData.name,
                    itemId: itemData.plan_id,
                    itemDetails: [
                        { label: 'ID', value: itemData.plan_id },
                        { label: 'Precio', value: `$${itemData.price} / ${itemData.duration}` },
                        { label: 'Estado', value: itemData.is_active ? 'Activo' : 'Inactivo' }
                    ],
                    warnings: [
                        'Los usuarios suscritos a este plan no podrán renovar',
                        'Las suscripciones activas continuarán hasta su vencimiento',
                        'No se podrá recuperar la información del plan',
                        'Se liberará un espacio para crear nuevos planes'
                    ],
                    buttonText: 'Eliminar Plan'
                };
        }
    };

    const config = getItemConfig();
    const IconComponent = config.icon;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white/95 dark:bg-foreground/95 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                
                <div className={`bg-gradient-to-r ${config.headerGradient} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <FiAlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{config.title}</h2>
                                <p className="text-white/80 text-sm mt-1">{config.subtitle}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiTrash2 className="text-red-600 dark:text-red-400" size={24} />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-2">
                            ¿Estás seguro de eliminar este {itemType === 'banner' ? 'banner' : 'plan'}?
                        </h3>
                        
                        <p className="text-accent dark:text-muted text-sm mb-4">
                            Esta acción eliminará permanentemente el {itemType === 'banner' ? 'banner' : 'plan'} y no se podrá recuperar.
                        </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                                    <IconComponent className="text-red-600 dark:text-red-400" size={12} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm mb-1">
                                    {itemType === 'banner' ? 'Banner' : 'Plan'} a eliminar:
                                </h4>
                                <div className="text-red-700 dark:text-red-400 text-sm">
                                    <p className="font-medium">{config.itemName}</p>
                                    
                                    {itemType === 'banner' && itemData.image ? (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs opacity-75">Vista previa:</span>
                                                <img 
                                                    src={itemData.image} 
                                                    alt="Preview banner"
                                                    className="w-16 h-10 object-cover rounded border border-red-300 dark:border-red-700"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                            {config.itemDetails.filter(detail => detail.label !== 'URL').map((detail, index) => (
                                                <p key={index} className="text-xs opacity-75">
                                                    {detail.label}: {detail.value}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            {config.itemDetails.map((detail, index) => (
                                                <p key={index} className="text-xs opacity-75">
                                                    {detail.label}: {detail.value}
                                                </p>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-3">
                            <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                            <div className="text-yellow-800 dark:text-yellow-300 text-sm">
                                <p className="font-medium mb-1">Consideraciones importantes:</p>
                                <ul className="text-xs space-y-1 opacity-90">
                                    {config.warnings.map((warning, index) => (
                                        <li key={index}>• {warning}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/50 dark:bg-foreground/50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        <FiTrash2 size={16} />
                        {config.buttonText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationDeleteModal;