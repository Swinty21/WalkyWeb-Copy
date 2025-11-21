import { JoinToUsDataAccess } from "../DataAccess/JoinToUsDataAccess.js";

export const JoinToUsService = {
    async submitWalkerRegistration(registrationData) {
        this.validateRegistrationData(registrationData);
        
        const registration = {
            id: this.generateRegistrationId(),
            userId: registrationData.userId,
            fullName: registrationData.fullName.trim(),
            phone: registrationData.phone.replace(/[\s\-\(\)]/g, ''),
            dni: registrationData.dni.trim(),
            city: registrationData.city.trim(),
            province: registrationData.province.trim(),
            images: registrationData.images, 
            status: 'pending',
            submittedAt: new Date().toISOString(),
            reviewedAt: null,
            reviewedBy: null,
            adminNotes: '',
            applicationScore: null
        };

        return await JoinToUsDataAccess.createRegistration(registration);
    },

    async getApplicationByUserId(userId) {
        try {
            return await JoinToUsDataAccess.getApplicationByUserId(userId);
        } catch (error) {
            if (error.message === 'No application found for this user') {
                return null;
            }
            throw error;
        }
    },

    async retryRejectedApplication(userId) {
        const existingApplication = await this.getApplicationByUserId(userId);
        
        if (!existingApplication || existingApplication.status !== 'rejected') {
            throw new Error('No rejected application found for this user');
        }

        await JoinToUsDataAccess.deleteRegistration(existingApplication.id);
        
        return { success: true, message: 'Rejected application removed. You can now submit a new one.' };
    },

    async getAllRegistrations() {
        const registrations = await JoinToUsDataAccess.getAllRegistrations();
        
        return registrations.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    },

    async getRegistrationById(registrationId) {
        if (!registrationId) {
            throw new Error("Registration ID is required");
        }

        const registration = await JoinToUsDataAccess.getRegistrationById(registrationId);
        
        if (!registration) {
            throw new Error("Registration not found");
        }

        return registration;
    },

    async updateRegistrationStatus(registrationId, status, adminNotes = '') {
        if (!registrationId) {
            throw new Error("Registration ID is required");
        }

        if (!this.isValidStatus(status)) {
            throw new Error("Invalid status provided");
        }

        const registration = await JoinToUsDataAccess.getRegistrationById(registrationId);
        
        if (!registration) {
            throw new Error("Registration not found");
        }

        const updateData = {
            status: status,
            reviewedAt: new Date().toISOString(),
            adminNotes: adminNotes.trim()
        };

        if (status === 'approved') {
            updateData.applicationScore = this.calculateApplicationScore(registration);
        }

        return await JoinToUsDataAccess.updateRegistration(registrationId, updateData);
    },

    async deleteRegistration(registrationId) {
        if (!registrationId) {
            throw new Error("Registration ID is required");
        }

        const registration = await JoinToUsDataAccess.getRegistrationById(registrationId);
        
        if (!registration) {
            throw new Error("Registration not found");
        }

        return await JoinToUsDataAccess.deleteRegistration(registrationId);
    },

    async getRegistrationsByStatus(status) {
        if (!this.isValidStatus(status)) {
            throw new Error("Invalid status provided");
        }

        const registrations = await JoinToUsDataAccess.getRegistrationsByStatus(status);
        
        return registrations.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    },

    async getRegistrationStats() {
        const allRegistrations = await JoinToUsDataAccess.getAllRegistrations();
        
        const stats = {
            total: allRegistrations.length,
            pending: 0,
            approved: 0,
            rejected: 0,
            under_review: 0,
            recentSubmissions: 0 
        };

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        allRegistrations.forEach(registration => {
            stats[registration.status]++;
            
            if (new Date(registration.submittedAt) > oneWeekAgo) {
                stats.recentSubmissions++;
            }
        });

        return stats;
    },

    async promoteUserToWalker(userId) {
        return await JoinToUsDataAccess.promoteUserToWalker(userId);
    },

    validateRegistrationData(data) {
        const required = ['fullName', 'phone', 'dni', 'city', 'province', 'images', 'userId'];
        
        for (const field of required) {
            if (!data[field]) {
                throw new Error(`${field} is required`);
            }
        }

        if (!/^\d{7,8}$/.test(data.dni)) {
            throw new Error("DNI must be 7 or 8 digits");
        }

        const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
        if (!/^\d{8,15}$/.test(cleanPhone)) {
            throw new Error("Invalid phone number format");
        }

        const requiredImages = ['dniFront', 'dniBack', 'selfieWithDni'];
        for (const imageType of requiredImages) {
            if (!data.images[imageType]) {
                throw new Error(`${imageType} image is required`);
            }
        }
    },

    generateRegistrationId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `REG-${timestamp}-${random}`;
    },

    isValidStatus(status) {
        const validStatuses = ['pending', 'approved', 'rejected', 'under_review'];
        return validStatuses.includes(status);
    },

    calculateApplicationScore(registration) {
        let score = 0;
        
        if (registration.fullName && registration.fullName.length >= 5) score += 20;
        if (registration.phone && registration.phone.length >= 8) score += 15;
        if (registration.dni && /^\d{7,8}$/.test(registration.dni)) score += 20;
        if (registration.city && registration.city.length >= 3) score += 10;
        if (registration.province && registration.province.length >= 3) score += 10;
        
        const imageKeys = ['dniFront', 'dniBack', 'selfieWithDni'];
        imageKeys.forEach(key => {
            if (registration.images[key]) score += 8;
        });

        const submissionHour = new Date(registration.submittedAt).getHours();
        if (submissionHour >= 9 && submissionHour <= 17) score += 5;

        return Math.min(score, 100);
    },

    formatRegistrationForDisplay(registration) {
        return {
            ...registration,
            formattedSubmissionDate: new Date(registration.submittedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            formattedReviewDate: registration.reviewedAt ? 
                new Date(registration.reviewedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : null,
            statusDisplay: this.getStatusDisplayText(registration.status),
            hasAllImages: this.checkAllImagesPresent(registration.images)
        };
    },

    getStatusDisplayText(status) {
        const statusTexts = {
            pending: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado',
            under_review: 'En Revisión'
        };
        
        return statusTexts[status] || status;
    },

    checkAllImagesPresent(images) {
        const requiredImages = ['dniFront', 'dniBack', 'selfieWithDni'];
        return requiredImages.every(imageType => images && images[imageType]);
    }
};