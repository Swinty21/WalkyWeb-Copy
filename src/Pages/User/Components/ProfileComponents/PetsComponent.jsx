import { useState } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiHeart } from "react-icons/fi";
import AddPetModal from "../../Modals/ProfileModals/Pet/AddPetModal";
import EditPetModal from "../../Modals/ProfileModals/Pet/EditPetModal";
import DeletePetModal from "../../Modals/ProfileModals/Pet/DeletePetModal";

const PetsComponent = ({ 
    pets, 
    addButtonClass, 
    onAddPet, 
    onEditPet, 
    onDeletePet, 
    isLoading, 
    error 
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const handleAddPet = (petData) => {
        onAddPet(petData);
        setShowAddModal(false);
    };

    const handleEditPet = (petId, petData) => {
        onEditPet(petId, petData);
        setShowEditModal(false);
        setSelectedPet(null);
    };

    const handleDeletePet = (petId) => {
        onDeletePet(petId);
        setShowDeleteModal(false);
        setSelectedPet(null);
    };

    const openEditModal = (pet) => {
        setSelectedPet(pet);
        setShowEditModal(true);
    };

    const openDeleteModal = (pet) => {
        setSelectedPet(pet);
        setShowDeleteModal(true);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground dark:text-background">
                        Mis Mascotas
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-muted/20 rounded-lg p-4 animate-pulse">
                            <div className="w-20 h-20 bg-muted/40 rounded-full mx-auto mb-3"></div>
                            <div className="h-4 bg-muted/40 rounded mb-2"></div>
                            <div className="h-3 bg-muted/30 rounded mb-3"></div>
                            <div className="flex space-x-2">
                                <div className="flex-1 h-8 bg-muted/30 rounded"></div>
                                <div className="flex-1 h-8 bg-muted/30 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground dark:text-background">
                        Mis Mascotas
                    </h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={addButtonClass}
                    >
                        <FiPlus className="w-4 h-4 mr-2" />
                        Agregar Mascota
                    </button>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                        {error}
                    </p>
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
        <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground dark:text-background">
                    Mis Mascotas
                </h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={addButtonClass}
                >
                    Agregar Mascota
                </button>
            </div>

            {pets.length === 0 ? (
                <div className="bg-muted/10 border-2 border-dashed border-muted/40 rounded-lg p-8 text-center">
                    <FiHeart className="w-12 h-12 text-muted mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-foreground dark:text-background mb-2">
                        No tienes mascotas registradas
                    </h4>
                    <p className="text-accent dark:text-muted mb-4">
                        Agrega a tu primera mascota para comenzar a gestionar sus paseos
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <FiPlus className="w-4 h-4 mr-2 inline" />
                        Agregar Primera Mascota
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                        <div
                            key={pet.id}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg border border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        >
                            {/* Pet Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={pet.image}
                                    alt={pet.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Pet Info Badge */}
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full px-3 py-1">
                                    <FiHeart className="text-primary text-sm" />
                                </div>
                            </div>

                            {/* Pet Details */}
                            <div className="p-5">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg text-foreground dark:text-background leading-tight">
                                            {pet.name}
                                        </h3>
                                        <div className="flex items-center justify-between text-sm">
                                            {pet.age && (
                                                <span className="text-accent dark:text-muted font-medium">
                                                    {pet.age} años
                                                </span>
                                            )}
                                            {pet.weight && (
                                                <span className="text-accent dark:text-muted font-medium">
                                                    {pet.weight} kg
                                                </span>
                                            )}
                                        </div>
                                        {pet.description && (
                                            <p className="text-accent dark:text-muted text-sm leading-relaxed line-clamp-2">
                                                {pet.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 pt-2">
                                        <button 
                                            onClick={() => openEditModal(pet)}
                                            className="w-full bg-background dark:bg-foreground border border-primary text-primary hover:bg-primary hover:text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                                        >
                                            <FiEdit3 className="w-4 h-4 mr-2" />
                                            Editar Info
                                        </button>
                                        <button 
                                            onClick={() => openDeleteModal(pet)}
                                            className="w-full bg-background dark:bg-foreground border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                                        >
                                            <FiTrash2 className="w-4 h-4 mr-2" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 left-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                            <div className="absolute bottom-4 right-4 w-6 h-6 bg-success/20 rounded-full animate-pulse delay-300" />
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <AddPetModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddPet}
            />
            <EditPetModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                petData={selectedPet}
                onSave={handleEditPet}
            />
            <DeletePetModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                petData={selectedPet}
                onConfirm={handleDeletePet}
            />
        </div>
    );
};

export default PetsComponent;