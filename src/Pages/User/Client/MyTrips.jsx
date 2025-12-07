import { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import { WalksController } from '../../../BackEnd/Controllers/WalksController';
import { WalkerController } from '../../../BackEnd/Controllers/WalkerController';
import { PetsController } from '../../../BackEnd/Controllers/PetsController';
import { ReviewsController } from '../../../BackEnd/Controllers/ReviewsController';
import { useUser } from '../../../BackEnd/Context/UserContext';
import { useNavigation } from '../../../BackEnd/Context/NavigationContext';
import { useToast } from '../../../BackEnd/Context/ToastContext';

import MyTripsHeaderComponent from '../Components/MyTripsComponents/MyTripsHeaderComponent';
import MyTripsCardComponent from '../Components/MyTripsComponents/MyTripsCardComponent';
import MyTripsFilter from '../Filters/MyTrips/MyTripsFilter';
import CancelWalkModal from '../Modals/MyTrips/CancelWalkModal';
import GetServiceModal_Client from '../Modals/MyTrips/GetServiceModal_Client';
import PaymentModal from '../Modals/MyTrips/PaymentModal';
import PaymentProcessModal from '../Modals/MyTrips/PaymentProcessModal';
import ReviewModal from '../Modals/MyTrips/ReviewModal';
import ViewReviewModal from '../Modals/MyTrips/ViewReviewModal';
import ReceiptModal from '../Modals/MyTrips/ReceiptModal';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("active");
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const [walkers, setWalkers] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedWalker, setSelectedWalker] = useState(null);
    const [selectedPets, setSelectedPets] = useState([]);
    const [walkDate, setWalkDate] = useState('');
    const [walkTime, setWalkTime] = useState('');
    const [startAddress, setStartAddress] = useState('');
    const [description, setDescription] = useState('');
    const [loadingModal, setLoadingModal] = useState(false);
    const [loadingWalkers, setLoadingWalkers] = useState(false);
    const [loadingPets, setLoadingPets] = useState(false);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [tripToCancel, setTripToCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tripToPay, setTripToPay] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [showPaymentProcessModal, setShowPaymentProcessModal] = useState(false);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [tripToReview, setTripToReview] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);

    const [showViewReviewModal, setShowViewReviewModal] = useState(false);
    const [tripToViewReview, setTripToViewReview] = useState(null);
    const [currentReview, setCurrentReview] = useState(null);

    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);

    const user = useUser();
    const userId = user?.id;
    const { navigateToContent } = useNavigation();
    const { success, warning } = useToast();

    useEffect(() => {
        const loadTrips = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const tripsData = await WalksController.fetchWalksByOwner(userId);
                
                const tripsWithReviews = await Promise.all(
                    tripsData.map(async (trip) => {
                        if (trip.status === 'Finalizado') {
                            const review = await ReviewsController.fetchReviewByWalkId(trip.id);
                            return { ...trip, hasReview: !!review, reviewId: review?.id };
                        }
                        return trip;
                    })
                );
                
                setTrips(tripsWithReviews);
            } catch (err) {
                setError('Error loading trips: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTrips();
    }, [userId]);

    useEffect(() => {
        if (showCreateForm && userId) {
            loadModalData();
        }
    }, [showCreateForm, userId]);

    const handleCancelTrip = (trip) => {
        setTripToCancel(trip);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!tripToCancel) return;
        
        try {
            setCancelLoading(true);
            await WalksController.changeWalkStatus(tripToCancel.id, 'Cancelado');
            setTrips(trips.map(trip => 
                trip.id === tripToCancel.id 
                    ? { ...trip, status: 'Cancelado' }
                    : trip
            ));
            setShowCancelModal(false);
            setTripToCancel(null);
            success('Paseo cancelado', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (err) {
            warning('Error al cancelar el paseo', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setCancelLoading(false);
        }
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setTripToCancel(null);
    };

    const handlePayTrip = (trip) => {
        setTripToPay(trip);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!tripToPay) return;
        
        setShowPaymentModal(false);
        setShowPaymentProcessModal(true);
        
        try {
            setPaymentLoading(true);
            await WalksController.changeWalkStatus(tripToPay.id, 'Agendado');
            setTrips(trips.map(trip => 
                trip.id === tripToPay.id 
                    ? { ...trip, status: 'Agendado' }
                    : trip
            ));
        } catch (err) {
            setShowPaymentProcessModal(false);
            warning('Error al realizar el pago, contacte con un administrador', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setTripToPay(null);
    };

    const handleClosePaymentProcessModal = () => {
        setShowPaymentProcessModal(false);
        setTripToPay(null);
    };

    const handleCreateReview = async (trip) => {
        const completeTrip = await WalksController.fetchWalkDetails(trip.id);
        setTripToReview(completeTrip);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (reviewData) => {
        if (!tripToReview) return;
        
        try {
            setReviewLoading(true);
            await ReviewsController.createReview({
                walkId: reviewData.id,
                walkerId: reviewData.walkerId,
                rating: reviewData.rating,
                content: reviewData.content
            });
            
            setTrips(trips.map(trip => 
                trip.id === tripToReview.id 
                    ? { ...trip, hasReview: true }
                    : trip
            ));
            
            setShowReviewModal(false);
            setTripToReview(null);
            success('Review creada correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (err) {
            warning('Error al crear la review correctamente', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setReviewLoading(false);
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setTripToReview(null);
    };

    const handleViewReview = async (trip) => {
        try {
            setTripToViewReview(trip);
            const review = await ReviewsController.fetchReviewByWalkId(trip.id);
            setCurrentReview(review);
            setShowViewReviewModal(true);
        } catch (err) {
            warning('Error al cargar la review', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const handleCloseViewReviewModal = () => {
        setShowViewReviewModal(false);
        setTripToViewReview(null);
        setCurrentReview(null);
    };

    const handleViewReceipt = async (tripId) => {
        try {
            setReceiptLoading(true);
            const receipt = await WalksController.getWalkReceipt(tripId);
            setCurrentReceipt(receipt);
            setShowReceiptModal(true);
        } catch (err) {
            warning('Error al cargar el recibo', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setReceiptLoading(false);
        }
    };

    const handleCloseReceiptModal = () => {
        setShowReceiptModal(false);
        setCurrentReceipt(null);
    };

    const loadModalData = async () => {
        try {
            setLoadingWalkers(true);
            setLoadingPets(true);
            
            const [walkersData, petsData] = await Promise.all([
                WalkerController.fetchWalkersForHome(),
                PetsController.fetchPetsByOwner(userId)
            ]);
            
            const realWalkers = walkersData.filter(walker => !walker.isPlaceholder);
            setWalkers(realWalkers);
            setPets(petsData);
        } catch (err) {
            setError('Error loading modal data: ' + err.message);
        } finally {
            setLoadingWalkers(false);
            setLoadingPets(false);
        }
    };

    const handleCreateTrip = async (e) => {
        e.preventDefault();
        
        if (!selectedWalker) {
            setError('Debe seleccionar un paseador');
            return;
        }
        
        if (selectedPets.length === 0) {
            setError('Debe seleccionar al menos una mascota');
            return;
        }

        if (!walkDate || !walkTime) {
            setError('Debe seleccionar fecha y hora');
            return;
        }

        if (!startAddress || startAddress.trim() === '') {
            setError('Debe ingresar la dirección de inicio del paseo');
            return;
        }

        try {
            setLoadingModal(true);
            setError(null);

            const scheduledDateTime = new Date(`${walkDate}T${walkTime}`).toISOString();

            const walkRequest = {
                walkerId: selectedWalker.id,
                ownerId: userId,
                petIds: selectedPets,
                scheduledDateTime: scheduledDateTime,
                startAddress: startAddress.trim(),
                totalPrice: selectedPets.length * (selectedWalker.pricePerPet || 15000),
                description: description.trim() || undefined
            };

            const createdTrip = await WalksController.createWalkRequest(walkRequest);
            
            const newTrip = {
                id: createdTrip.id,
                dogName: selectedPets.map(petId => pets.find(p => p.id === petId)?.name).join(', '),
                walker: selectedWalker.name,
                walkerId: selectedWalker.id,
                startTime: walkRequest.scheduledDateTime,
                endTime: null,
                startAddress: createdTrip.startAddress.trim(),
                status: 'Solicitado',
                duration: null,
                distance: null,
                notes: description,
                totalPrice: walkRequest.totalPrice,
                hasReview: false
            };
            
            setTrips([newTrip, ...trips]);
            handleCloseModal();
            success('Solicitud de paseo enviada exitosamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (err) {
            warning('Una o varias de las mascotas seleccionadas ya tienen un paseo activo/pendiente', {
                title: 'Error al solicitar el paseo:',
                duration: 4000
            });
        } finally {
            setLoadingModal(false);
        }
    };

    const handleCloseModal = () => {
        setShowCreateForm(false);
        setSelectedWalker(null);
        setSelectedPets([]);
        setWalkDate('');
        setWalkTime('');
        setStartAddress('');
        setDescription('');
        setError(null);
    };

    const handleViewTrip = (tripId) => {
        navigateToContent('trip', { tripId });
    };

    const handlePetSelection = (petId) => {
        setSelectedPets(prev => 
            prev.includes(petId) 
                ? prev.filter(id => id !== petId)
                : [...prev, petId]
        );
    };

    const filteredTrips = trips.filter((trip) => {
        const isActive = activeTab === "active" ?
            ["Solicitado", "Esperando pago", "Agendado", "Activo"].includes(trip.status) :
            ["Cancelado", "Rechazado", "Finalizado"].includes(trip.status);

        const matchesSearch = trip.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                trip.walker?.toLowerCase().includes(searchQuery.toLowerCase());

        return isActive && matchesSearch;
    });

    const activeTripsCount = trips.filter(trip => 
        ["Solicitado", "Esperando pago", "Agendado", "Activo"].includes(trip.status)
    ).length;

    const completedTripsCount = trips.filter(trip => 
        ["Cancelado", "Rechazado", "Finalizado"].includes(trip.status)
    ).length;

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg text-foreground dark:text-background ml-4">Cargando paseos...</p>
                </div>
            </div>
        );
    }

    if (error && !showCreateForm) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-danger">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="mx-auto">
                
                <MyTripsHeaderComponent 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setShowCreateForm={setShowCreateForm}
                    activeTripsCount={activeTripsCount}
                    completedTripsCount={completedTripsCount}
                />

                <MyTripsFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {filteredTrips.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiCalendar className="text-4xl text-primary" />
                            </div>
                            <p className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                {activeTab === "active" ? "No tienes paseos activos" : "No hay paseos en el historial"}
                            </p>
                            <p className="text-accent dark:text-muted">
                                {activeTab === "active" ? "¡Programa tu primer paseo!" : "Tus paseos completados aparecerán aquí"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 auto-rows-max justify-items-center" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 450px))'}}>
                        {filteredTrips.map((trip) => (
                            <MyTripsCardComponent 
                                key={trip.id}
                                trip={trip}
                                onViewTrip={handleViewTrip}
                                onCancelTrip={handleCancelTrip}
                                onPayTrip={handlePayTrip}
                                onCreateReview={handleCreateReview}
                                onViewReview={handleViewReview}
                                onViewReceipt={handleViewReceipt}
                            />
                        ))}
                    </div>
                )}

                <GetServiceModal_Client 
                    showCreateForm={showCreateForm}
                    onCloseModal={handleCloseModal}
                    onSubmit={handleCreateTrip}
                    error={error}
                    walkers={walkers}
                    pets={pets}
                    selectedWalker={selectedWalker}
                    setSelectedWalker={setSelectedWalker}
                    selectedPets={selectedPets}
                    onPetSelection={handlePetSelection}
                    walkDate={walkDate}
                    setWalkDate={setWalkDate}
                    walkTime={walkTime}
                    setWalkTime={setWalkTime}
                    startAddress={startAddress}
                    setStartAddress={setStartAddress}
                    description={description}
                    setDescription={setDescription}
                    loadingModal={loadingModal}
                    loadingWalkers={loadingWalkers}
                    loadingPets={loadingPets}
                />

                <CancelWalkModal 
                    isOpen={showCancelModal}
                    onClose={handleCloseCancelModal}
                    onConfirm={handleConfirmCancel}
                    tripData={tripToCancel}
                    isLoading={cancelLoading}
                />

                <PaymentModal 
                    isOpen={showPaymentModal}
                    onClose={handleClosePaymentModal}
                    onConfirm={handleConfirmPayment}
                    tripData={tripToPay}
                    isLoading={paymentLoading}
                />

                <PaymentProcessModal 
                    isOpen={showPaymentProcessModal}
                    onClose={handleClosePaymentProcessModal}
                    tripData={tripToPay}
                    totalAmount={tripToPay?.totalPrice ? tripToPay.totalPrice + Math.round(tripToPay.totalPrice * 0.035) : 0}
                />

                <ReviewModal 
                    isOpen={showReviewModal}
                    onClose={handleCloseReviewModal}
                    onSubmit={handleSubmitReview}
                    tripData={tripToReview}
                    isLoading={reviewLoading}
                />

                <ViewReviewModal 
                    isOpen={showViewReviewModal}
                    onClose={handleCloseViewReviewModal}
                    reviewData={currentReview}
                    tripData={tripToViewReview}
                />

                <ReceiptModal 
                    isOpen={showReceiptModal}
                    onClose={handleCloseReceiptModal}
                    receipt={currentReceipt}
                    loading={receiptLoading}
                />
            </div>
        </div>
    );
};

export default MyTrips;