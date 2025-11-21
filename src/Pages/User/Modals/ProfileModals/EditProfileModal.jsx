import { useState, useEffect } from "react";
import { FiX, FiUser, FiPhone, FiMapPin, FiCamera } from "react-icons/fi";

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
        avatar: ""
    });

    useEffect(() => {
        if (isOpen && userData) {
            setFormData({
                name: userData.name || "",
                phone: userData.contact || "",
                location: userData.location || "",
                avatar: userData.avatar || avatarOptions[0] 
            });
        }
    }, [isOpen, userData]);

    const avatarOptions = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarSelect = (avatarUrl) => {
        setFormData(prev => ({
            ...prev,
            avatar: avatarUrl
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            name: "",
            phone: "",
            location: "",
            avatar: ""
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-muted">
                    <h2 className="text-xl font-heading text-foreground dark:text-background">
                        Editar Perfil
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-muted/30 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-foreground dark:text-background" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-3">
                            <FiCamera className="inline mr-2" />
                            Foto de Perfil
                        </label>
                        <div className="flex justify-center mb-4">
                            <img
                                src={formData.avatar || avatarOptions[0]}
                                alt="Avatar actual"
                                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {avatarOptions.map((avatar, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleAvatarSelect(avatar)}
                                    className={`relative w-full aspect-square rounded-full overflow-hidden border-2 transition-all ${
                                        formData.avatar === avatar
                                            ? "border-primary ring-2 ring-primary/30"
                                            : "border-border dark:border-muted hover:border-primary"
                                    }`}
                                >
                                    <img
                                        src={avatar}
                                        alt={`Avatar ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiUser className="inline mr-2" />
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border dark:border-muted rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ingresa tu nombre"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiPhone className="inline mr-2" />
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border dark:border-muted rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ingresa tu teléfono"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiMapPin className="inline mr-2" />
                            Localidad
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border dark:border-muted rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ingresa tu localidad"
                        />
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
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;