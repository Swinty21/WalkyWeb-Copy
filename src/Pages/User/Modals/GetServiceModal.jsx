import { useState, useEffect } from "react";
import { MdClose, MdLocationOn, MdAccessTime, MdPets, MdGpsFixed, MdGpsOff } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PetsController } from '../../../BackEnd/Controllers/PetsController';
import { WalksController } from '../../../BackEnd/Controllers/WalksController';
import { WalkerController } from '../../../BackEnd/Controllers/WalkerController';
import { useUser } from '../../../BackEnd/Context/UserContext';
import { useToast } from '../../../BackEnd/Context/ToastContext';

const GetServiceModal = ({ 
    isOpen, 
    onClose, 
    walker, 
    onRequestSent 
}) => {
    const [selectedPets, setSelectedPets] = useState([]);
    const [pets, setPets] = useState([]);
    const [walkDate, setWalkDate] = useState('');
    const [walkTime, setWalkTime] = useState('');
    const [startAddress, setStartAddress] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingPets, setLoadingPets] = useState(true);
    const [loadingWalkerData, setLoadingWalkerData] = useState(false);
    const [error, setError] = useState(null);
    const [walkerSettings, setWalkerSettings] = useState(null);
    const { warning } = useToast();
    const user = useUser();
    const userId = user?.id;

    // Usar datos del walker o valores por defecto
    const pricePerPet = walkerSettings?.pricePerPet || walker?.pricePerPet || 15000;
    const hasGPSTracking = walkerSettings?.hasGPSTracker || walker?.hasGPSTracker || false;

    useEffect(() => {
        if (isOpen && userId) {
            loadUserPets();
        }
    }, [isOpen, userId]);

    useEffect(() => {
        if (isOpen && walker?.id) {
            loadWalkerSettings();
        }
    }, [isOpen, walker]);

    const loadUserPets = async () => {
        try {
            setLoadingPets(true);
            setError(null);
            const userPets = await PetsController.fetchPetsByOwner(userId);
            setPets(userPets);
        } catch (err) {
            setError('Error cargando mascotas: ' + err.message);
        } finally {
            setLoadingPets(false);
        }
    };

    const loadWalkerSettings = async () => {
        try {
            setLoadingWalkerData(true);
            const settings = await WalkerController.fetchWalkerSettings(walker.id);
            setWalkerSettings(settings);
        } catch (err) {
            
            setWalkerSettings({
                pricePerPet: 15000,
                hasGPSTracker: false,
                hasDiscount: false,
                discountPercentage: 0
            });
        } finally {
            setLoadingWalkerData(false);
        }
    };

    const handlePetSelection = (petId) => {
        setSelectedPets(prev => 
            prev.includes(petId) 
                ? prev.filter(id => id !== petId)
                : [...prev, petId]
        );
    };

    const calculateFinalPrice = () => {
        const basePrice = pricePerPet * selectedPets.length;
        if (walkerSettings?.hasDiscount && walkerSettings?.discountPercentage > 0) {
            const discountAmount = basePrice * (walkerSettings.discountPercentage / 100);
            return basePrice - discountAmount;
        }
        return basePrice;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedPets.length === 0) {
            setError('Debes seleccionar al menos una mascota');
            return;
        }

        if (!walkDate || !walkTime) {
            setError('Debes seleccionar fecha y hora del paseo');
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

            const walkRequestData = {
                walkerId: walker.id,
                ownerId: userId,
                petIds: selectedPets,
                scheduledDateTime: scheduledDateTime,
                startAddress: startAddress.trim(),
                totalPrice: totalPrice,
                description: description.trim() || undefined
            };

            const newWalk = await WalksController.createWalkRequest(walkRequestData);

            if (onRequestSent) {
                onRequestSent(newWalk);
            }

            setSelectedPets([]);
            setWalkDate('');
            setWalkTime('');
            setStartAddress('');
            setDescription('');
            
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

    const totalPrice = calculateFinalPrice();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                <div className="p-6 border-b border-primary/20">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground dark:text-background">
                            Solicitar Paseo
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <MdClose className="text-2xl text-foreground dark:text-background" />
                        </button>
                    </div>
                </div>

                <div className="p-6 border-b border-primary/20">
                    <div className="flex items-center space-x-4">
                        <img
                            src={walker?.image}
                            alt={walker?.name}
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                            }}
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-semibold text-foreground dark:text-background">
                                    {walker?.name}
                                </h3>
                                {hasGPSTracking ? (
                                    <MdGpsFixed className="text-green-500 w-5 h-5" />
                                ) : (
                                    <MdGpsOff className="text-gray-400 w-5 h-5" />
                                )}
                            </div>
                            <div className="flex items-center space-x-1 text-accent dark:text-muted">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                <span>{walker?.location || 'Ubicación no disponible'}</span>
                            </div>
                            <p className="text-sm text-accent dark:text-muted mt-1">
                                {walker?.experience}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <div className="flex flex-col">
                                <p className="text-sm text-accent dark:text-muted">Precio por mascota</p>
                                {loadingWalkerData ? (
                                    <p className="text-lg font-semibold text-foreground dark:text-background">
                                        Cargando...
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-lg font-semibold text-foreground dark:text-background">
                                            ${pricePerPet.toLocaleString()}
                                        </p>
                                        {walkerSettings?.hasDiscount && walkerSettings?.discountPercentage > 0 && (
                                            <p className="text-sm text-green-600 font-medium">
                                                {walkerSettings.discountPercentage}% descuento aplicado
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <p className="text-sm text-accent dark:text-muted">Rastreo GPS</p>
                            {loadingWalkerData ? (
                                <p className="text-lg font-semibold text-foreground dark:text-background">
                                    Cargando...
                                </p>
                            ) : (
                                <p className={`text-lg font-semibold ${hasGPSTracking ? 'text-green-500' : 'text-gray-500'}`}>
                                    {hasGPSTracking ? '✓ Activo' : '✗ No disponible'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-foreground dark:text-background mb-3 flex items-center">
                            <MdPets className="mr-2" />
                            Seleccionar Mascotas
                        </h4>
                        
                        {loadingPets ? (
                            <p className="text-accent dark:text-muted">Cargando mascotas...</p>
                        ) : pets.length === 0 ? (
                            <p className="text-accent dark:text-muted">No tienes mascotas registradas</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {pets.map(pet => (
                                    <div
                                        key={pet.id}
                                        onClick={() => handlePetSelection(pet.id)}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                            selectedPets.includes(pet.id)
                                                ? 'border-primary bg-primary/10'
                                                : 'border-primary/20 hover:border-primary/40'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={pet.image}
                                                alt={pet.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1";
                                                }}
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground dark:text-background">
                                                    {pet.name}
                                                </p>
                                                <p className="text-sm text-accent dark:text-muted">
                                                    {pet.weight}kg • {pet.age} años
                                                </p>
                                            </div>
                                            {selectedPets.includes(pet.id) && (
                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm">✓</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

                    {selectedPets.length > 0 && !loadingWalkerData && (
                        <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-foreground dark:text-background">
                                    {selectedPets.length} mascota{selectedPets.length > 1 ? 's' : ''} × ${pricePerPet.toLocaleString()}
                                </span>
                                <span className="font-semibold text-foreground dark:text-background">
                                    ${(selectedPets.length * pricePerPet).toLocaleString()}
                                </span>
                            </div>
                            
                            {walkerSettings?.hasDiscount && walkerSettings?.discountPercentage > 0 && (
                                <div className="flex justify-between items-center mb-2 text-green-600">
                                    <span>Descuento ({walkerSettings.discountPercentage}%)</span>
                                    <span>
                                        -${((selectedPets.length * pricePerPet * walkerSettings.discountPercentage) / 100).toLocaleString()}
                                    </span>
                                </div>
                            )}
                            
                            <div className="border-t border-primary/20 pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-foreground dark:text-background">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-primary">
                                        ${totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
                            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-primary/20 text-accent dark:text-muted rounded-lg hover:bg-primary/10 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || selectedPets.length === 0 || !walkDate || !walkTime || !startAddress || loadingWalkerData}
                            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 
                                loadingWalkerData ? 'Cargando...' : 
                                `Solicitar Paseo - $${totalPrice.toLocaleString()}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GetServiceModal;