import { useState, useEffect, useCallback } from "react";
import { WalkerController } from "../../../BackEnd/Controllers/WalkerController";
import { ReviewsController } from "../../../BackEnd/Controllers/ReviewsController";
import { useNavigation } from "../../../BackEnd/Context/NavigationContext";
import WalkerHeaderComponent from "../Components/WalkerProfileComponents/WalkerHeaderComponent";
import WalkerReviewsComponent from "../Components/WalkerProfileComponents/WalkerReviewsComponent";
import GetServiceModal from "../Modals/GetServiceModal";
import { useToast } from '../../../BackEnd/Context/ToastContext';

const WalkerProfile = ({ id }) => {
    
    const { walkerId } = id || {};
    const { success } = useToast();
    const { navigateToContent } = useNavigation();
    
    const [walkerData, setWalkerData] = useState(null);
    const [walkerSettings, setWalkerSettings] = useState(null);
    const [loadingWalker, setLoadingWalker] = useState(true);
    const [walkerError, setWalkerError] = useState(null);
    
    const [reviewsData, setReviewsData] = useState({ reviews: [], pagination: {} });
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const buttonBase = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm";
    const buttonInactive = "bg-background dark:bg-foreground border border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md";

    const loadWalkerData = useCallback(async () => {
        try {
            setLoadingWalker(true);
            setWalkerError(null);
            if (!walkerId) return;
            
            const [walkerProfile, walkerConfig] = await Promise.all([
                WalkerController.fetchWalkerProfile(walkerId),
                WalkerController.fetchWalkerSettings(walkerId).catch(err => {
                    return {
                        pricePerPet: 15000,
                        hasGPSTracker: false,
                        hasDiscount: false,
                        discountPercentage: 0,
                        location: 'Ubicación no disponible'
                    };
                })
            ]);
            
            setWalkerData(walkerProfile);
            setWalkerSettings(walkerConfig);
        } catch (err) {
            setWalkerError("Error al cargar la información del paseador.");
        } finally {
            setLoadingWalker(false);
        }
    }, [walkerId]);

    useEffect(() => {
        const loadWalkerReviews = async () => {
            try {
                setLoadingReviews(true);
                setReviewsError(null);
                if (!walkerId) return;
                
                const data = await ReviewsController.fetchReviewsByWalker(walkerId, currentPage, 6, searchTerm);
                
                setReviewsData(data);
            } catch (err) {
                setReviewsError("Error al cargar las reseñas del paseador.");
                setReviewsData({ reviews: [], pagination: {} });
            } finally {
                setLoadingReviews(false);
            }
        };

        if (walkerId) {
            loadWalkerReviews();
        }
    }, [walkerId, currentPage, searchTerm]); 

    useEffect(() => {
        if (walkerId) {
            loadWalkerData();
        }
    }, [loadWalkerData, walkerId]);

    const handleSearch = (search) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBackToWalkers = () => {
        navigateToContent('home');
    };

    const handleRequestWalk = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleRequestSent = () => {
        success('Solicitud de paseo enviada exitosamente', {
            title: 'Éxito',
            duration: 4000
        });
        setIsModalOpen(false);
    };

    if (loadingWalker) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-foreground dark:text-background">Cargando perfil del paseador...</p>
                </div>
            </div>
        );
    }

    if (walkerError || !walkerData) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{walkerError || "Paseador no encontrado"}</p>
                    <button 
                        onClick={handleBackToWalkers}
                        className={`${buttonBase} ${buttonInactive}`}
                    >
                        Volver a los paseadores
                    </button>
                </div>
            </div>
        );
    }

    const averageRating = reviewsData.reviews.length > 0 
        ? (reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsData.reviews.length).toFixed(1)
        : (walkerData.rating || '0.0');

    const completeWalkerData = {
        ...walkerData,
        pricePerPet: walkerSettings?.pricePerPet || walkerData.pricePerPet || 15000,
        hasGPSTracking: walkerSettings?.hasGPSTracker || walkerData.hasGPSTracking || false,
        location: walkerSettings?.location || walkerData.location || 'Ubicación no disponible',
        hasDiscount: walkerSettings?.hasDiscount || false,
        discountPercentage: walkerSettings?.discountPercentage || 0
    };
    
    return (
        <div className="w-full h-full p-6 bg-background dark:bg-foreground">
            <WalkerHeaderComponent
                walkerData={{
                    id: completeWalkerData.id,
                    fullName: completeWalkerData.name,
                    profileImage: completeWalkerData.image,
                    location: completeWalkerData.location,
                    verified: completeWalkerData.verified,
                    experienceYears: completeWalkerData.experience?.replace(' years', '') + ' años de experiencia',
                    pricePerPet: completeWalkerData.pricePerPet,
                    hasGPSTracker: completeWalkerData.hasGPSTracking,
                    hasDiscount: completeWalkerData.hasDiscount,
                    discountPercentage: completeWalkerData.discountPercentage
                }}
                averageRating={averageRating}
                reviewsCount={reviewsData.reviews.length}
                onRequestWalk={handleRequestWalk}
            />

            <WalkerReviewsComponent
                reviewsData={reviewsData}
                loadingReviews={loadingReviews}
                reviewsError={reviewsError}
                searchTerm={searchTerm}
                currentPage={currentPage}
                onSearchChange={handleSearch}
                onPageChange={handlePageChange}
            />

            <GetServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                walker={{
                    id: completeWalkerData.id,
                    name: completeWalkerData.name,
                    image: completeWalkerData.image,
                    location: completeWalkerData.location,
                    verified: completeWalkerData.verified,
                    experience: completeWalkerData.experience?.replace(' years', '') + ' años de experiencia',
                    pricePerPet: completeWalkerData.pricePerPet,
                    hasGPSTracker: completeWalkerData.hasGPSTracking,
                    hasDiscount: completeWalkerData.hasDiscount,
                    discountPercentage: completeWalkerData.discountPercentage
                }}
                onRequestSent={handleRequestSent}
            />
        </div>
    );
};

export default WalkerProfile;