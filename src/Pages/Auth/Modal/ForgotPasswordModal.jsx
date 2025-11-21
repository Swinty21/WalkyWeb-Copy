import { useState } from "react";
import { FiX, FiMail, FiLock, FiKey } from "react-icons/fi";
import { AuthController } from "../../../BackEnd/Controllers/AuthController";

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: ""
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

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        
        setErrors({});
        
        if (!formData.email) {
            setErrors({ email: "El email es requerido" });
            return;
        }
        
        if (!validateEmail(formData.email)) {
            setErrors({ email: "Formato de email inválido" });
            return;
        }

        try {
            setLoading(true);
            
            
            await AuthController.requestPasswordReset(formData.email);
            
            setStep(2);
            
        } catch (err) {
            console.error("Error enviando código:", err);
            setErrors({ general: err.message || "Error al enviar código" });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        
        setErrors({});
        
        if (!formData.code) {
            setErrors({ code: "El código es requerido" });
            return;
        }
        
        if (formData.code.length !== 6) {
            setErrors({ code: "El código debe tener 6 dígitos" });
            return;
        }

        try {
            setLoading(true);
            
            await AuthController.verifyResetCode(formData.email, formData.code);
            
            setStep(3);
            
        } catch (err) {
            console.error("Error verificando código:", err);
            setErrors({ code: err.message || "Código inválido o expirado" });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        setErrors({});
        
        const newErrors = {};
        
        if (!formData.newPassword) {
            newErrors.newPassword = "La contraseña es requerida";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            
            await AuthController.resetPasswordWithCode(
                formData.email,
                formData.code,
                formData.newPassword
            );
            
            onSuccess();
            handleClose();
            
        } catch (err) {
            console.error("Error cambiando contraseña:", err);
            setErrors({ general: err.message || "Error al cambiar contraseña" });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setFormData({
            email: "",
            code: "",
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
                        Recuperar Contraseña
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-muted/30 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <FiX className="w-5 h-5 text-foreground dark:text-background" />
                    </button>
                </div>

                <div className="p-6">
                    
                    <div className="flex items-center justify-between mb-6">
                        <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted/30'}`}>
                                1
                            </div>
                            <span className="ml-2 text-sm">Email</span>
                        </div>
                        <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-muted/30'}`}></div>
                        <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted/30'}`}>
                                2
                            </div>
                            <span className="ml-2 text-sm">Código</span>
                        </div>
                        <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-muted/30'}`}></div>
                        <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-muted/30'}`}>
                                3
                            </div>
                            <span className="ml-2 text-sm">Nueva</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <p className="text-sm text-muted mb-4">
                                Ingresa tu email y te enviaremos un código de 6 dígitos para recuperar tu contraseña.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    <FiMail className="inline mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.email ? "border-red-500" : "border-border dark:border-muted"
                                    }`}
                                    placeholder="ejemplo@correo.com"
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {errors.general && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <p className="text-destructive text-sm">{errors.general}</p>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-border dark:border-muted text-foreground dark:text-background rounded-lg hover:bg-muted/30 transition-colors"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Enviando..." : "Enviar Código"}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <p className="text-sm text-muted mb-4">
                                Ingresa el código de 6 dígitos que enviamos a <strong>{formData.email}</strong>
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    <FiKey className="inline mr-2" />
                                    Código de Verificación
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    maxLength="6"
                                    className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest ${
                                        errors.code ? "border-red-500" : "border-border dark:border-muted"
                                    }`}
                                    placeholder="000000"
                                    disabled={loading}
                                />
                                {errors.code && (
                                    <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                                )}
                            </div>

                            <div className="bg-muted/20 p-3 rounded-lg">
                                <p className="text-xs text-muted">
                                    ⚠️ El código expira en 10 minutos
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 px-4 py-2 border border-border dark:border-muted text-foreground dark:text-background rounded-lg hover:bg-muted/30 transition-colors"
                                    disabled={loading}
                                >
                                    Atrás
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Verificando..." : "Verificar"}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <p className="text-sm text-muted mb-4">
                                Ingresa tu nueva contraseña
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    <FiLock className="inline mr-2" />
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.newPassword ? "border-red-500" : "border-border dark:border-muted"
                                    }`}
                                    placeholder="Mínimo 6 caracteres"
                                    disabled={loading}
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                    <FiLock className="inline mr-2" />
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.confirmPassword ? "border-red-500" : "border-border dark:border-muted"
                                    }`}
                                    placeholder="Repite tu contraseña"
                                    disabled={loading}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {errors.general && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <p className="text-destructive text-sm">{errors.general}</p>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-border dark:border-muted text-foreground dark:text-background rounded-lg hover:bg-muted/30 transition-colors"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Cambiando..." : "Cambiar Contraseña"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;