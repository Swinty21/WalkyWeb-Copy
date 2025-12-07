import { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaCalendarAlt, FaCrown } from 'react-icons/fa';
import { useUser } from '../../../BackEnd/Context/UserContext';
import { useToast } from '../../../BackEnd/Context/ToastContext';
import { SettingsController } from '../../../BackEnd/Controllers/SettingsController';
import { UserController } from '../../../BackEnd/Controllers/UserController';
import SubscriptionModal from '../Modals/SettingsModals/SubscriptionModal';
import SubscriptionSuccessModal from '../Modals/SettingsModals/SubscriptionSuccessModal';
import SubscriptionExpiredModal from '../Modals/SettingsModals/SubscriptionExpiredModal';
import SettingNotificationComponent from '../Components/SettingsComponents/SettingNotificationComponent';
import SettingSubscriptionComponent from '../Components/SettingsComponents/SettingSubscriptionComponent';

const Settings = () => {
    const user = useUser();
    const [settings, setSettings] = useState({
        email: '',
        notifications: {
            walkStatus: true,
            announcements: true,
            subscription: true,
            messages: true,
            systemAlerts: true
        }
    });
    const [subscription, setSubscription] = useState(null);
    const [userProfile, setUserProfile] = useState({
        name: '',
        phone: '',
        location: '',
        joinedDate: null,
        lastLogin: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showExpiredModal, setShowExpiredModal] = useState(false);
    const [previousPlan, setPreviousPlan] = useState(null);
    const { success, error } = useToast();

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                const [userSettings, userSubscription] = await Promise.all([
                    SettingsController.getUserSettings(user?.id),
                    SettingsController.getUserSubscription(user?.id)
                ]);
                
                setSettings(userSettings);
                setSubscription(userSubscription);
                
                if (userSubscription?.expiryDate && new Date(userSubscription.expiryDate) < new Date() && userSubscription.plan !== 'free') {
                    setShowExpiredModal(true);
                }
                
                if (user?.id) {
                    var userData = await UserController.fetchUserById(user.id);
                    
                    setUserProfile({
                        name: userData?.fullName || '',
                        phone: userData?.phone || '',
                        location: userData?.location || '',
                        joinedDate: userData?.joinedDate || null,
                        lastLogin: userData?.lastLogin || null
                    });
                    
                }
            } catch (error) {
                
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadSettings();
        }
    }, [user]);

    const handleEmailChange = (e) => {
        setSettings(prev => ({
            ...prev,
            email: e.target.value
        }));
    };

    const toggleNotification = (type) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            
            const settingsToSave = {
                email: settings.email,
                notifications: {
                    walkStatus: settings.notifications.walkStatus,
                    announcements: settings.notifications.announcements,
                    subscription: settings.notifications.subscription,
                    messages: settings.notifications.messages,
                    systemAlerts: settings.notifications.systemAlerts
                }
            };


            const updatedSettings = await SettingsController.updateUserSettings(user?.id, settingsToSave);
            
            setSettings(prev => ({
                ...prev,
                email: updatedSettings.email,
                notifications: updatedSettings.notifications
            }));

            success('Configuraciones guardadas exitosamente', {
                title: 'Éxito',
                duration: 4000
            });
        } catch (err) {
            error('Error al guardar los cambios', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setSaving(false);
        }
    };

    const openSubscriptionModal = () => {
        setShowSubscriptionModal(true);
    };

    const closeSubscriptionModal = () => {
        setShowSubscriptionModal(false);
    };

    const handleSubscriptionUpdate = (newSubscription, oldPlan) => {
        setSubscription(newSubscription);
        setPreviousPlan(oldPlan);
        closeSubscriptionModal();
        setShowSuccessModal(true);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setPreviousPlan(null);
    };

    const closeExpiredModal = () => {
        setShowExpiredModal(false);
    };

    const handleRenewFromExpired = () => {
        setShowExpiredModal(false);
        setShowSubscriptionModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-6 bg-background dark:bg-foreground">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground dark:text-background mb-2">
                        Configuración
                    </h1>
                    <p className="text-accent dark:text-muted text-lg">
                        Personaliza tu experiencia y gestiona tus preferencias
                    </p>
                </div>

                <SettingSubscriptionComponent
                    subscription={subscription}
                    onOpenSubscriptionModal={openSubscriptionModal}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div className="bg-background dark:bg-foreground rounded-2xl shadow-xl p-8 border border-border dark:border-muted">
                        <div className="flex items-center mb-6">
                            <FaUser className="text-3xl text-primary mr-4" />
                            <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                Información de Perfil
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground dark:text-background mb-2">
                                        Nombre Completo
                                    </label>
                                    <div className="p-3 border border-border dark:border-muted rounded-xl bg-muted/20 dark:bg-accent/10 text-foreground dark:text-background">
                                        {userProfile.name || 'No especificado'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground dark:text-background mb-2">
                                        Teléfono
                                    </label>
                                    <div className="p-3 border border-border dark:border-muted rounded-xl bg-muted/20 dark:bg-accent/10 text-foreground dark:text-background">
                                        {userProfile.phone || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground dark:text-background mb-2">
                                    Ubicación
                                </label>
                                <div className="p-3 border border-border dark:border-muted rounded-xl bg-muted/20 dark:bg-accent/10 text-foreground dark:text-background">
                                    {userProfile.location || 'No especificado'}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground dark:text-background mb-2">
                                        Fecha de Registro
                                    </label>
                                    <div className="p-3 border border-border dark:border-muted rounded-xl bg-muted/20 dark:bg-accent/10 text-foreground dark:text-background">
                                        {formatDate(userProfile.joinedDate)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground dark:text-background mb-2">
                                        Último Acceso
                                    </label>
                                    <div className="p-3 border border-border dark:border-muted rounded-xl bg-muted/20 dark:bg-accent/10 text-foreground dark:text-background">
                                        {formatDate(userProfile.lastLogin)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background dark:bg-foreground rounded-2xl shadow-xl p-8 border border-border dark:border-muted">
                        <div className="flex items-center mb-6">
                            <FaEnvelope className="text-3xl text-primary mr-4" />
                            <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                Configuración de Cuenta
                            </h2>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-foreground dark:text-background mb-3">
                                Correo Electrónico (Para las notificaciones y Login)
                            </label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={handleEmailChange}
                                className="w-full p-4 border border-border dark:border-muted rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                placeholder="tu-email@ejemplo.com"
                            />
                            <p className="text-sm text-accent dark:text-muted mt-2">
                                Este correo se utilizará para:
                            </p>
                            <p className="text-sm text-accent dark:text-muted mt-2">
                                - Enviarte notificaciones importantes sobre tu cuenta y servicios.
                            </p>
                            <p className="text-sm text-accent dark:text-muted mt-2">
                                - Porder Ingresar a la web
                            </p>
                        </div>
                    </div>
                </div>

                <SettingNotificationComponent
                    settings={settings}
                    onToggleNotification={toggleNotification}
                />

                <div className="flex justify-center">
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={closeSubscriptionModal}
                currentSubscription={subscription}
                onSubscriptionUpdate={handleSubscriptionUpdate}
            />

            <SubscriptionSuccessModal
                isOpen={showSuccessModal}
                onClose={closeSuccessModal}
                subscription={subscription}
                previousPlan={previousPlan}
            />

            <SubscriptionExpiredModal
                isOpen={showExpiredModal}
                onClose={closeExpiredModal}
                subscription={subscription}
                onRenewClick={handleRenewFromExpired}
            />
        </div>
    );
};

export default Settings;