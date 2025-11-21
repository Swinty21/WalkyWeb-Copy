import { useState } from 'react';
import { FaCamera, FaUser, FaPhone, FaIdCard, FaMapMarkerAlt, FaUpload, FaCloudUploadAlt } from 'react-icons/fa';
import CloudinaryService from '../../../../BackEnd/Services/CloudinaryService';

const RegistrationForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        dni: '',
        city: '',
        province: ''
    });

    const [images, setImages] = useState({
        dniFront: null,
        dniBack: null,
        selfieWithDni: null
    });

    const [imagePreview, setImagePreview] = useState({
        dniFront: null,
        dniBack: null,
        selfieWithDni: null
    });

    const [uploadProgress, setUploadProgress] = useState({
        dniFront: false,
        dniBack: false,
        selfieWithDni: false
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
                [name]: null
            }));
        }
    };

    const handleImageUpload = (e, imageType) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    [imageType]: 'La imagen no debe superar los 5MB'
                }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    [imageType]: 'Por favor selecciona un archivo de imagen válido'
                }));
                return;
            }

            setImages(prev => ({
                ...prev,
                [imageType]: file
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(prev => ({
                    ...prev,
                    [imageType]: e.target.result
                }));
            };
            reader.readAsDataURL(file);

            if (errors[imageType]) {
                setErrors(prev => ({
                    ...prev,
                    [imageType]: null
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es requerido';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!/^\d{8,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phone = 'Por favor ingresa un número de teléfono válido';
        }

        if (!formData.dni.trim()) {
            newErrors.dni = 'El DNI es requerido';
        } else if (!/^\d{7,8}$/.test(formData.dni)) {
            newErrors.dni = 'El DNI debe tener 7 u 8 dígitos';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'La localidad es requerida';
        }

        if (!formData.province.trim()) {
            newErrors.province = 'La provincia es requerida';
        }

        if (!images.dniFront) {
            newErrors.dniFront = 'La foto del frente del DNI es requerida';
        }

        if (!images.dniBack) {
            newErrors.dniBack = 'La foto del dorso del DNI es requerida';
        }

        if (!images.selfieWithDni) {
            newErrors.selfieWithDni = 'La selfie con DNI es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            
            setUploadProgress({
                dniFront: true,
                dniBack: true,
                selfieWithDni: true
            });

            const uploadedFilenames = await CloudinaryService.uploadMultipleImages(images);
            
            setUploadProgress({
                dniFront: false,
                dniBack: false,
                selfieWithDni: false
            });

            const registrationData = {
                ...formData,
                images: uploadedFilenames 
            };

            await onSubmit(registrationData);
            
        } catch (error) {
            
            setErrors({ 
                submit: error.message || 'Ocurrió un error al procesar el registro. Por favor intenta nuevamente.' 
            });
            setUploadProgress({
                dniFront: false,
                dniBack: false,
                selfieWithDni: false
            });
        }
    };

    const removeImage = (imageType) => {
        setImages(prev => ({
            ...prev,
            [imageType]: null
        }));
        setImagePreview(prev => ({
            ...prev,
            [imageType]: null
        }));
    };

    const isUploading = Object.values(uploadProgress).some(value => value);

    return (
        <div className="w-full h-full p-6 bg-background dark:bg-foreground overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent mb-4">
                        Únete a Nuestro Equipo
                    </h1>
                    <p className="text-xl text-accent dark:text-muted max-w-3xl mx-auto leading-relaxed">
                        Conviértete en un paseador de confianza y ayuda a las familias a cuidar mejor de sus mascotas. 
                        Completa el formulario para comenzar el proceso de registro.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card dark:bg-card/10 p-8 rounded-2xl shadow-2xl border border-border dark:border-muted">
                    {errors.submit && (
                        <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl text-danger">
                            {errors.submit}
                        </div>
                    )}

                    {isUploading && (
                        <div className="mb-6 p-4 bg-info/10 border border-info/30 rounded-xl text-info flex items-center">
                            <FaCloudUploadAlt className="text-2xl mr-3 animate-pulse" />
                            <div>
                                <p className="font-semibold">Subiendo imágenes a Cloudinary...</p>
                                <p className="text-sm">Por favor espera, esto puede tomar unos momentos.</p>
                            </div>
                        </div>
                    )}

                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <FaUser className="text-2xl text-primary mr-3" />
                            <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                Información Personal
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-foreground dark:text-background font-semibold mb-3">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full p-4 border-2 rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.fullName ? 'border-danger' : 'border-border dark:border-muted hover:border-primary/50'
                                    }`}
                                    placeholder="Ingresa tu nombre completo"
                                    disabled={loading || isUploading}
                                />
                                {errors.fullName && (
                                    <p className="mt-2 text-sm text-danger">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-foreground dark:text-background font-semibold mb-3">
                                    <FaPhone className="inline mr-2" />
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full p-4 border-2 rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.phone ? 'border-danger' : 'border-border dark:border-muted hover:border-primary/50'
                                    }`}
                                    placeholder="Ej: 1123456789"
                                    disabled={loading || isUploading}
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-danger">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-foreground dark:text-background font-semibold mb-3">
                                    <FaIdCard className="inline mr-2" />
                                    DNI *
                                </label>
                                <input
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleInputChange}
                                    className={`w-full p-4 border-2 rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.dni ? 'border-danger' : 'border-border dark:border-muted hover:border-primary/50'
                                    }`}
                                    placeholder="Sin puntos ni espacios"
                                    disabled={loading || isUploading}
                                />
                                {errors.dni && (
                                    <p className="mt-2 text-sm text-danger">{errors.dni}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-foreground dark:text-background font-semibold mb-3">
                                    <FaMapMarkerAlt className="inline mr-2" />
                                    Localidad *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`w-full p-4 border-2 rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.city ? 'border-danger' : 'border-border dark:border-muted hover:border-primary/50'
                                    }`}
                                    placeholder="Tu ciudad actual"
                                    disabled={loading || isUploading}
                                />
                                {errors.city && (
                                    <p className="mt-2 text-sm text-danger">{errors.city}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-foreground dark:text-background font-semibold mb-3">
                                    Provincia *
                                </label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    className={`w-full p-4 border-2 rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.province ? 'border-danger' : 'border-border dark:border-muted hover:border-primary/50'
                                    }`}
                                    placeholder="Tu provincia"
                                    disabled={loading || isUploading}
                                />
                                {errors.province && (
                                    <p className="mt-2 text-sm text-danger">{errors.province}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <FaCamera className="text-2xl text-primary mr-3" />
                            <h3 className="text-2xl font-bold text-foreground dark:text-background">
                                Documentación Requerida
                            </h3>
                        </div>
                        <p className="text-accent dark:text-muted mb-6 text-lg">
                            Necesitamos verificar tu identidad. Las fotos deben ser claras y legibles.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { key: 'dniFront', label: 'DNI Frente', icon: FaIdCard },
                                { key: 'dniBack', label: 'DNI Dorso', icon: FaIdCard },
                                { key: 'selfieWithDni', label: 'Selfie con DNI', icon: FaCamera }
                            ].map((item) => (
                                <div key={item.key} className="flex flex-col">
                                    <div className={`relative group ${imagePreview[item.key] ? 'mb-3' : ''}`}>
                                        <label className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                                            uploadProgress[item.key]
                                                ? 'border-info bg-info/10 cursor-wait'
                                                : imagePreview[item.key] 
                                                ? 'border-success bg-success/5 hover:bg-success/10' 
                                                : errors[item.key] 
                                                ? 'border-danger bg-danger/5 hover:bg-danger/10' 
                                                : 'border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10'
                                        } ${(loading || isUploading) ? 'cursor-not-allowed opacity-50' : ''}`}>
                                            {uploadProgress[item.key] ? (
                                                <div className="flex flex-col items-center">
                                                    <FaCloudUploadAlt className="text-4xl text-info mb-3 animate-bounce" />
                                                    <span className="text-info font-semibold">Subiendo...</span>
                                                </div>
                                            ) : imagePreview[item.key] ? (
                                                <div className="relative w-full h-full">
                                                    <img 
                                                        src={imagePreview[item.key]} 
                                                        alt={item.label}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                                        <FaUpload className="text-white text-2xl" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <item.icon className={`text-4xl mb-3 ${errors[item.key] ? 'text-danger' : 'text-primary'}`} />
                                                    <span className={`text-lg font-semibold mb-2 ${errors[item.key] ? 'text-danger' : 'text-foreground dark:text-background'}`}>
                                                        {item.label}
                                                    </span>
                                                    <span className="text-sm text-accent dark:text-muted text-center px-2">
                                                        Haz clic para subir imagen
                                                    </span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, item.key)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept="image/*"
                                                disabled={loading || isUploading}
                                            />
                                        </label>
                                    </div>
                                    
                                    {imagePreview[item.key] && !uploadProgress[item.key] && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(item.key)}
                                            className="text-sm text-danger hover:text-danger/80 transition-colors duration-200"
                                            disabled={loading || isUploading}
                                        >
                                            Eliminar imagen
                                        </button>
                                    )}
                                    
                                    {errors[item.key] && (
                                        <p className="mt-2 text-sm text-danger">{errors[item.key]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || isUploading}
                        className="w-full bg-gradient-to-r from-primary to-success text-white py-5 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                        {isUploading ? (
                            <div className="flex items-center justify-center">
                                <FaCloudUploadAlt className="text-2xl mr-3 animate-pulse" />
                                Subiendo Imágenes a Cloudinary...
                            </div>
                        ) : loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                Enviando Registro...
                            </div>
                        ) : (
                            'Enviar Registro'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;