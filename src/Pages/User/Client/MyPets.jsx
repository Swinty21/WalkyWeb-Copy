import { useState, useEffect, useCallback } from "react";
import { FiHeart, FiPlus } from "react-icons/fi";
import { useUser } from "../../../BackEnd/Context/UserContext";
import { useToast } from '../../../BackEnd/Context/ToastContext';
import { useNavigation } from "../../../BackEnd/Context/NavigationContext";
import { PetsController } from "../../../BackEnd/Controllers/PetsController";
import HeaderPetsComponent from "../Components/MyPet/HeaderPetsComponent";
import PetCard from "../Components/MyPet/PetCard";
import AddPetModal from "../Modals/ProfileModals/Pet/AddPetModal";
import EditPetModal from "../Modals/ProfileModals/Pet/EditPetModal";
import DeletePetModal from "../Modals/ProfileModals/Pet/DeletePetModal";
import SelectWalkerModal from "../Modals/MyPet/SelectWalkerModal";

const MyPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { success, warning } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSelectWalkerModal, setShowSelectWalkerModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const user = useUser();
    const { navigateToContent } = useNavigation();

    const loadPets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            if (!user?.id) return;
            const data = await PetsController.fetchPetsByOwner(user.id);
            setPets(data);
        } catch (err) {
            setError("Error al cargar las mascotas.");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadPets();
    }, [loadPets, refreshTrigger]);

    const handleAddPet = async (petData) => {
        try {
            await PetsController.createPet(user.id, petData);
            success('Mascota agregada', {
                title: 'Éxito',
                duration: 4000
            });
            setRefreshTrigger(prev => prev + 1);
            setShowAddModal(false);
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
            setShowEditModal(false);
            setSelectedPet(null);
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
            setShowDeleteModal(false);
            setSelectedPet(null);
            success('Mascota eliminada correctamente', {
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

    const openEditModal = (pet) => {
        setSelectedPet(pet);
        setShowEditModal(true);
    };

    const openDeleteModal = (pet) => {
        setSelectedPet(pet);
        setShowDeleteModal(true);
    };

    const handleRequestWalk = (pet) => {
        setSelectedPet(pet);
        setShowSelectWalkerModal(true);
    };

    const handleFindWalkers = () => {
        navigateToContent('search-walker');
    };

    const handleWalkRequestSent = () => {
        success('Solicitud de paseo enviada correctamente', {
                title: 'Éxito',
                duration: 4000
            });
        setShowSelectWalkerModal(false);
        setSelectedPet(null);
    };

    if (loading) {
        return (
            <div className="max-w min-h-screen bg-background dark:bg-foreground p-6">
                <div className="mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-2">
                            <div className="h-8 bg-muted/40 rounded w-48"></div>
                            <div className="h-4 bg-muted/30 rounded w-64"></div>
                        </div>
                        <div className="h-10 bg-muted/30 rounded w-40"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-muted/20 rounded-2xl p-6 animate-pulse">
                                <div className="w-full h-48 bg-muted/40 rounded-xl mb-4"></div>
                                <div className="h-6 bg-muted/40 rounded mb-3"></div>
                                <div className="h-4 bg-muted/30 rounded mb-4"></div>
                                <div className="flex flex-col gap-2">
                                    <div className="h-10 bg-muted/30 rounded"></div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-10 bg-muted/30 rounded"></div>
                                        <div className="flex-1 h-10 bg-muted/30 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w bg-background dark:bg-foreground p-6">
                <div className="mx-auto">
                    <HeaderPetsComponent 
                        pets={[]} 
                        onAddPet={() => setShowAddModal(true)}
                        onFindWalkers={handleFindWalkers}
                    />
                    
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                        <p className="text-red-800 dark:text-red-200">
                            {error}
                        </p>
                    </div>
                </div>
                
                <AddPetModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddPet}
                />
            </div>
        );
    }

    return (
        <div className="max-w min-h-screen bg-background dark:bg-foreground p-6">
            <div className="mx-auto">
                <HeaderPetsComponent 
                    pets={pets} 
                    onAddPet={() => setShowAddModal(true)}
                    onFindWalkers={handleFindWalkers}
                />

                {pets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                                <FiHeart className="w-16 h-16 text-primary/60" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
                            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-success/20 rounded-full animate-pulse delay-300"></div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-foreground dark:text-background mb-3">
                            No tienes mascotas registradas
                        </h3>
                        <p className="text-accent dark:text-muted text-center max-w-md mb-8">
                            Comienza agregando a tu primera mascota para poder gestionar sus paseos y cuidados
                        </p>
                        
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center text-lg"
                        >
                            <FiPlus className="mr-3 w-5 h-5" />
                            Agregar Primera Mascota
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pets.map((pet) => (
                            <PetCard
                                key={pet.id}
                                pet={pet}
                                onRequestWalk={handleRequestWalk}
                                onEditPet={openEditModal}
                                onDeletePet={openDeleteModal}
                            />
                        ))}
                    </div>
                )}

                <AddPetModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddPet}
                />
                
                <EditPetModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedPet(null);
                    }}
                    petData={selectedPet}
                    onSave={handleEditPet}
                />
                
                <DeletePetModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedPet(null);
                    }}
                    petData={selectedPet}
                    onConfirm={handleDeletePet}
                />

                <SelectWalkerModal
                    isOpen={showSelectWalkerModal}
                    onClose={() => {
                        setShowSelectWalkerModal(false);
                        setSelectedPet(null);
                    }}
                    preSelectedPet={selectedPet}
                    onRequestSent={handleWalkRequestSent}
                />
            </div>
        </div>
    );
};

export default MyPets;