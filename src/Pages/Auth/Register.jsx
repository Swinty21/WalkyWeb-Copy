import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register({ onRegister, switchToLogin }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setErrors({});
        
        const newErrors = {};
        
        if (!formData.fullName || formData.fullName.trim().length < 2) {
            newErrors.fullName = "El nombre debe tener al menos 2 caracteres";
        }
        
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
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }
        
        if (!formData.terms) {
            newErrors.terms = "Debes aceptar los términos y condiciones";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            await onRegister(formData);
        } catch (err) {
            console.error("Error en registro:", err);
            setErrors({ 
                general: err.message || "Error al registrar usuario. Intenta nuevamente." 
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

        if (errors.general) {
            setErrors(prev => ({
                ...prev,
                general: ""
            }));
        }

        if (name === "confirmPassword" || (name === "password" && formData.confirmPassword)) {
            const password = name === "password" ? value : formData.password;
            const confirmPassword = name === "confirmPassword" ? value : formData.confirmPassword;
            
            if (confirmPassword && password !== confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: "Las contraseñas no coinciden"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ""
                }));
            }
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
                            Create Account
                        </h1>
                        <p className="text-accent">Please enter your details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                                    errors.fullName ? 'border-destructive' : 'border-input'
                                } focus:ring-2 focus:ring-ring focus:outline-none`}
                                placeholder="Tu nombre completo"
                                disabled={loading}
                            />
                            {errors.fullName && (
                                <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

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

                        <div className="relative">
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                                        errors.confirmPassword ? 'border-destructive' : 'border-input'
                                    } focus:ring-2 focus:ring-ring focus:outline-none pr-10`}
                                    placeholder="Repite tu contraseña"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-foreground"
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex items-start">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleInputChange}
                                    className={`mt-1 rounded border-input text-primary focus:ring-ring ${
                                        errors.terms ? 'border-destructive' : ''
                                    }`}
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-accent leading-5">
                                    I agree to the{" "}
                                    <button type="button" className="text-primary hover:text-ring underline">
                                        terms & conditions
                                    </button>
                                </span>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-destructive text-sm">{errors.terms}</p>
                        )}

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
                                    Creando cuenta...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <p className="text-center text-sm text-accent mt-6">
                            Already have an account? 
                            <button
                                type="button"
                                onClick={switchToLogin}
                                className="text-primary hover:text-ring font-medium ml-1"
                                disabled={loading}
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;