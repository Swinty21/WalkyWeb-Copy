import { useState, useEffect } from 'react';
import { FaUsers, FaClock, FaCheckCircle, FaTimes, FaFilter } from 'react-icons/fa';
import { JoinToUsController } from '../../../BackEnd/Controllers/JoinToUsController';
import { UserController } from '../../../BackEnd/Controllers/UserController';

import ApplicationsList from '../Components/AdminApplicationsComponents/ApplicationsList';
import ApplicationDetails from '../Components/AdminApplicationsComponents/ApplicationDetails';
import ApplicationsStats from '../Components/AdminApplicationsComponents/ApplicationsStats';
import ReviewModal from '../Components/AdminApplicationsComponents/ReviewModal';

const AdminApplicationsManagement = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewAction, setReviewAction] = useState(null); // 'approve' or 'reject'
    const [activeFilter, setActiveFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        under_review: 0
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadApplications();
        loadStats();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, activeFilter]);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const response = await JoinToUsController.getAllRegistrations();
            setApplications(response);
        } catch (error) {
            console.error('Error loading applications:', error);
            setErrors({ load: 'Error al cargar las solicitudes' });
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await JoinToUsController.getRegistrationStats();
            setStats(response);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const filterApplications = () => {
        let filtered = [...applications];
        
        switch (activeFilter) {
            case 'new':
                filtered = applications.filter(app => 
                    ['pending', 'under_review'].includes(app.status)
                );
                break;
            case 'reviewed':
                filtered = applications.filter(app => 
                    ['approved', 'rejected'].includes(app.status)
                );
                break;
            case 'pending':
                filtered = applications.filter(app => app.status === 'pending');
                break;
            case 'approved':
                filtered = applications.filter(app => app.status === 'approved');
                break;
            case 'rejected':
                filtered = applications.filter(app => app.status === 'rejected');
                break;
            default:
                // 'all' - no filter
                break;
        }

        setFilteredApplications(filtered);
    };

    const handleApplicationSelect = (application) => {
        setSelectedApplication(application);
    };

    const handleReviewStart = (action) => {
        setReviewAction(action);
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (adminNotes = '') => {
        if (!selectedApplication || !reviewAction) return;

        try {
            setReviewing(true);
            setErrors({});

            await JoinToUsController.updateRegistrationStatus(
                selectedApplication.id,
                reviewAction === 'approve' ? 'approved' : 'rejected',
                adminNotes
            );

            await loadApplications();
            await loadStats();

            const updatedApplication = await JoinToUsController.getRegistrationById(selectedApplication.id);
            setSelectedApplication(updatedApplication);

            setShowReviewModal(false);
            setReviewAction(null);

        } catch (error) {
            console.error('Error reviewing application:', error);
            setErrors({ 
                review: error.message || 'Error al procesar la solicitud' 
            });
        } finally {
            setReviewing(false);
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setReviewAction(null);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg text-foreground dark:text-background ml-4">Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="mx-auto">
                <header className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                                    <FaUsers className="text-white text-xl" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                                        Gestión de Solicitudes
                                    </h1>
                                    <p className="text-white/80 text-sm mt-1">
                                        Administra las solicitudes de paseadores
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                    <div className="text-white/80 text-xs">Pendientes</div>
                                    <div className="text-white font-bold text-lg">{stats.pending + stats.under_review}</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                    <div className="text-white/80 text-xs">Aprobadas</div>
                                    <div className="text-white font-bold text-lg">{stats.approved}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <FaFilter className="text-white/80 mr-2" />
                            {[
                                { key: 'all', label: 'Todas', icon: FaUsers },
                                { key: 'new', label: 'Nuevas', icon: FaClock },
                                { key: 'approved', label: 'Aprobadas', icon: FaCheckCircle },
                                { key: 'rejected', label: 'Rechazadas', icon: FaTimes }
                            ].map(filter => (
                                <button
                                    key={filter.key}
                                    onClick={() => setActiveFilter(filter.key)}
                                    className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                        activeFilter === filter.key
                                            ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                                            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                    }`}
                                >
                                    <filter.icon size={16} />
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <ApplicationsStats stats={stats} />

                {errors.load && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 backdrop-blur-sm">
                        {errors.load}
                    </div>
                )}

                {errors.review && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 backdrop-blur-sm">
                        {errors.review}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-1">
                        <ApplicationsList
                            applications={filteredApplications}
                            selectedApplication={selectedApplication}
                            onApplicationSelect={handleApplicationSelect}
                            activeFilter={activeFilter}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        {selectedApplication ? (
                            <ApplicationDetails
                                application={selectedApplication}
                                onReviewStart={handleReviewStart}
                                reviewing={reviewing}
                            />
                        ) : (
                            <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 text-center shadow-lg">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaUsers className="text-4xl text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                    Selecciona una solicitud
                                </h3>
                                <p className="text-accent dark:text-muted">
                                    Elige una solicitud de la lista para ver sus detalles
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {showReviewModal && (
                    <ReviewModal
                        isOpen={showReviewModal}
                        onClose={handleCloseReviewModal}
                        onSubmit={handleReviewSubmit}
                        action={reviewAction}
                        application={selectedApplication}
                        loading={reviewing}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminApplicationsManagement;