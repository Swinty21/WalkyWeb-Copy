import { useState, useEffect } from "react";
import { FiX, FiUser, FiPhone, FiMapPin, FiShield, FiUserCheck, FiCamera } from "react-icons/fi";

const AdminEditUserModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        phone: "",
        location: "",
        status: "",
        profileImage: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && userData) {
            setFormData({
                name: userData.fullName || "",
                role: userData.role || "client",
                phone: userData.phone && userData.phone !== "No disponible" ? userData.phone : "",
                location: userData.location && userData.location !== "No disponible" ? userData.location : "",
                status: userData.status || "active",
                profileImage: userData.profileImage || profileImageOptions[0]
            });
            setErrors({});
        }
    }, [isOpen, userData]);

    const profileImageOptions = [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        "https://images.unsplash.com/photo-1494790108755-2616b2e3c8c5",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
        "https://images.unsplash.com/photo-1609010697446-11f2155278f0"
    ];

    const roleOptions = [
        { value: "admin", label: "Administrador" },
        { value: "client", label: "Cliente" },
        { value: "walker", label: "Paseador" },
        { value: "support", label: "Soporte" }
    ];

    const statusOptions = [
        { value: "active", label: "Activo" },
        { value: "inactive", label: "Inactivo" }
    ];

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

    const handleImageSelect = (imageUrl) => {
        setFormData(prev => ({
            ...prev,
            profileImage: imageUrl
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        }

        if (!formData.role) {
            newErrors.role = "El rol es obligatorio";
        }

        if (!formData.status) {
            newErrors.status = "El estado es obligatorio";
        }

        if (formData.phone && !/^[\+]?[0-9\-\s\(\)]+$/.test(formData.phone)) {
            newErrors.phone = "Formato de teléfono inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Solo enviamos los campos que el admin puede editar
        const updatedUserData = {
            name: formData.name.trim(),
            role: formData.role,
            phone: formData.phone.trim(),
            location: formData.location.trim(),
            status: formData.status,
            profileImage: formData.profileImage
        };

        onSave(userData.id, updatedUserData);
    };

    const handleClose = () => {
        setFormData({
            name: "",
            role: "",
            phone: "",
            location: "",
            status: "",
            profileImage: ""
        });
        setErrors({});
        onClose();
    };

    if (!isOpen || !userData) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-500/20">

                <div className="flex items-center justify-between p-6 border-b border-border dark:border-muted bg-gradient-to-r from-blue-500/10 to-indigo-500/5">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                            <FiShield className="text-blue-600 text-sm" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading text-foreground dark:text-background">
                                Editar Usuario (Admin)
                            </h2>
                            <p className="text-xs text-accent dark:text-muted">
                                Usuario: {userData.fullName} • ID: {userData.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-muted/30 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-foreground dark:text-background" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Información del usuario (solo lectura) */}
                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                        <div className="flex items-center space-x-4">
                            <img
                                src={userData.profileImage}
                                alt={userData.fullName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                            />
                            <div>
                                <h3 className="font-semibold text-foreground dark:text-background">{userData.fullName}</h3>
                                <p className="text-sm text-accent dark:text-muted">
                                    {userData.email} • {userData.suscription}
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                    Estado: {userData.status === 'active' ? 'Activo' : 'Inactivo'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Selección de imagen de perfil */}
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-3">
                            <FiCamera className="inline mr-2" />
                            Imagen de Perfil
                        </label>
                        <div className="flex justify-center mb-4">
                            <img
                                src={formData.profileImage || profileImageOptions[0]}
                                alt="Imagen de perfil"
                                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {profileImageOptions.map((image, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleImageSelect(image)}
                                    className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        formData.profileImage === image
                                            ? "border-blue-500 ring-2 ring-blue-500/30"
                                            : "border-border dark:border-muted hover:border-blue-500"
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Opción ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Nombre completo */}
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiUser className="inline mr-2" />
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.name ? 'border-red-500' : 'border-border dark:border-muted'
                                }`}
                                placeholder="Nombre completo del usuario"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiShield className="inline mr-2" />
                                Rol *
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.role ? 'border-red-500' : 'border-border dark:border-muted'
                                }`}
                            >
                                {roleOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiUserCheck className="inline mr-2" />
                                Estado *
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.status ? 'border-red-500' : 'border-border dark:border-muted'
                                }`}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                                <FiPhone className="inline mr-2" />
                                Teléfono
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.phone ? 'border-red-500' : 'border-border dark:border-muted'
                                }`}
                                placeholder="+54 11 1234 5678"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiMapPin className="inline mr-2" />
                            Ubicación
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border dark:border-muted rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ciudad, País"
                        />
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                            ⚠️ Vista de Administrador
                        </p>
                        <p className="text-yellow-600 dark:text-yellow-300 text-xs mt-1">
                            Solo puedes editar: imagen, nombre, rol, estado, teléfono y ubicación. El email y suscripción no son modificables.
                        </p>
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
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                            <FiShield className="mr-2 w-4 h-4" />
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditUserModal;