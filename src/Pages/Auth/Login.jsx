import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ForgotPasswordModal from "./Modal/ForgotPasswordModal";

function Login({ onLogin, switchToRegister }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setErrors({});
        
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = "El email es requerido";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Formato de email inválido";
        }
        
        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            
            if (formData.rememberMe) {
                localStorage.setItem("rememberedUser", JSON.stringify({
                    email: formData.email
                }));
            }
            
            await onLogin({
                email: formData.email,
                password: formData.password
            });
            
        } catch (err) {
            console.error("Error en login:", err);
            setErrors({ 
                general: err.message || "Error al iniciar sesión. Verifica tus credenciales." 
            });
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

        // Limpiar error general
        if (errors.general) {
            setErrors(prev => ({
                ...prev,
                general: ""
            }));
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative py-8 px-4"
            style={{
                backgroundImage: `url('../../../public/backgroundFirts.jpg')`
            }}>
            <div className="absolute inset-0 backdrop-blur-[6px] bg-foreground/30"></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-xl bg-card/70 p-8 rounded-xl shadow-xl border border-border/50">
                    <div className="text-center mb-8">
                        <h1 className="text-heading font-heading text-foreground mb-2">
                            Welcome to WalkyApp
                        </h1>
                        <p className="text-accent">Please enter your credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                                    errors.email ? 'border-destructive' : 'border-input'
                                } focus:ring-2 focus:ring-ring focus:outline-none`}
                                placeholder="ejemplo@correo.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                                        errors.password ? 'border-destructive' : 'border-input'
                                    } focus:ring-2 focus:ring-ring focus:outline-none pr-10`}
                                    placeholder="Mínimo 8 caracteres"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-foreground"
                                    disabled={loading}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-destructive text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="rounded border-input text-primary focus:ring-ring"
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-accent">Remember me</span>
                            </label>
                            
                            <button 
                                type="button" 
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-primary hover:text-ring"
                                disabled={loading}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {errors.general && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-destructive text-sm">{errors.general}</p>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-primary text-background py-2 rounded-lg hover:bg-ring transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                        
                        <p className="text-center text-sm text-accent mt-6">
                            Don't have an account? 
                            <button
                                type="button"
                                onClick={switchToRegister}
                                className="text-primary hover:text-ring font-medium ml-1"
                                disabled={loading}
                            >
                                Sign up
                            </button>
                        </p>
                    </form>
                </div>
            </div>

            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                onSuccess={() => {
                    setShowForgotPassword(false);
                    setErrors({ 
                        general: "Contraseña cambiada correctamente. Por favor, inicia sesión con tu nueva contraseña." 
                    });
                }}
            />
        </div>
    );
}

export default Login;