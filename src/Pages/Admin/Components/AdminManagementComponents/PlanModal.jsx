import { useState, useEffect } from "react";
import { FiX, FiDollarSign, FiType, FiFileText, FiToggleLeft, FiToggleRight, FiPlus, FiTrash2, FiTag, FiClock, FiLayers } from "react-icons/fi";

const PlanModal = ({ isOpen, onClose, onSave, planData, isLoading, activePlansCount }) => {
    const [formData, setFormData] = useState({
        plan_id: '',
        name: '',
        price: 0,
        duration: 'monthly',
        category: 'standard',
        description: '',
        max_walks: 0,
        features: [''],
        support_level: 'email',
        cancellation_policy: 'none',
        discount_percentage: 0,
        is_active: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (planData) {
            let normalizedFeatures = [''];
            if (planData.features) {
                if (Array.isArray(planData.features)) {
                    normalizedFeatures = planData.features.length > 0 ? [...planData.features] : [''];
                } else if (typeof planData.features === 'string') {
                    try {
                        const parsedFeatures = JSON.parse(planData.features);
                        normalizedFeatures = Array.isArray(parsedFeatures) && parsedFeatures.length > 0 ? parsedFeatures : [''];
                    } catch {
                        normalizedFeatures = [planData.features];
                    }
                } else if (typeof planData.features === 'object') {
                    normalizedFeatures = Object.entries(planData.features)
                        .filter(([key, value]) => value === true)
                        .map(([key]) => key.replace(/_/g, ' '));
                    if (normalizedFeatures.length === 0) normalizedFeatures = [''];
                }
            }

            setFormData({
                plan_id: planData.plan_id || '',
                name: planData.name || '',
                price: Number(planData.price) || 0,
                duration: planData.duration || 'monthly',
                category: planData.category || 'standard',
                description: planData.description || '',
                max_walks: Number(planData.max_walks) || 0,
                features: normalizedFeatures,
                support_level: planData.support_level || 'email',
                cancellation_policy: planData.cancellation_policy || 'none',
                discount_percentage: Number(planData.discount_percentage) || 0,
                is_active: Boolean(planData.is_active)
            });
        } else {
            setFormData({
                plan_id: '',
                name: '',
                price: 0,
                duration: 'monthly',
                category: 'standard',
                description: '',
                max_walks: 0,
                features: [''],
                support_level: 'email',
                cancellation_policy: 'none',
                discount_percentage: 0,
                is_active: false
            });
        }
        setErrors({});
    }, [planData, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.plan_id.trim()) newErrors.plan_id = 'El ID del plan es requerido';
        else if (formData.plan_id.length < 3) newErrors.plan_id = 'El ID debe tener al menos 3 caracteres';
        else if (!/^[a-zA-Z0-9_-]+$/.test(formData.plan_id)) newErrors.plan_id = 'El ID solo puede contener letras, números, guiones y guiones bajos';

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        else if (formData.name.length < 3) newErrors.name = 'El nombre debe tener al menos 3 caracteres';

        if (formData.price < 0) newErrors.price = 'El precio no puede ser negativo';

        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        else if (formData.description.length > 500) newErrors.description = 'La descripción no puede tener más de 500 caracteres';

        if (formData.max_walks < -1) newErrors.max_walks = 'El número de paseos no puede ser menor a -1 (usa -1 para ilimitado)';

        const validFeatures = formData.features.filter(feature => feature.trim());
        if (validFeatures.length === 0) newErrors.features = 'Debe incluir al menos una característica';

        if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
            newErrors.discount_percentage = 'El descuento debe estar entre 0 y 100%';
        }

        if (formData.is_active && !planData?.is_active && activePlansCount >= 3) {
            newErrors.is_active = 'Solo se pueden tener máximo 3 planes activos (además del plan gratuito)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, features: newFeatures }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const dataToSave = {
                ...formData,
                features: formData.features.filter(feature => feature.trim()),
                price: Number(formData.price),
                max_walks: Number(formData.max_walks),
                discount_percentage: Number(formData.discount_percentage)
            };
            onSave(dataToSave);
        }
    };

    if (!isOpen) return null;

    const canActivate = !formData.is_active && (planData?.is_active || activePlansCount < 3);
    const isEditing = !!planData;

    const categories = [
        { value: 'basic', label: 'Básico' },
        { value: 'standard', label: 'Estándar' },
        { value: 'premium', label: 'Premium' },
        { value: 'vip', label: 'VIP' },
        { value: 'exclusive', label: 'Exclusivo' }
    ];

    const durations = [
        { value: 'monthly', label: 'Mensual' },
        { value: 'yearly', label: 'Anual' },
        { value: 'weekly', label: 'Semanal' },
        { value: 'forever', label: 'Permanente' }
    ];

    const supportLevels = [
        { value: 'email', label: 'Email' },
        { value: 'priority', label: 'Prioritario' },
        { value: '24/7', label: '24/7' },
        { value: 'dedicated', label: 'Dedicado' }
    ];

    const cancellationPolicies = [
        { value: 'none', label: 'Sin cancelación' },
        { value: 'standard', label: 'Estándar (24h)' },
        { value: 'flexible', label: 'Flexible (2h)' },
        { value: 'anytime', label: 'Cualquier momento' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 dark:bg-foreground/95 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{isEditing ? 'Editar Plan' : 'Crear Plan'}</h2>
                            <p className="text-white/80 text-sm mt-1">
                                {isEditing ? 'Modifica la información del plan de suscripción' : 'Crea un nuevo plan de suscripción'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiTag size={16} /> ID del Plan
                            </label>
                            <input
                                type="text"
                                value={formData.plan_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, plan_id: e.target.value.toLowerCase() }))}
                                disabled={isEditing}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 ${
                                    isEditing ? 'opacity-50 cursor-not-allowed' : ''
                                } ${errors.plan_id ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-primary'}`}
                                placeholder="ej: premium-plus"
                            />
                            {errors.plan_id && <p className="text-danger text-sm mt-1">{errors.plan_id}</p>}
                            {isEditing && <p className="text-xs text-accent dark:text-muted mt-1">El ID no se puede modificar después de crear el plan</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiType size={16} /> Nombre del Plan
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 ${
                                    errors.name ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-primary'
                                }`}
                                placeholder="ej: Plan Premium Plus"
                            />
                            {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiDollarSign size={16} /> Precio
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 ${
                                    errors.price ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-primary'
                                }`}
                                placeholder="0.00"
                            />
                            {errors.price && <p className="text-danger text-sm mt-1">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground dark:text-background mb-2 block">Duración</label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200"
                            >
                                {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground dark:text-background mb-2 block">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200"
                            >
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiLayers size={16} /> Max Paseos
                            </label>
                            <input
                                type="number"
                                min="-1"
                                value={formData.max_walks}
                                onChange={(e) => setFormData(prev => ({ ...prev, max_walks: parseInt(e.target.value) || 0 }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 ${
                                    errors.max_walks ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-primary'
                                }`}
                                placeholder="-1 para ilimitado"
                            />
                            {errors.max_walks && <p className="text-danger text-sm mt-1">{errors.max_walks}</p>}
                            <p className="text-xs text-accent dark:text-muted mt-1">-1 para paseos ilimitados</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-foreground dark:text-background mb-2 block">Nivel de Soporte</label>
                            <select
                                value={formData.support_level}
                                onChange={(e) => setFormData(prev => ({ ...prev, support_level: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200"
                            >
                                {supportLevels.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground dark:text-background mb-2 block">Política de Cancelación</label>
                            <select
                                value={formData.cancellation_policy}
                                onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200"
                            >
                                {cancellationPolicies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                                % Descuento
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.discount_percentage}
                                onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 ${
                                    errors.discount_percentage ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-primary'
                                }`}
                                placeholder="0"
                            />
                            {errors.discount_percentage && <p className="text-danger text-sm mt-1">{errors.discount_percentage}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiFileText size={16} /> Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200 resize-none ${
                                errors.description ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-primary'
                            }`}
                            placeholder="Describe las ventajas y beneficios del plan"
                            maxLength={500}
                        />
                        {errors.description && <p className="text-danger text-sm mt-1">{errors.description}</p>}
                        <p className="text-xs text-accent dark:text-muted mt-1">{formData.description.length}/500 caracteres</p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-foreground dark:text-background">
                                Características ({formData.features.filter(f => f.trim()).length})
                            </label>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors"
                            >
                                <FiPlus size={14} /> Agregar
                            </button>
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 bg-white/50 dark:bg-foreground/50 text-foreground dark:text-background transition-all duration-200"
                                        placeholder={`Característica ${index + 1}`}
                                    />
                                    {formData.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.features && <p className="text-danger text-sm mt-2">{errors.features}</p>}
                    </div>

                    <div>
                        <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white/50 dark:bg-foreground/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${formData.is_active ? 'bg-success/20' : 'bg-gray-200'}`}>
                                    {formData.is_active
                                        ? <FiToggleRight className="text-success" size={20} />
                                        : <FiToggleLeft className="text-gray-500" size={20} />
                                    }
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground dark:text-background">Plan Activo</h4>
                                    <p className="text-sm text-accent dark:text-muted">
                                        {formData.is_active ? 'Disponible para los usuarios' : 'No visible para los usuarios'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { if (canActivate || formData.is_active) setFormData(prev => ({ ...prev, is_active: !prev.is_active })); }}
                                disabled={!canActivate && !formData.is_active}
                                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${formData.is_active ? 'bg-success' : 'bg-gray-300'} ${(!canActivate && !formData.is_active) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </label>
                        {errors.is_active && <p className="text-danger text-sm mt-1">{errors.is_active}</p>}
                        {!canActivate && !formData.is_active && (
                            <p className="text-warning text-sm mt-1">
                                No se puede activar: ya hay 3 planes activos (máximo permitido, además del plan gratuito)
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-white/50 dark:bg-foreground/50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {isEditing ? 'Actualizar' : 'Crear'} Plan
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PlanModal;