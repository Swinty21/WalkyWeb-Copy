import { useState, useEffect } from "react";
import { MdClose, MdAccessTime, MdPets, MdVerified, MdStar, MdGpsFixed, MdGpsOff, MdLocationOn } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { WalkerController } from '../../../../BackEnd/Controllers/WalkerController';
import { WalksController } from '../../../../BackEnd/Controllers/WalksController';
import { useUser } from '../../../../BackEnd/Context/UserContext';
import { useToast } from '../../../../BackEnd/Context/ToastContext';

const SelectWalkerModal = ({ 
    isOpen, 
    onClose, 
    preSelectedPet, 
    onRequestSent 
}) => {
    const [walkers, setWalkers] = useState([]);
    const [walkersSettings, setWalkersSettings] = useState({});
    const [selectedWalker, setSelectedWalker] = useState(null);
    const [selectedWalkerSettings, setSelectedWalkerSettings] = useState(null);
    const [walkDate, setWalkDate] = useState('');
    const [walkTime, setWalkTime] = useState('');
    const [startAddress, setStartAddress] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingWalkers, setLoadingWalkers] = useState(false);
    const [loadingWalkerSettings, setLoadingWalkerSettings] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState('select-walker');
    const { warning } = useToast();
    const user = useUser();
    const userId = user?.id;

    useEffect(() => {
        if (isOpen) {
            loadWalkers();
            setStep('select-walker');
            setSelectedWalker(null);
            setSelectedWalkerSettings(null);
            setWalkDate('');
            setWalkTime('');
            setStartAddress('');
            setDescription('');
            setError(null);
        }
    }, [isOpen]);

    const loadWalkers = async () => {
        try {
            setLoadingWalkers(true);
            setError(null);
            const walkersData = await WalkerController.fetchWalkers();
            const availableWalkers = walkersData.filter(walker => !walker.isPlaceholder);
            setWalkers(availableWalkers);
            
            await loadAllWalkersSettings(availableWalkers);
        } catch (err) {
            setError('Error loading walkers: ' + err.message);
        } finally {
            setLoadingWalkers(false);
        }
    };

    const loadAllWalkersSettings = async (walkersList) => {
        const settingsPromises = walkersList.map(async (walker) => {
            try {
                const settings = await WalkerController.fetchWalkerSettings(walker.id);
                return { walkerId: walker.id, settings };
            } catch (err) {
                return {
                    walkerId: walker.id,
                    settings: {
                        pricePerPet: 15000,
                        hasGPSTracker: false,
                        hasDiscount: false,
                        discountPercentage: 0
                    }
                };
            }
        });

        const settingsResults = await Promise.all(settingsPromises);
        const settingsMap = {};
        settingsResults.forEach(({ walkerId, settings }) => {
            settingsMap[walkerId] = settings;
        });
        setWalkersSettings(settingsMap);
    };

    const loadSelectedWalkerSettings = async (walkerId) => {
        try {
            setLoadingWalkerSettings(true);
            const settings = await WalkerController.fetchWalkerSettings(walkerId);
            setSelectedWalkerSettings(settings);
        } catch (err) {
            setSelectedWalkerSettings({
                pricePerPet: 15000,
                hasGPSTracker: false,
                hasDiscount: false,
                discountPercentage: 0
            });
        } finally {
            setLoadingWalkerSettings(false);
        }
    };

    const handleWalkerSelect = async (walker) => {
        setSelectedWalker(walker);
        setStep('schedule');
        if (!walkersSettings[walker.id]) {
            await loadSelectedWalkerSettings(walker.id);
        } else {
            setSelectedWalkerSettings(walkersSettings[walker.id]);
        }
    };

    const handleBackToWalkers = () => {
        setStep('select-walker');
        setSelectedWalker(null);
        setSelectedWalkerSettings(null);
        setError(null);
    };

    const calculateFinalPrice = () => {
        const settings = selectedWalkerSettings || walkersSettings[selectedWalker?.id];
        const basePrice = settings?.pricePerPet || 15000;
        
        if (settings?.hasDiscount && settings?.discountPercentage > 0) {
            const discountAmount = basePrice * (settings.discountPercentage / 100);
            return basePrice - discountAmount;
        }
        return basePrice;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedWalker || !preSelectedPet) {
            setError('Missing walker or pet information');
            return;
        }

        if (!walkDate || !walkTime) {
            setError('Debe seleccionar fecha y hora');
            return;
        }

        if (!startAddress || startAddress.trim() === '') {
            setError('Debes ingresar la dirección de inicio del paseo');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const scheduledDateTime = new Date(`${walkDate}T${walkTime}`).toISOString();
            const finalPrice = calculateFinalPrice();
            
            const walkRequest = {
                walkerId: selectedWalker.id,
                ownerId: userId,
                petIds: [preSelectedPet.id],
                scheduledDateTime: scheduledDateTime,
                startAddress: startAddress.trim(),
                totalPrice: finalPrice,
                description: description.trim() || undefined
            };

            await WalksController.createWalkRequest(walkRequest);
            
            onRequestSent && onRequestSent();
            onClose();
        } catch (err) {
            warning('Una o varias de las mascotas seleccionadas ya tienen un paseo activo/pendiente', {
                title: 'Error al solicitar el paseo:',
                duration: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('select-walker');
        setSelectedWalker(null);
        setSelectedWalkerSettings(null);
        setWalkDate('');
        setWalkTime('');
        setStartAddress('');
        setDescription('');
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                <div className="p-6 border-b border-primary/20">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground dark:text-background">
                            {step === 'select-walker' 
                                ? 'Seleccionar Paseador' 
                                : `Programar Paseo - ${selectedWalker?.name}`
                            }
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <MdClose className="text-2xl text-foreground dark:text-background" />
                        </button>
                    </div>
                </div>

                {preSelectedPet && (
                    <div className="p-6 border-b border-primary/20 bg-primary/5">
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-3 flex items-center">
                            <MdPets className="mr-2" />
                            Mascota Seleccionada
                        </h3>
                        <div className="flex items-center space-x-4">
                            <img
                                src={preSelectedPet.image}
                                alt={preSelectedPet.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                            />
                            <div>
                                <h4 className="text-xl font-semibold text-foreground dark:text-background">
                                    {preSelectedPet.name}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-accent dark:text-muted">
                                    {preSelectedPet.weight && (
                                        <span>{preSelectedPet.weight} kg</span>
                                    )}
                                    {preSelectedPet.age && (
                                        <span>{preSelectedPet.age} años</span>
                                    )}
                                </div>
                                {preSelectedPet.description && (
                                    <p className="text-sm text-accent dark:text-muted mt-1">
                                        {preSelectedPet.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {step === 'select-walker' ? (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-4">
                            Paseadores Disponibles
                        </h3>
                        
                        {loadingWalkers ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="border border-primary/20 rounded-lg p-4 animate-pulse">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-muted/40 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-5 bg-muted/40 rounded w-3/4"></div>
                                                <div className="h-4 bg-muted/30 rounded w-1/2"></div>
                                                <div className="h-4 bg-muted/30 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : walkers.length === 0 ? (
                            <p className="text-center text-accent dark:text-muted py-8">
                                No hay paseadores disponibles en este momento
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {walkers.map(walker => {
                                    const walkerSettings = walkersSettings[walker.id];
                                    const pricePerPet = walkerSettings?.pricePerPet || 15000;
                                    const hasGPSTracking = walkerSettings?.hasGPSTracker || false;
                                    
                                    return (
                                        <div
                                            key={walker.id}
                                            onClick={() => handleWalkerSelect(walker)}
                                            className="border border-primary/20 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={walker.image}
                                                    alt={walker.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="text-lg font-semibold text-foreground dark:text-background group-hover:text-primary transition-colors">
                                                            {walker.name}
                                                        </h4>
                                                        <div className="flex items-center space-x-1">
                                                            {walker.verified && (
                                                                <MdVerified className="text-green-500 w-5 h-5" />
                                                            )}
                                                            {hasGPSTracking ? (
                                                                <MdGpsFixed className="text-green-500 w-5 h-5" />
                                                            ) : (
                                                                <MdGpsOff className="text-gray-400 w-5 h-5" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-sm text-accent dark:text-muted mb-1">
                                                        <FaMapMarkerAlt className="w-4 h-4" />
                                                        <span>{walker.location || 'Ubicación no disponible'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm">
                                                        <div className="flex items-center space-x-1">
                                                            <MdStar className="text-yellow-400 w-4 h-4" />
                                                            <span className="text-foreground dark:text-background font-medium">
                                                                {walker.rating || '5.0'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-primary font-semibold">
                                                                ${pricePerPet.toLocaleString()}
                                                            </span>
                                                            {walkerSettings?.hasDiscount && walkerSettings?.discountPercentage > 0 && (
                                                                <span className="text-xs text-green-600 font-medium">
                                                                    {walkerSettings.discountPercentage}% descuento
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {walker.experience && (
                                                        <p className="text-sm text-accent dark:text-muted mt-1 line-clamp-2">
                                                            {walker.experience}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6">
                        
                        <div className="mb-6 p-4 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src={selectedWalker?.image}
                                    alt={selectedWalker?.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                                    }}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-xl font-semibold text-foreground dark:text-background">
                                            {selectedWalker?.name}
                                        </h3>
                                        <div className="flex items-center space-x-1">
                                            {selectedWalker?.verified && (
                                                <MdVerified className="text-green-500 w-5 h-5" />
                                            )}
                                            {(selectedWalkerSettings?.hasGPSTracker || walkersSettings[selectedWalker?.id]?.hasGPSTracker) ? (
                                                <MdGpsFixed className="text-green-500 w-5 h-5" />
                                            ) : (
                                                <MdGpsOff className="text-gray-400 w-5 h-5" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 text-accent dark:text-muted">
                                        <FaMapMarkerAlt className="w-4 h-4" />
                                        <span>{selectedWalker?.location || 'Ubicación no disponible'}</span>
                                    </div>
                                    <p className="text-sm text-accent dark:text-muted mt-1">
                                        {selectedWalker?.experience}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <div className="flex flex-col">
                                        <p className="text-sm text-accent dark:text-muted">Precio por mascota</p>
                                        {loadingWalkerSettings ? (
                                            <p className="text-lg font-semibold text-foreground dark:text-background">
                                                Cargando...
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-lg font-semibold text-foreground dark:text-background">
                                                    ${(selectedWalkerSettings?.pricePerPet || walkersSettings[selectedWalker?.id]?.pricePerPet || 15000).toLocaleString()}
                                                </p>
                                                {(selectedWalkerSettings?.hasDiscount || walkersSettings[selectedWalker?.id]?.hasDiscount) && 
                                                    (selectedWalkerSettings?.discountPercentage > 0 || walkersSettings[selectedWalker?.id]?.discountPercentage > 0) && (
                                                    <p className="text-sm text-green-600 font-medium">
                                                        {selectedWalkerSettings?.discountPercentage || walkersSettings[selectedWalker?.id]?.discountPercentage}% descuento aplicado
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <p className="text-sm text-accent dark:text-muted">Rastreo GPS</p>
                                    {loadingWalkerSettings ? (
                                        <p className="text-lg font-semibold text-foreground dark:text-background">
                                            Cargando...
                                        </p>
                                    ) : (
                                        <p className={`text-lg font-semibold ${(selectedWalkerSettings?.hasGPSTracker || walkersSettings[selectedWalker?.id]?.hasGPSTracker) ? 'text-green-500' : 'text-gray-500'}`}>
                                            {(selectedWalkerSettings?.hasGPSTracker || walkersSettings[selectedWalker?.id]?.hasGPSTracker) ? '✓ Activo' : '✗ No disponible'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-foreground dark:text-background mb-3 flex items-center">
                                <MdAccessTime className="mr-2" />
                                Fecha y Hora
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-accent dark:text-muted mb-1">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={walkDate}
                                        onChange={(e) => setWalkDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-primary/20 rounded-lg focus:border-primary focus:outline-none bg-background dark:bg-foreground text-foreground dark:text-background"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-accent dark:text-muted mb-1">
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        value={walkTime}
                                        onChange={(e) => setWalkTime(e.target.value)}
                                        className="w-full p-3 border border-primary/20 rounded-lg focus:border-primary focus:outline-none bg-background dark:bg-foreground text-foreground dark:text-background"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-foreground dark:text-background mb-3 flex items-center">
                                <MdLocationOn className="mr-2" />
                                Dirección de Inicio
                            </h4>
                            <div>
                                <label className="block text-sm font-medium text-accent dark:text-muted mb-1">
                                    Dirección completa
                                </label>
                                <input
                                    type="text"
                                    value={startAddress}
                                    onChange={(e) => setStartAddress(e.target.value)}
                                    placeholder="Ej: Av. Santa Fe 1234, Palermo, Buenos Aires"
                                    className="w-full p-3 border border-primary/20 rounded-lg focus:border-primary focus:outline-none bg-background dark:bg-foreground text-foreground dark:text-background"
                                    required
                                />
                                <p className="text-xs text-accent dark:text-muted mt-1">
                                    Ingresa la dirección donde se iniciará el paseo
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-accent dark:text-muted mb-1">
                                Descripción (opcional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Instrucciones especiales, preferencias del paseo..."
                                className="w-full p-3 border border-primary/20 rounded-lg focus:border-primary focus:outline-none bg-background dark:bg-foreground text-foreground dark:text-background resize-none"
                                rows="3"
                            />
                        </div>

                        <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                            {!loadingWalkerSettings && (selectedWalkerSettings || walkersSettings[selectedWalker?.id]) && (
                                <>
                                    {((selectedWalkerSettings?.hasDiscount || walkersSettings[selectedWalker?.id]?.hasDiscount) && 
                                        (selectedWalkerSettings?.discountPercentage > 0 || walkersSettings[selectedWalker?.id]?.discountPercentage > 0)) && (
                                        <div className="flex justify-between items-center mb-2 text-green-600">
                                            <span>Descuento ({selectedWalkerSettings?.discountPercentage || walkersSettings[selectedWalker?.id]?.discountPercentage}%)</span>
                                            <span>
                                                -${(((selectedWalkerSettings?.pricePerPet || walkersSettings[selectedWalker?.id]?.pricePerPet || 15000) * 
                                                        (selectedWalkerSettings?.discountPercentage || walkersSettings[selectedWalker?.id]?.discountPercentage)) / 100).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-foreground dark:text-background">
                                    Total
                                </span>
                                <span className="text-xl font-bold text-primary">
                                    {loadingWalkerSettings ? 'Cargando...' : `$${calculateFinalPrice().toLocaleString()}`}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
                                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleBackToWalkers}
                                className="flex-1 py-3 px-4 border border-primary/20 text-accent dark:text-muted rounded-lg hover:bg-primary/10 transition-colors"
                            >
                                Cambiar Paseador
                            </button>
                            <button
                                type="submit"
                                disabled={loading || loadingWalkerSettings || !walkDate || !walkTime || !startAddress}
                                className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : 
                                    loadingWalkerSettings ? 'Cargando...' : 
                                    `Solicitar Paseo - $${calculateFinalPrice().toLocaleString()}`}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SelectWalkerModal;