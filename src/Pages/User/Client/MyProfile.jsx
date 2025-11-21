import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../../BackEnd/Context/UserContext";
import { WalksController } from "../../../BackEnd/Controllers/WalksController"
import { PetsController } from "../../../BackEnd/Controllers/PetsController";
import { ReviewsController } from "../../../BackEnd/Controllers/ReviewsController";
import { UserController } from "../../../BackEnd/Controllers/UserController";
import { useNavigation } from "../../../BackEnd/Context/NavigationContext";
import { useToast } from '../../../BackEnd/Context/ToastContext';
import HeaderComponent from "../Components/ProfileComponents/HeaderComponent";
import PersonalDetailsComponent from "../Components/ProfileComponents/PersonalDetailsComponent";
import TripsComponent from "../Components/ProfileComponents/TripsComponent";
import PetsComponent from "../Components/ProfileComponents/PetsComponent";
import ReviewsComponent from "../Components/ProfileComponents/ReviewsComponent";

const MyProfile = () => {
    const [activeTab, setActiveTab] = useState("trips");
    const [trips, setTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [tripsError, setTripsError] = useState(null);
    
    // Estados para mascotas
    const [pets, setPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const [petsError, setPetsError] = useState(null);
    
    // Estados para reviews
    const [reviewsData, setReviewsData] = useState({ reviews: [], pagination: {} });
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [userProfileData, setUserProfileData] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const { navigateToContent } = useNavigation();
    const user = useUser();
    const { success, warning } = useToast();

    const loadUserProfile = useCallback(async () => {
        try {
            if (!user?.id) return;
            
            const fullProfile = await UserController.fetchUserById(user.id);

            setUserProfileData({
                id: fullProfile.id,
                name: fullProfile.fullName || "X",
                email: fullProfile.email || "sin-email@example.com",
                avatar: fullProfile.profileImage || "X",
                joinedDate: fullProfile.joinedDate || new Date().toISOString(),
                rol: fullProfile.role || "No disponible",
                contact: fullProfile.phone || "No disponible",
                suscription: user?.suscription || "No Disponible",
                location: fullProfile.location || "No disponible"
            });
        } catch (error) {
            setUserProfileData({
                id: user?.id,
                name: user?.fullName || "X",
                email: user?.email || "sin-email@example.com",
                avatar: user?.profileImage || "X",
                joinedDate: user?.createdAt || new Date().toISOString(),
                rol: user?.role || "No disponible",
                contact: user?.phone || "No disponible",
                suscription: user?.suscription || "No Disponible",
                location: user?.location || "No disponible"
            });
        }
    }, [user]);

    useEffect(() => {
        loadUserProfile();
    }, [user, refreshTrigger, loadUserProfile]);

    const buttonBase = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm";
    const buttonActive = "bg-primary text-white shadow-md";
    const buttonInactive = "bg-background dark:bg-foreground border border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md";

    const loadTrips = useCallback(async () => {
        try {
            setLoadingTrips(true);
            setTripsError(null);
            if (!user?.id) return;
            const data = await WalksController.fetchWalksByOwner(user.id);
            setTrips(data.slice(0, 10));
        } catch (err) {
            setTripsError("Error al cargar los paseos.");
        } finally {
            setLoadingTrips(false);
        }
    }, [user?.id]);

    const loadPets = useCallback(async () => {
        try {
            setLoadingPets(true);
            setPetsError(null);
            if (!user?.id) return;
            const data = await PetsController.fetchPetsByOwner(user.id);
            setPets(data);
        } catch (err) {
            setPetsError("Error al cargar las mascotas.");
        } finally {
            setLoadingPets(false);
        }
    }, [user?.id]);

    const loadReviews = useCallback(async (page = 1, search = "") => {
        try {
            setLoadingReviews(true);
            setReviewsError(null);
            if (!user?.id) return;
            const data = await ReviewsController.fetchReviewsByUser(user.id, page, 6, search);
            setReviewsData(data);
        } catch (err) {
            setReviewsError("Error al cargar las reseñas.");
        } finally {
            setLoadingReviews(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadTrips();
    }, [loadTrips, refreshTrigger]);

    useEffect(() => {
        loadPets();
    }, [loadPets, refreshTrigger]);

    useEffect(() => {
        loadReviews(currentPage, searchTerm);
    }, [loadReviews, refreshTrigger, currentPage, searchTerm]);

    const handleCancelTrip = async (tripId) => {
        try {
            await WalksController.cancelWalk(tripId);
            setTrips((prevTrips) =>
                prevTrips.map((t) =>
                    t.id === tripId ? { ...t, status: "Cancelado" } : t
                )
            );
            success('Paseo cancelado correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (err) {
            warning('No se pudo cancelar el paseo', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        try {
            user.name = updatedData.name;
            user.phone = updatedData.phone;
            user.location = updatedData.location;
            user.profileImage = updatedData.avatar;
            
            await UserController.updateUser(user.id, user);
            
            setRefreshTrigger(prev => prev + 1);
            success('Perfil actualizado correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (error) {
            warning('Error al actualizar el perfil', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const handleAddPet = async (petData) => {
        try {
            await PetsController.createPet(user.id, petData);
            setRefreshTrigger(prev => prev + 1);
            success('Mascota agregada correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (error) {
            warning('Error al agregar mascota', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const handleEditPet = async (petId, petData) => {
        try {
            await PetsController.updatePet(petId, petData);
            setRefreshTrigger(prev => prev + 1);
            success('Mascota Editada correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (error) {
            warning('No puedes editar tu mascota porque está asignada a un paseo activo o programado', {
                title: 'Error al actualizar la mascota:',
                duration: 4000
            });
        }
    };

    const handleDeletePet = async (petId) => {
        try {
            await PetsController.deletePet(petId);
            setRefreshTrigger(prev => prev + 1);
            success('Mascota Eliminada correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (error) {
            warning('No puedes eliminar tu mascota porque está asignada a un paseo activo o programado', {
                title: 'Error al eliminar la mascota:',
                duration: 4000
            });
        }
    };

    const handleEditReview = async (reviewId, reviewData) => {
        try {
            await ReviewsController.updateReview(reviewId, reviewData);
            setRefreshTrigger(prev => prev + 1);
            success('Reseña actualizada correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (error) {
            warning('Error al actualizar reseñae', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (search) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    return (
        <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
            <HeaderComponent 
                userData={userProfileData} 
                buttonBase={buttonBase} 
                buttonInactive={buttonInactive}
                onUpdateProfile={handleUpdateProfile}
                userId={user?.id}
            />
            <PersonalDetailsComponent userData={userProfileData} />

            {user.role === "client" && (
                <>
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab("trips")}
                            className={`${buttonBase} ${activeTab === "trips" ? buttonActive : buttonInactive}`}
                        >
                            Trips
                        </button>
                        <button
                            onClick={() => setActiveTab("pets")}
                            className={`${buttonBase} ${activeTab === "pets" ? buttonActive : buttonInactive}`}
                        >
                            Pets
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`${buttonBase} ${activeTab === "reviews" ? buttonActive : buttonInactive}`}
                        >
                            Reviews
                        </button>
                    </div>
                    {activeTab === "trips" && (
                        <TripsComponent
                            trips={trips}
                            onCancel={handleCancelTrip}
                            onView={(tripId) => navigateToContent("trip", { tripId })}
                            tripsError={tripsError}
                            tripsLoading={loadingTrips}
                        />
                    )}

                    {activeTab === "pets" && (
                        <PetsComponent
                            pets={pets}
                            addButtonClass={`${buttonBase} ${buttonInactive}`}
                            onAddPet={handleAddPet}
                            onEditPet={handleEditPet}
                            onDeletePet={handleDeletePet}
                            isLoading={loadingPets}
                            error={petsError}
                        />
                    )}

                    {activeTab === "reviews" && (
                        <ReviewsComponent
                            reviewsData={reviewsData}
                            onEditReview={handleEditReview}
                            onPageChange={handlePageChange}
                            onSearch={handleSearch}
                            isLoading={loadingReviews}
                            error={reviewsError}
                        />
                    )}
                </>
            )}

        </div>
    );
};

export default MyProfile;