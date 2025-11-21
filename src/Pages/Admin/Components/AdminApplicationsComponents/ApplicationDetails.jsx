import { useState } from 'react';
import { FaUser, FaPhone, FaIdCard, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimes, FaEye, FaImage, FaStar, FaSearchPlus } from 'react-icons/fa';
import CloudinaryService from '../../../../BackEnd/Services/CloudinaryService';

const ApplicationDetails = ({ application, onReviewStart, reviewing }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClock className="text-orange-500" />;
            case 'under_review':
                return <FaEye className="text-blue-500" />;
            case 'approved':
                return <FaCheckCircle className="text-green-500" />;
            case 'rejected':
                return <FaTimes className="text-red-500" />;
            default:
                return <FaClock className="text-orange-500" />;
        }
    };

    const getStatusText = (status) => {
        const statusTexts = {
            pending: 'Pendiente',
            under_review: 'En Revisión',
            approved: 'Aprobado',
            rejected: 'Rechazado'
        };
        return statusTexts[status] || status;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-500/70 text-white';
            case 'under_review':
                return 'bg-blue-500/70 text-white';
            case 'approved':
                return 'bg-green-500/70 text-white';
            case 'rejected':
                return 'bg-red-500/70 text-white';
            default:
                return 'bg-orange-500/70 text-white';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canReview = () => {
        return ['pending', 'under_review'].includes(application.status);
    };

    const imageTypes = [
        { key: 'dniFront', label: 'DNI Frente' },
        { key: 'dniBack', label: 'DNI Dorso' },
        { key: 'selfieWithDni', label: 'Selfie con DNI' }
    ];

    return (
        <>
            <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg">
                <div className="p-6 border-b border-primary/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                <span className="text-white font-bold text-lg">
                                    {application.fullName?.[0] || 'A'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground dark:text-background">
                                    Detalles de la Solicitud
                                </h2>
                                <p className="text-sm text-accent dark:text-muted">
                                    ID: {application.id}
                                </p>
                            </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1">
                                {getStatusText(application.status)}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    
                    <div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4 flex items-center">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center mr-3">
                                <FaUser className="text-indigo-600" size={16} />
                            </div>
                            Información Personal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <label className="text-sm text-indigo-600 font-medium">Nombre Completo</label>
                                <p className="font-semibold text-foreground dark:text-background mt-1">{application.fullName}</p>
                            </div>
                            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <label className="text-sm text-purple-600 font-medium flex items-center">
                                    <FaPhone className="mr-1" size={12} /> Teléfono
                                </label>
                                <p className="font-semibold text-foreground dark:text-background mt-1">{application.phone}</p>
                            </div>
                            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <label className="text-sm text-blue-600 font-medium flex items-center">
                                    <FaIdCard className="mr-1" size={12} /> DNI
                                </label>
                                <p className="font-semibold text-foreground dark:text-background mt-1">{application.dni}</p>
                            </div>
                            <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                <label className="text-sm text-teal-600 font-medium flex items-center">
                                    <FaMapMarkerAlt className="mr-1" size={12} /> Ubicación
                                </label>
                                <p className="font-semibold text-foreground dark:text-background mt-1">
                                    {application.city}, {application.province}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                                <FaImage className="text-green-600" size={16} />
                            </div>
                            Documentación
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {imageTypes.map((imageType) => {
                                const imageData = application.images?.[imageType.key];
                                const hasImage = imageData && (imageData.filename || imageData.url || (typeof imageData === 'string'));
                                
                                return (
                                    <div key={imageType.key} className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-200/50">
                                        <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                                            <label className="text-sm font-semibold text-foreground dark:text-background block">
                                                {imageType.label}
                                            </label>
                                        </div>
                                        
                                        {hasImage ? (
                                            <div className="p-3 space-y-3">
                                                <div 
                                                    className="relative group cursor-pointer aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-green-500/20 hover:border-green-500/50 transition-colors"
                                                    onClick={() => setSelectedImage({ 
                                                        url: CloudinaryService.getImageUrl(imageData), 
                                                        label: imageType.label 
                                                    })}
                                                >
                                                    <img
                                                        src={CloudinaryService.getThumbnail(imageData, 300)}
                                                        alt={imageType.label}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                        <FaSearchPlus className="text-white text-2xl" />
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                                                    <FaCheckCircle className="text-green-500 mx-auto mb-1" />
                                                    <p className="text-xs text-green-600 font-medium">Imagen cargada</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3">
                                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                                                    <FaTimes className="text-red-500 mx-auto mb-2 text-xl" />
                                                    <p className="text-xs text-red-600 font-medium">No cargada</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4 flex items-center">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mr-3">
                                <FaClock className="text-orange-600" size={16} />
                            </div>
                            Cronología
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                <label className="text-sm text-orange-600 font-medium">Enviada</label>
                                <p className="font-semibold text-foreground dark:text-background mt-1">
                                    {formatDate(application.submittedAt)}
                                </p>
                            </div>
                            {application.reviewedAt && (
                                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                    <label className="text-sm text-emerald-600 font-medium">Revisada</label>
                                    <p className="font-semibold text-foreground dark:text-background mt-1">
                                        {formatDate(application.reviewedAt)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {application.applicationScore && (
                        <div>
                            <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4 flex items-center">
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                                    <FaStar className="text-yellow-600" size={16} />
                                </div>
                                Puntuación de la Aplicación
                            </h3>
                            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-yellow-600 font-medium">Puntuación Final</span>
                                    <div className="flex items-center">
                                        <FaStar className="text-yellow-500 mr-1" />
                                        <span className="font-bold text-xl text-foreground dark:text-background">
                                            {application.applicationScore}/100
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {application.adminNotes && (
                        <div>
                            <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4">
                                Notas del Administrador
                            </h3>
                            <div className={`rounded-lg p-4 border backdrop-blur-sm ${
                                application.status === 'approved' 
                                    ? 'bg-green-500/10 border-green-500/20' 
                                    : 'bg-red-500/10 border-red-500/20'
                            }`}>
                                <p className={`${
                                    application.status === 'approved' ? 'text-green-600' : 'text-red-600'
                                } font-medium`}>
                                    {application.adminNotes}
                                </p>
                            </div>
                        </div>
                    )}

                    {canReview() && (
                        <div className="border-t border-primary/10 pt-6">
                            <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4">
                                Acciones de Revisión
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => onReviewStart('approve')}
                                    disabled={reviewing}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
                                >
                                    <FaCheckCircle className="mr-2" />
                                    {reviewing ? 'Procesando...' : 'Aprobar Solicitud'}
                                </button>
                                <button
                                    onClick={() => onReviewStart('reject')}
                                    disabled={reviewing}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
                                >
                                    <FaTimes className="mr-2" />
                                    {reviewing ? 'Procesando...' : 'Rechazar Solicitud'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh]">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors duration-200"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                        
                        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800">
                                <h4 className="text-xl font-semibold text-foreground dark:text-background">
                                    {selectedImage.label}
                                </h4>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.label}
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApplicationDetails;