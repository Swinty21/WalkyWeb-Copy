import { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import { WalksController } from '../../../BackEnd/Controllers/WalksController';
import { ReviewsController } from '../../../BackEnd/Controllers/ReviewsController';
import { useUser } from '../../../BackEnd/Context/UserContext';
import { useNavigation } from '../../../BackEnd/Context/NavigationContext';

import WalkerWalksHeaderComponent from '../Components/WalkerWalksComponents/WalkerWalksHeaderComponent';
import WalkerWalksCardComponent from '../Components/WalkerWalksComponents/WalkerWalksCardComponent';
import WalkerWalksFilter from '../Filters/WalkerWalks/WalkerWalksFilter';
import AcceptWalkModal from '../Modals/WalkerWalks/AcceptWalkModal';
import RejectWalkModal from '../Modals/WalkerWalks/RejectWalkModal';
import WaitingPaymentModal from '../Modals/WalkerWalks/WaitingPaymentModal';
import StartWalkModal from '../Modals/WalkerWalks/StartWalkModal';
import FinishWalkModal from '../Modals/WalkerWalks/FinishWalkModal';
import ReceiptModal from '../Modals/MyTrips/ReceiptModal';
import ViewReviewModal from '../Modals/MyTrips/ViewReviewModal';

const WalkerWalks = () => {
    const [walks, setWalks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("requests");
    const [searchQuery, setSearchQuery] = useState("");
    
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showWaitingPaymentModal, setShowWaitingPaymentModal] = useState(false);
    const [showStartWalkModal, setShowStartWalkModal] = useState(false);
    const [showFinishWalkModal, setShowFinishWalkModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showViewReviewModal, setShowViewReviewModal] = useState(false);

    const [selectedWalk, setSelectedWalk] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [walkToViewReview, setWalkToViewReview] = useState(null);
    const [currentReview, setCurrentReview] = useState(null);

    // Límites (los cuales dependeran del Plan de suscripcion del usuario)
    const MAX_ACCEPTED_WALKS = 5; 
    const MAX_ACTIVE_WALKS = 2; 

    const user = useUser();
    const walkerId = user?.id;
    const { navigateToContent } = useNavigation();

    useEffect(() => {
        const loadWalks = async () => {
            if (!walkerId) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const walksData = await WalksController.fetchWalksByWalker(walkerId);
                
                const walksWithReviews = await Promise.all(
                    walksData.map(async (walk) => {
                        if (walk.status === 'Finalizado') {
                            const review = await ReviewsController.fetchReviewByWalkId(walk.id);
                            return { ...walk, hasReview: !!review, reviewId: review?.id };
                        }
                        return walk;
                    })
                );
                
                setWalks(walksWithReviews);
            } catch (err) {
                setError('Error loading walks: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadWalks();
    }, [walkerId]);

    const countAcceptedWalks = () => {
        return walks.filter(walk => 
            ["Esperando pago", "Agendado"].includes(walk.status)
        ).length;
    };

    const countActiveWalks = () => {
        return walks.filter(walk => walk.status === "Activo").length;
    };

    const canAcceptWalk = () => {
        const acceptedCount = countAcceptedWalks();
        return acceptedCount < MAX_ACCEPTED_WALKS;
    };

    const canStartWalk = () => {
        const activeCount = countActiveWalks();
        return activeCount < MAX_ACTIVE_WALKS;
    };

    const handleAcceptWalk = (walk) => {
        if (!canAcceptWalk()) {
            setError(`No puedes aceptar más paseos. Límite máximo: ${MAX_ACCEPTED_WALKS} paseos aceptados simultáneamente.`);
            return;
        }
        
        setSelectedWalk(walk);
        setShowAcceptModal(true);
    };

    const handleConfirmAccept = async () => {
        if (!selectedWalk) return;
        
        if (!canAcceptWalk()) {
            setError(`No puedes aceptar más paseos. Límite máximo: ${MAX_ACCEPTED_WALKS} paseos aceptados simultáneamente.`);
            setShowAcceptModal(false);
            setSelectedWalk(null);
            return;
        }
        
        try {
            setActionLoading(true);
            await WalksController.acceptWalkRequest(selectedWalk.id);
            setWalks(walks.map(walk => 
                walk.id === selectedWalk.id 
                    ? { ...walk, status: 'Esperando pago' }
                    : walk
            ));
            setShowAcceptModal(false);
            setSelectedWalk(null);
        } catch (err) {
            setError('Error accepting walk: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectWalk = (walk) => {
        setSelectedWalk(walk);
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        if (!selectedWalk) return;
        
        try {
            setActionLoading(true);
            await WalksController.rejectWalkRequest(selectedWalk.id);
            setWalks(walks.map(walk => 
                walk.id === selectedWalk.id 
                    ? { ...walk, status: 'Rechazado' }
                    : walk
            ));
            setShowRejectModal(false);
            setSelectedWalk(null);
        } catch (err) {
            setError('Error rejecting walk: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinishWalk = (walk) => {
        setSelectedWalk(walk);
        setShowFinishWalkModal(true);
    };

    const handleConfirmFinishWalk = async () => {
        if (!selectedWalk) return;

        if (selectedWalk.status !== "Activo") {
            setError("Solo los paseos activos pueden finalizarse.");
            return;
        }

        try {
            setActionLoading(true);
            await WalksController.finishWalk(selectedWalk.id);
            setWalks(walks.map(walk => 
                walk.id === selectedWalk.id 
                    ? { ...walk, status: 'Finalizado' }
                    : walk
            ));
            setShowFinishWalkModal(false);
            setSelectedWalk(null);
        } catch (err) {
            setError('Error finishing walk: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleShowWaitingPayment = (walk) => {
        setSelectedWalk(walk);
        setShowWaitingPaymentModal(true);
    };

    const handleStartWalk = (walk) => {
        if (!canStartWalk()) {
            setError(`No puedes iniciar más paseos. Límite máximo: ${MAX_ACTIVE_WALKS} paseos activos simultáneamente.`);
            return;
        }
        
        setSelectedWalk(walk);
        setShowStartWalkModal(true);
    };

    const handleConfirmStartWalk = async () => {
        if (!selectedWalk) return;
        
        if (!canStartWalk()) {
            setError(`No puedes iniciar más paseos. Límite máximo: ${MAX_ACTIVE_WALKS} paseos activos simultáneamente.`);
            setShowStartWalkModal(false);
            setSelectedWalk(null);
            return;
        }
        
        try {
            setActionLoading(true);
            await WalksController.startWalk(selectedWalk.id);
            setWalks(walks.map(walk => 
                walk.id === selectedWalk.id 
                    ? { ...walk, status: 'Activo' }
                    : walk
            ));
            setShowStartWalkModal(false);
            setSelectedWalk(null);
        } catch (err) {
            setError('Error starting walk: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewWalk = (walkId) => {
        navigateToContent('trip', { tripId: walkId });
    };

    const handleViewReceipt = async (walkId) => {
        try {
            setReceiptLoading(true);
            const receipt = await WalksController.getWalkReceipt(walkId);
            setCurrentReceipt(receipt);
            setShowReceiptModal(true);
        } catch (err) {
            setError('Error loading receipt: ' + err.message);
            console.error('Error loading receipt:', err);
        } finally {
            setReceiptLoading(false);
        }
    };

    const handleCloseReceiptModal = () => {
        setShowReceiptModal(false);
        setCurrentReceipt(null);
    };

    const handleViewReview = async (walk) => {
        try {
            setWalkToViewReview(walk);
            const review = await ReviewsController.fetchReviewByWalkId(walk.id);
            setCurrentReview(review);
            setShowViewReviewModal(true);
        } catch (err) {
            setError('Error loading review: ' + err.message);
        }
    };

    const handleCloseViewReviewModal = () => {
        setShowViewReviewModal(false);
        setWalkToViewReview(null);
        setCurrentReview(null);
    };

    const handleCloseModals = () => {
        setShowAcceptModal(false);
        setShowRejectModal(false);
        setShowWaitingPaymentModal(false);
        setShowStartWalkModal(false);
        setShowFinishWalkModal(false);
        setSelectedWalk(null);
        setError(null);
    };

    const filteredWalks = walks.filter((walk) => {
        let isInTab = false;
        
        switch (activeTab) {
            case "requests":
                isInTab = ["Solicitado", "Esperando pago", "Agendado"].includes(walk.status);
                break;
            case "active":
                isInTab = walk.status === "Activo";
                break;
            case "history":
                isInTab = ["Cancelado", "Finalizado", "Rechazado"].includes(walk.status);
                break;
            default:
                isInTab = false;
        }

        const matchesSearch = walk.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                walk.notes?.toLowerCase().includes(searchQuery.toLowerCase());

        return isInTab && matchesSearch;
    });

    const requestsCount = walks.filter(walk => 
        ["Solicitado", "Esperando pago", "Agendado"].includes(walk.status)
    ).length;

    const activeCount = walks.filter(walk => 
        walk.status === "Activo"
    ).length;

    const historyCount = walks.filter(walk => 
        ["Cancelado", "Finalizado", "Rechazado"].includes(walk.status)
    ).length;

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

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

    return (
        <div className="max-w- min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="mx-auto">
                
                <WalkerWalksHeaderComponent 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    requestsCount={requestsCount}
                    activeCount={activeCount}
                    historyCount={historyCount}
                />

                <div className="mb-6 bg-gradient-to-r from-info/10 to-primary/10 rounded-xl p-4 border border-info/20">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-6">
                            <div className="text-sm">
                                <span className="text-foreground dark:text-background font-medium">
                                    Paseos Aceptados: 
                                </span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                    countAcceptedWalks() >= MAX_ACCEPTED_WALKS 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-success text-white'
                                }`}>
                                    {countAcceptedWalks()}/{MAX_ACCEPTED_WALKS}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="text-foreground dark:text-background font-medium">
                                    Paseos Activos: 
                                </span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                    countActiveWalks() >= MAX_ACTIVE_WALKS 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-primary text-white'
                                }`}>
                                    {countActiveWalks()}/{MAX_ACTIVE_WALKS}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-accent dark:text-muted">
                            Límites de capacidad del paseador
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                <WalkerWalksFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {filteredWalks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiCalendar className="text-4xl text-primary" />
                            </div>
                            <p className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                {activeTab === "requests" && "No tienes solicitudes pendientes"}
                                {activeTab === "active" && "No tienes paseos activos"}
                                {activeTab === "history" && "No hay paseos en el historial"}
                            </p>
                            <p className="text-accent dark:text-muted">
                                {activeTab === "requests" && "Las nuevas solicitudes aparecerán aquí"}
                                {activeTab === "active" && "Los paseos en progreso aparecerán aquí"}
                                {activeTab === "history" && "Tus paseos completados aparecerán aquí"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-[repeat(auto-fill,350px)] justify-center">
                        {filteredWalks.map((walk) => (
                            <WalkerWalksCardComponent 
                                key={walk.id}
                                walk={walk}
                                onAcceptWalk={handleAcceptWalk}
                                onRejectWalk={handleRejectWalk}
                                onShowWaitingPayment={handleShowWaitingPayment}
                                onStartWalk={handleStartWalk}
                                onViewWalk={handleViewWalk}
                                onFinishWalk={handleFinishWalk}
                                onViewReceipt={handleViewReceipt}
                                onViewReview={handleViewReview}
                                canAcceptMore={canAcceptWalk()}
                                canStartMore={canStartWalk()}
                            />
                        ))}
                    </div>
                )}

                <AcceptWalkModal 
                    isOpen={showAcceptModal}
                    onClose={handleCloseModals}
                    onConfirm={handleConfirmAccept}
                    walkData={selectedWalk}
                    isLoading={actionLoading}
                />

                <RejectWalkModal 
                    isOpen={showRejectModal}
                    onClose={handleCloseModals}
                    onConfirm={handleConfirmReject}
                    walkData={selectedWalk}
                    isLoading={actionLoading}
                />

                <WaitingPaymentModal 
                    isOpen={showWaitingPaymentModal}
                    onClose={handleCloseModals}
                    walkData={selectedWalk}
                />

                <StartWalkModal 
                    isOpen={showStartWalkModal}
                    onClose={handleCloseModals}
                    onConfirm={handleConfirmStartWalk}
                    walkData={selectedWalk}
                    isLoading={actionLoading}
                />

                <FinishWalkModal 
                    isOpen={showFinishWalkModal}
                    onClose={handleCloseModals}
                    onConfirm={handleConfirmFinishWalk}
                    walkData={selectedWalk}
                    isLoading={actionLoading}
                />

                <ReceiptModal 
                    isOpen={showReceiptModal}
                    onClose={handleCloseReceiptModal}
                    receipt={currentReceipt}
                    loading={receiptLoading}
                />

                <ViewReviewModal 
                    isOpen={showViewReviewModal}
                    onClose={handleCloseViewReviewModal}
                    reviewData={currentReview}
                    tripData={walkToViewReview}
                />

            </div>
        </div>
    );
};

export default WalkerWalks;