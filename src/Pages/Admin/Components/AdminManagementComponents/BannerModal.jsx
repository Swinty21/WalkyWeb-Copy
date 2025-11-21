import { useState, useEffect } from "react";
import { FiX, FiImage, FiType, FiFileText, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const BannerModal = ({ isOpen, onClose, onSave, bannerData, isLoading, activeBannersCount }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        isActive: false
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (bannerData) {
            setFormData({
                title: bannerData.title || '',
                description: bannerData.description || '',
                image: bannerData.image || '',
                isActive: bannerData.isActive || false
            });
            setImagePreview(bannerData.image || '');
        } else {
            setFormData({ title: '', description: '', image: '', isActive: false });
            setImagePreview('');
        }
        setErrors({});
    }, [bannerData, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'El título es requerido';
        else if (formData.title.length > 100) newErrors.title = 'El título no puede tener más de 100 caracteres';

        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        else if (formData.description.length > 500) newErrors.description = 'La descripción no puede tener más de 500 caracteres';

        if (!formData.image.trim()) newErrors.image = 'La URL de la imagen es requerida';
        else {
            try { new URL(formData.image); } 
            catch { newErrors.image = 'Debe ser una URL válida'; }
        }

        if (formData.isActive && !bannerData?.isActive && activeBannersCount >= 3) {
            newErrors.isActive = 'Solo se pueden tener máximo 3 banners activos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (value) => {
        setFormData(prev => ({ ...prev, image: value }));
        try { new URL(value); setImagePreview(value); } 
        catch { setImagePreview(''); }
    };

    const handleSubmit = () => { if (validateForm()) onSave(formData); };

    if (!isOpen) return null;

    const canActivate = !formData.isActive && (bannerData?.isActive || activeBannersCount < 3);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/50 dark:bg-foreground/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{bannerData ? 'Editar Banner' : 'Crear Banner'}</h2>
                            <p className="text-white/80 text-sm mt-1">{bannerData ? 'Modifica la información del banner' : 'Crea un nuevo banner para la página principal'}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiType size={16} /> Título
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 ${
                                errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                            placeholder="Ingresa el título del banner"
                            maxLength={100}
                        />
                        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                        <p className="text-xs text-accent dark:text-muted mt-1">{formData.title.length}/100 caracteres</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiFileText size={16} /> Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 resize-none ${
                                errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                            placeholder="Describe el contenido del banner"
                            maxLength={500}
                        />
                        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                        <p className="text-xs text-accent dark:text-muted mt-1">{formData.description.length}/500 caracteres</p>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiImage size={16} /> URL de la Imagen
                        </label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => handleImageChange(e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 ${
                                errors.image ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                        <p className="text-xs text-accent dark:text-muted mt-1">Ingresa una URL válida de imagen (JPG, PNG, WebP)</p>
                    </div>

                    {/* Preview */}
                    {imagePreview && (
                        <div>
                            <label className="text-sm font-medium text-foreground dark:text-background mb-2 block">Vista Previa</label>
                            <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview('')} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h4 className="font-semibold">{formData.title || 'Título del Banner'}</h4>
                                    <p className="text-sm opacity-90">{formData.description || 'Descripción del banner'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Toggle */}
                    <div>
                        <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white/50 dark:bg-foreground/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${formData.isActive ? 'bg-success/20' : 'bg-gray-200'}`}>
                                    {formData.isActive ? <FiToggleRight className="text-success" size={20} /> : <FiToggleLeft className="text-gray-500" size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground dark:text-background">Banner Activo</h4>
                                    <p className="text-sm text-accent dark:text-muted">{formData.isActive ? 'Se mostrará en la página principal' : 'No se mostrará a los usuarios'}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { if (canActivate || formData.isActive) setFormData(prev => ({ ...prev, isActive: !prev.isActive })); }}
                                disabled={!canActivate && !formData.isActive}
                                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${formData.isActive ? 'bg-success' : 'bg-gray-300'} ${(!canActivate && !formData.isActive) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </label>
                        {errors.isActive && <p className="text-red-600 text-sm mt-1">{errors.isActive}</p>}
                        {!canActivate && !formData.isActive && (
                            <p className="text-warning text-sm mt-1">No se puede activar: ya hay 3 banners activos (máximo permitido)</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white/50 dark:bg-foreground/50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {bannerData ? 'Actualizar' : 'Crear'} Banner
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerModal;
