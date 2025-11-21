import { useState } from 'react';
import { FaImage, FaTimes, FaSearchPlus } from 'react-icons/fa';
import CloudinaryService from '../../../../BackEnd/Services/CloudinaryService';

const ImageGallery = ({ images, title = "Documentación Enviada" }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || Object.keys(images).length === 0) {
        return null;
    }

    const imageLabels = {
        dniFront: 'DNI Frente',
        dniBack: 'DNI Dorso',
        selfieWithDni: 'Selfie con DNI'
    };

    console.log("images");
    console.log("images");
    console.log(images);
    console.log("images");
    console.log("images");
    console.log("images");
    const validImages = Object.entries(images).filter(([key, filename]) => filename);
    if (validImages.length === 0) {
        return null;
    }

    return (
        <>
            <div className="bg-background dark:bg-foreground rounded-xl p-6 border border-border dark:border-muted">
                <h3 className="text-xl font-semibold text-foreground dark:text-background mb-4 flex items-center">
                    <FaImage className="text-primary mr-2" />
                    {title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {validImages.map(([key, filename]) => {
                        const thumbnailUrl = CloudinaryService.getThumbnail(filename, 400);
                        const fullUrl = CloudinaryService.getImageUrl(filename);
                        
                        return (
                            <div key={key} className="relative group">
                                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-border dark:border-muted hover:border-primary transition-colors duration-200">
                                    <img
                                        src={thumbnailUrl}
                                        alt={imageLabels[key]}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => setSelectedImage({ url: fullUrl, label: imageLabels[key] })}
                                        loading="lazy"
                                    />
                                    <div 
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                                        onClick={() => setSelectedImage({ url: fullUrl, label: imageLabels[key] })}
                                    >
                                        <FaSearchPlus className="text-white text-3xl" />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-center text-accent dark:text-muted font-medium">
                                    {imageLabels[key]}
                                </p>
                            </div>
                        );
                    })}
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

export default ImageGallery;