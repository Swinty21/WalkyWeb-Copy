const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

class CloudinaryService {
    static async uploadImage(file, imageType) {
        try {

            
            const formData = new FormData();
            const timestamp = Date.now();
            const filename = `${imageType}_${timestamp}_${file.name}`;
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'walker_applications');
            formData.append('public_id', filename.split('.')[0]);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.error?.message || 'Error al subir imagen a Cloudinary');
            }

            const data = await response.json();
            const url = data.url || data.secure_url;
            const fileNameWithExtension = url.split('/').pop();
            return fileNameWithExtension;
        } catch (error) {
            console.error('ERROR en uploadImage:', error);
            throw new Error(`Error al subir imagen: ${error.message}`);
        }
    }

    static async uploadMultipleImages(images) {
        try {            
            const uploadPromises = Object.entries(images).map(async ([key, file]) => {
                if (!file) {
                    return [key, null];
                }
                const fileNameWithExtension = await this.uploadImage(file, key);
                return [key, fileNameWithExtension];
            });

            const results = await Promise.all(uploadPromises);
            const finalResults = Object.fromEntries(results);
            return finalResults;
        } catch (error) {
            console.error('ERROR en uploadMultipleImages:', error);
            throw new Error(`Error al subir múltiples imágenes: ${error.message}`);
        }
    }

    static extractFilename(filenameData) {
        
        if (!filenameData) {
            return null;
        }
        
        if (typeof filenameData === 'object' && filenameData.filename) {
            return filenameData.filename;
        }
        
        if (typeof filenameData === 'string') {
            return filenameData;
        }
        
        return null;
    }

    static getImageUrl(filenameData) {
        const filename = this.extractFilename(filenameData);
        
        if (!filename) {
            return null;
        }
        
        const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/walker_applications/${filename}`;

        
        return url;
    }

    static getImageUrls(imageFilenames) {
        
        if (!imageFilenames) return {};
        
        const urls = {};
        for (const [key, filenameData] of Object.entries(imageFilenames)) {
            
            urls[key] = this.getImageUrl(filenameData);
        }
        
        return urls;
    }

    static getThumbnail(filenameData, size = 400) {
        
        const filename = this.extractFilename(filenameData);
        
        if (!filename) {
            return null;
        }
        
        const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${size},h_${size},c_fill,q_auto,f_auto/walker_applications/${filename}`;

        
        return url;
    }

    static getOptimizedUrl(filenameData, options = {}) {

        
        const filename = this.extractFilename(filenameData);

        
        if (!filename) {
            return null;
        }
        
        const {
            width = 'auto',
            height = 'auto',
            crop = 'fill',
            quality = 'auto',
            format = 'auto'
        } = options;

        const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/walker_applications/${filename}`;
        
        return url;
    }
}

export default CloudinaryService;