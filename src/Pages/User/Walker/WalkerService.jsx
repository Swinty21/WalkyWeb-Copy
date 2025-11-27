import { useState, useEffect } from "react";
import { useUser } from "../../../BackEnd/Context/UserContext";
import { useToast } from '../../../BackEnd/Context/ToastContext';
import { WalkerController } from "../../../BackEnd/Controllers/WalkerController";
import { WalksController } from "../../../BackEnd/Controllers/WalksController";
import WalkerServiceHeaderComponent from "../Components/WalkerServiceComponents/WalkerServiceHeaderComponent";
import WalkerServiceStatsComponent from "../Components/WalkerServiceComponents/WalkerServiceStatsComponent";
import WalkerServiceEarningsComponent from "../Components/WalkerServiceComponents/WalkerServiceEarningsComponent";
import WalkerServiceChartComponent from "../Components/WalkerServiceComponents/WalkerServiceChartComponent";
import WalkerServiceSettingsComponent from "../Components/WalkerServiceComponents/WalkerServiceSettingsComponent";
import { FaExclamationTriangle, FaCreditCard, FaTimes } from "react-icons/fa";

const WalkerService = () => {
    const user = useUser();
    const walkerId = user?.id;
    const { success, warning } = useToast();
    
    const [walkerData, setWalkerData] = useState(null);
    const [walksData, setWalksData] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [settings, setSettings] = useState({
        location: "",
        pricePerPet: 0,
        hasGPSTracker: false,
        hasDiscount: false,
        discountPercentage: 0,
        hasMercadoPago: false,
        tokenMercadoPago: "",
        mercadoPagoSandbox: false
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMercadoPagoAlert, setShowMercadoPagoAlert] = useState(false);

    useEffect(() => {
        const loadWalkerData = async () => {
            if (!walkerId) return;
            
            try {
                setLoading(true);
                
                const [walker, walks, walkerSettings, calculatedEarnings] = await Promise.all([
                    WalkerController.fetchWalkerProfile(walkerId),
                    WalksController.fetchWalksByWalker(walkerId),
                    WalkerController.fetchWalkerSettings(walkerId),
                    WalkerController.getWalkerEarnings(walkerId)
                ]);

                setWalkerData(walker);
                setWalksData(walks);
                setSettings(walkerSettings);
                
                const calculatedChartData = generateChartData(walks);
                
                setEarnings(calculatedEarnings);
                setChartData(calculatedChartData);
                
                const isMercadoPagoConfigured = walkerSettings.hasMercadoPago &&  
                                                walkerSettings.tokenMercadoPago;
                setShowMercadoPagoAlert(!isMercadoPagoConfigured);
                
            } catch (err) {
                console.error("Error loading walker data:", err);
                warning('Error al cargar la información del paseador', {
                    title: 'Error',
                    duration: 4000
                });
            } finally {
                setLoading(false);
            }
        };

        loadWalkerData();
    }, [walkerId]);

    const generateChartData = (walks) => {
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date);
        }
        
        const chartData = last7Days.map(date => {
            const dayWalks = walks.filter(walk => {
                const walkDate = new Date(walk.startTime);
                return walkDate.toDateString() === date.toDateString() && 
                    walk.status === 'Finalizado';
            });
            
            return {
                day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
                walks: dayWalks.length,
                date: date
            };
        });
        
        return chartData;
    };

    const getWalksStats = () => {
        const stats = {
            total: walksData.length,
            new: walksData.filter(w => w.status === 'Solicitado').length,
            awaitingPayment: walksData.filter(w => w.status === 'Esperando pago').length,
            scheduled: walksData.filter(w => w.status === 'Agendado').length,
            active: walksData.filter(w => w.status === 'Activo').length,
            completed: walksData.filter(w => w.status === 'Finalizado').length,
            rejected: walksData.filter(w => w.status === 'Rechazado').length,
            canceled: walksData.filter(w => w.status === 'Cancelado').length
        };
        
        return stats;
    };

    const handleSettingsChange = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const handleSaveSettings = async () => {
        try {
            setSaving(true);
            
            const settingsToUpdate = {
                location: settings.location,
                pricePerPet: settings.pricePerPet,
                hasDiscount: settings.hasDiscount,
                discountPercentage: settings.discountPercentage
            };
            
            const updatedSettings = await WalkerController.updateWalkerSettings(walkerId, settingsToUpdate);
            
            setSettings(prev => ({
                ...prev,
                ...updatedSettings
            }));
            
            success('Configuración guardada exitosamente', {
                title: 'Éxito',
                duration: 3000
            });
        } catch (err) {
            console.error('Error saving settings:', err);
            warning(err.message || 'Error al guardar la configuración', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveMercadoPago = async () => {
        try {
            if (!settings.hasMercadoPago) {
                warning('Debes habilitar MercadoPago primero', {
                    title: 'Atención',
                    duration: 3000
                });
                return;
            }

            if (!settings.tokenMercadoPago || settings.tokenMercadoPago.trim() === '') {
                warning('El Access Token es requerido', {
                    title: 'Atención',
                    duration: 3000
                });
                return;
            }
            
            const mercadoPagoData = {
                hasMercadoPago: settings.hasMercadoPago,
                tokenMercadoPago: settings.tokenMercadoPago.trim()
            };
            
            const updatedSettings = await WalkerController.updateWalkerMercadoPago(walkerId, mercadoPagoData);
            
            setSettings(prev => ({
                ...prev,
                hasMercadoPago: updatedSettings.hasMercadoPago,
                tokenMercadoPago: updatedSettings.tokenMercadoPago
            }));
            
            const isMercadoPagoConfigured = updatedSettings.hasMercadoPago && updatedSettings.tokenMercadoPago;
            
            if (isMercadoPagoConfigured) {
                setShowMercadoPagoAlert(false);
            }
            
            success('Configuración de MercadoPago guardada exitosamente', {
                title: 'Éxito',
                duration: 3000
            });
        } catch (err) {
            console.error('Error saving MercadoPago:', err);
            warning(err.message || 'Error al guardar MercadoPago', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const handleDismissAlert = () => {
        setShowMercadoPagoAlert(false);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
                <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-lg text-background ml-4">
                            Cargando dashboard del paseador...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!walkerData) {
        return (
            <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
                <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg text-danger">No se pudo cargar la información</p>
                    </div>
                </div>
            </div>
        );
    }

    const walksStats = getWalksStats();

    return (
        <div className="max-w min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="mx-auto space-y-6">
                
                {showMercadoPagoAlert && (
                    <div className="bg-gradient-to-r from-warning/10 to-yellow-red/10 dark:from-warning/20 dark:to-yellow-red/20 border-l-4 border-warning p-6 rounded-lg shadow-lg animate-pulse">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-warning rounded-full">
                                    <FaExclamationTriangle className="text-foreground dark:text-background text-xl" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-foreground dark:text-background mb-2">
                                        ¡Atención! Sistema de cobro no configurado
                                    </h4>
                                    <p className="text-foreground/80 dark:text-background/80 mb-3">
                                        Si no activas y configuras el sistema de cobro con Mercado Pago, los usuarios no podrán solicitar tu servicio de paseo de mascotas.
                                    </p>
                                    <div className="flex items-center space-x-2 text-sm text-accent">
                                        <FaCreditCard className="text-base" />
                                        <span>Configura Mercado Pago en la sección "Configuración" más abajo</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleDismissAlert}
                                className="text-warning hover:text-danger transition-all duration-200 p-1 rounded-full hover:bg-muted"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg">
                    <WalkerServiceHeaderComponent 
                        walkerData={walkerData}
                    />
                </div>

                <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg">
                    <WalkerServiceStatsComponent 
                        stats={walksStats}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg">
                        <WalkerServiceEarningsComponent 
                            earnings={earnings}
                        />
                    </div>
                    
                    <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg">
                        <WalkerServiceChartComponent 
                            chartData={chartData}
                        />
                    </div>
                </div>

                <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg">
                    <WalkerServiceSettingsComponent 
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        onSave={handleSaveSettings}
                        onSaveMercadoPago={handleSaveMercadoPago}
                        isSaving={saving}
                    />
                </div>
            </div>
        </div>
    );
};

export default WalkerService;