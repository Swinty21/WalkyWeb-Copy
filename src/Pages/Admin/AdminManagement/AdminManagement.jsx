import { useState, useEffect } from "react";
import { FiSettings, FiImage, FiDollarSign } from "react-icons/fi";
import { BannersController } from '../../../BackEnd/Controllers/BannersController';
import { SettingsController } from '../../../BackEnd/Controllers/SettingsController';
import { useToast } from '../../../BackEnd/Context/ToastContext';

import AdminManagementHeaderComponent from '../Components/AdminManagementComponents/AdminManagementHeaderComponent';
import AdminBannersSection from '../Components/AdminManagementComponents/AdminBannersSection';
import AdminPlansSection from '../Components/AdminManagementComponents/AdminPlansSection';
import BannerModal from '../Components/AdminManagementComponents/BannerModal';
import PlanModal from '../Components/AdminManagementComponents/PlanModal';
import ConfirmationDeleteModal from '../Components/AdminManagementComponents/ConfirmationDeleteModal';

const AdminManagement = () => {
    const [activeTab, setActiveTab] = useState("banners");
    const [loading, setLoading] = useState(true);
    const { success, error, info } = useToast();

    const [banners, setBanners] = useState([]);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [bannerActionLoading, setBannerActionLoading] = useState(false);

    const [plans, setPlans] = useState([]);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [planActionLoading, setPlanActionLoading] = useState(false);
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteItemType, setDeleteItemType] = useState('plan');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            const [bannersData, plansData] = await Promise.all([
                BannersController.getAllBanners(),
                SettingsController.getAllSubscriptionPlans()
            ]);

            setBanners(bannersData);
            setPlans(plansData);
            
        } catch (err) {
            console.error('Error loading data:', err);
            error('Error al cargar los datos', {
                title: 'Error de Carga',
                duration: 6000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBanner = () => {
        setEditingBanner(null);
        setShowBannerModal(true);
    };

    const handleEditBanner = (banner) => {
        setEditingBanner(banner);
        setShowBannerModal(true);
    };

    const handleSaveBanner = async (bannerData) => {
        try {
            setBannerActionLoading(true);
            
            if (editingBanner) {
                await BannersController.updateBanner(editingBanner.id, bannerData);
                success('Banner actualizado correctamente', {
                    title: 'Éxito',
                    duration: 4000
                });
            } else {
                await BannersController.createBanner(bannerData);
                success('Banner creado correctamente', {
                    title: 'Éxito',
                    duration: 4000
                });
            }
            
            await loadData();
            setShowBannerModal(false);
            setEditingBanner(null);
        } catch (err) {
            console.error('Error saving banner:', err);
            error(err.message || 'Error al guardar el banner', {
                title: 'Error al Guardar',
                duration: 6000
            });
        } finally {
            setBannerActionLoading(false);
        }
    };

    const handleDeleteBanner = (bannerId) => {
        const banner = banners.find(b => b.id === bannerId);
        if (banner) {
            setItemToDelete(banner);
            setDeleteItemType('banner');
            setShowDeleteModal(true);
        }
    };

    const handleToggleBannerStatus = async (bannerId) => {
        try {
            setBannerActionLoading(true);
            await BannersController.toggleBannerStatus(bannerId);
            info('Estado del banner actualizado', {
                title: 'Actualizado',
                duration: 3000
            });
            await loadData();
        } catch (err) {
            console.error('Error updating banner status:', err);
            error(err.message || 'Error al actualizar el estado del banner', {
                title: 'Error de Estado',
                duration: 6000
            });
        } finally {
            setBannerActionLoading(false);
        }
    };

    const handleCreatePlan = () => {
        setEditingPlan(null);
        setShowPlanModal(true);
    };

    const handleEditPlan = (plan) => {
        setEditingPlan(plan);
        setShowPlanModal(true);
    };

    const handleSavePlan = async (planData) => {
        try {
            setPlanActionLoading(true);
            
            if (editingPlan) {
                await SettingsController.updateSubscriptionPlan(editingPlan.plan_id || editingPlan.id, planData);
                success('Plan actualizado correctamente', {
                    title: 'Éxito',
                    duration: 4000
                });
            } else {
                await SettingsController.createSubscriptionPlan(planData);
                success('Plan creado correctamente', {
                    title: 'Éxito',
                    duration: 4000
                });
            }
            
            await loadData();
            setShowPlanModal(false);
            setEditingPlan(null);
        } catch (err) {
            console.error('Error saving plan:', err);
            error(err.message || 'Error al guardar el plan', {
                title: 'Error al Guardar',
                duration: 6000
            });
        } finally {
            setPlanActionLoading(false);
        }
    };

    const handleDeletePlan = (planId) => {
        const plan = plans.find(p => p.plan_id === planId);
        if (plan) {
            setItemToDelete(plan);
            setDeleteItemType('plan');
            setShowDeleteModal(true);
        }
    };

    const handleTogglePlanStatus = async (planId) => {
        try {
            setPlanActionLoading(true);
            await SettingsController.togglePlanStatus(planId);
            info('Estado del plan actualizado', {
                title: 'Actualizado',
                duration: 3000
            });
            await loadData();
        } catch (err) {
            console.error('Error updating plan status:', err);
            error(err.message || 'Error al actualizar el estado del plan', {
                title: 'Error de Estado',
                duration: 6000
            });
        } finally {
            setPlanActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        
        try {
            if (deleteItemType === 'banner') {
                setBannerActionLoading(true);
                await BannersController.deleteBanner(itemToDelete.id);
                success('Banner eliminado correctamente', {
                    title: 'Éxito',
                    duration: 4000
                });
            } else if (deleteItemType === 'plan') {
                setPlanActionLoading(true);
                await SettingsController.deleteSubscriptionPlan(itemToDelete.plan_id);
                success('Plan eliminado correctamente', {
                    title: 'Éxito',
                    duration: 4000
                });
            }
            
            await loadData();
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (err) {
            console.error(`Error deleting ${deleteItemType}:`, err);
            error(err.message || `Error al eliminar el ${deleteItemType === 'banner' ? 'banner' : 'plan'}`, {
                title: 'Error al Eliminar',
                duration: 6000
            });
        } finally {
            if (deleteItemType === 'banner') {
                setBannerActionLoading(false);
            } else if (deleteItemType === 'plan') {
                setPlanActionLoading(false);
            }
        }
    };

    const activeBannersCount = banners.filter(b => b.isActive).length;
    const activePlansCount = plans.filter(p => p.is_active && p.plan_id !== 'free').length;

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg text-foreground dark:text-background ml-4">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="mx-auto">
                
                <AdminManagementHeaderComponent 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    activeBannersCount={activeBannersCount}
                    activePlansCount={activePlansCount}
                    totalBanners={banners.length}
                    totalPlans={plans.length}
                />

                {activeTab === "banners" && (
                    <AdminBannersSection 
                        banners={banners}
                        onCreateBanner={handleCreateBanner}
                        onEditBanner={handleEditBanner}
                        onDeleteBanner={handleDeleteBanner}
                        onToggleStatus={handleToggleBannerStatus}
                        loading={bannerActionLoading}
                    />
                )}

                {activeTab === "plans" && (
                    <AdminPlansSection 
                        plans={plans}
                        onCreatePlan={handleCreatePlan}
                        onEditPlan={handleEditPlan}
                        onDeletePlan={handleDeletePlan}
                        onToggleStatus={handleTogglePlanStatus}
                        loading={planActionLoading}
                    />
                )}

                <BannerModal 
                    isOpen={showBannerModal}
                    onClose={() => {
                        setShowBannerModal(false);
                        setEditingBanner(null);
                    }}
                    onSave={handleSaveBanner}
                    bannerData={editingBanner}
                    isLoading={bannerActionLoading}
                    activeBannersCount={activeBannersCount}
                />

                <PlanModal 
                    isOpen={showPlanModal}
                    onClose={() => {
                        setShowPlanModal(false);
                        setEditingPlan(null);
                    }}
                    onSave={handleSavePlan}
                    planData={editingPlan}
                    isLoading={planActionLoading}
                    activePlansCount={activePlansCount}
                />

                <ConfirmationDeleteModal 
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setItemToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    isLoading={deleteItemType === 'banner' ? bannerActionLoading : planActionLoading}
                    itemData={itemToDelete}
                    itemType={deleteItemType}
                />
            </div>
        </div>
    );
};

export default AdminManagement;