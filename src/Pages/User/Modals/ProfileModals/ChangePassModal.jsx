import { useState } from "react";
import { FiX, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "La contraseña actual es requerida";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "La nueva contraseña es requerida";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma la nueva contraseña";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = "La nueva contraseña debe ser diferente a la actual";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSave({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setErrors({});
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-lg shadow-xl w-full max-w-md">

                <div className="flex items-center justify-between p-6 border-b border-border dark:border-muted">
                    <h2 className="text-xl font-heading text-foreground dark:text-background">
                        Cambiar Contraseña
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-muted/30 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-foreground dark:text-background" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiLock className="inline mr-2" />
                            Contraseña Actual
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.currentPassword ? "border-red-500" : "border-border dark:border-muted"
                                }`}
                                placeholder="Ingresa tu contraseña actual"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-foreground dark:hover:text-background"
                            >
                                {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiLock className="inline mr-2" />
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.newPassword ? "border-red-500" : "border-border dark:border-muted"
                                }`}
                                placeholder="Ingresa tu nueva contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-foreground dark:hover:text-background"
                            >
                                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiLock className="inline mr-2" />
                            Confirmar Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.confirmPassword ? "border-red-500" : "border-border dark:border-muted"
                                }`}
                                placeholder="Confirma tu nueva contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-foreground dark:hover:text-background"
                            >
                                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="bg-muted/20 p-3 rounded-lg">
                        <p className="text-sm text-muted mb-1">Requisitos de la contraseña:</p>
                        <ul className="text-xs text-muted space-y-1">
                            <li>• Mínimo 6 caracteres</li>
                            <li>• Debe ser diferente a la contraseña actual</li>
                        </ul>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-border dark:border-muted text-foreground dark:text-background rounded-lg hover:bg-muted/30 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Cambiar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassModal;