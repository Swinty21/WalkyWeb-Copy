import { useState, useEffect } from "react";
import { FiX, FiUser, FiPackage, FiCalendar, FiFileText, FiCamera } from "react-icons/fi";

const EditPetModal = ({ isOpen, onClose, petData, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        weight: "",
        age: "",
        description: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && petData) {
            setFormData({
                name: petData.name || "",
                image: petData.image || petImageOptions[0],
                weight: petData.weight ? petData.weight.toString() : "",
                age: petData.age ? petData.age.toString() : "",
                description: petData.description || ""
            });
            setErrors({});
        }
    }, [isOpen, petData]);

    const petImageOptions = [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=300&fit=crop&crop=face"
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
            image: imageUrl
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        }

        if (!formData.image) {
            newErrors.image = "Debes seleccionar una imagen";
        }

        if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
            newErrors.weight = "El peso debe ser un número válido mayor a 0";
        }

        if (formData.age && (isNaN(formData.age) || parseInt(formData.age) <= 0)) {
            newErrors.age = "La edad debe ser un número válido mayor a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const updatedPetData = {
            ...formData,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            age: formData.age ? parseInt(formData.age) : null
        };

        onSave(petData.id, updatedPetData);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            name: "",
            image: "",
            weight: "",
            age: "",
            description: ""
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between p-6 border-b border-border dark:border-muted">
                    <h2 className="text-xl font-heading text-foreground dark:text-background">
                        Editar Mascota
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
                            Foto de la Mascota
                        </label>
                        <div className="flex justify-center mb-4">
                            <img
                                src={formData.image || petImageOptions[0]}
                                alt="Imagen de la mascota"
                                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {petImageOptions.map((image, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleImageSelect(image)}
                                    className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        formData.image === image
                                            ? "border-primary ring-2 ring-primary/30"
                                            : "border-border dark:border-muted hover:border-primary"
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
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiUser className="inline mr-2" />
                            Nombre *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.name ? 'border-red-500' : 'border-border dark:border-muted'
                            }`}
                            placeholder="Nombre de tu mascota"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiPackage className="inline mr-2" />
                            Peso (kg)
                        </label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            step="0.1"
                            min="0"
                            className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.weight ? 'border-red-500' : 'border-border dark:border-muted'
                            }`}
                            placeholder="Peso de tu mascota"
                        />
                        {errors.weight && (
                            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiCalendar className="inline mr-2" />
                            Edad (años)
                        </label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            min="0"
                            className={`w-full px-3 py-2 border rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.age ? 'border-red-500' : 'border-border dark:border-muted'
                            }`}
                            placeholder="Edad de tu mascota"
                        />
                        {errors.age && (
                            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-background mb-2">
                            <FiFileText className="inline mr-2" />
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-border dark:border-muted rounded-lg bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Cuéntanos sobre tu mascota..."
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
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPetModal;