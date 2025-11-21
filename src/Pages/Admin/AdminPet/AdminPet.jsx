import { useState, useEffect } from "react";
import { FiUsers, FiHeart } from "react-icons/fi";
import { MdPets } from "react-icons/md";
import { PetsController } from '../../../BackEnd/Controllers/PetsController';
import { UserController } from '../../../BackEnd/Controllers/UserController';

import AdminPetsHeaderComponent from '../Components/AdminPetsComponents/AdminPetsHeaderComponent';
import AdminPetsCardComponent from '../Components/AdminPetsComponents/AdminPetsCardComponent';
import AdminEditPetModal from '../Components/AdminPetsComponents/AdminEditPetModal';
import AdminPetsFilter from '../Filters/AdminPetsFilter/AdminPetsFilter';

const AdminPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [ownerFilter, setOwnerFilter] = useState("all");
    const [ageFilter, setAgeFilter] = useState("all");
    const [weightFilter, setWeightFilter] = useState("all");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Cargar usuarios primero
                const allUsers = await UserController.fetchAllUsers();
                
                // Obtener todas las mascotas de todos los usuarios
                const allPets = await getAllPetsFromAllOwners(allUsers);
                setPets(allPets);
            } catch (err) {
                setError('Error loading data: ' + err.message);
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [refreshTrigger]);

    const getAllPetsFromAllOwners = async (usersList) => {
        try {
            const usersWithPets = usersList.filter(user => 
                ['client', 'walker', 'admin'].includes(user.role)
            );
            
            const allPetsPromises = usersWithPets.map(async (user) => {
                try {
                    const pets = await PetsController.fetchPetsByOwner(user.id);
                    return pets.map(pet => ({
                        ...pet,
                        ownerId: user.id,
                        ownerName: user.fullName
                    }));
                } catch (error) {
                    console.warn(`No pets found for user ${user.id} (${user.fullName})`);
                    return [];
                }
            });

            const allPetsArrays = await Promise.all(allPetsPromises);
            return allPetsArrays.flat();
        } catch (error) {
            throw new Error('Failed to fetch all pets: ' + error.message);
        }
    };

    const handleEditPet = (pet) => {
        setSelectedPet(pet);
        setShowEditModal(true);
    };

    const handleSaveEditPet = async (petId, petData) => {
        try {
            await PetsController.updatePet(petId, petData);
            setRefreshTrigger(prev => prev + 1);
            setShowEditModal(false);
            setSelectedPet(null);
            alert("Mascota actualizada correctamente");
        } catch (error) {
            console.error("Error al actualizar mascota:", error);
            alert(`Error al actualizar la mascota: ${error.message}`);
        }
    };

    const filteredPets = pets.filter((pet) => {
        const matchesSearch = searchQuery === "" || 
            pet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pet.ownerName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesOwner = ownerFilter === "all" || pet.ownerName === ownerFilter;

        let matchesAge = true;
        if (ageFilter !== "all" && pet.age) {
            switch (ageFilter) {
                case "young":
                    matchesAge = pet.age <= 2;
                    break;
                case "adult":
                    matchesAge = pet.age > 2 && pet.age <= 7;
                    break;
                case "senior":
                    matchesAge = pet.age > 7;
                    break;
            }
        } else if (ageFilter !== "all" && !pet.age) {
            matchesAge = false;
        }

        let matchesWeight = true;
        if (weightFilter !== "all" && pet.weight) {
            switch (weightFilter) {
                case "small":
                    matchesWeight = pet.weight <= 10;
                    break;
                case "medium":
                    matchesWeight = pet.weight > 10 && pet.weight <= 25;
                    break;
                case "large":
                    matchesWeight = pet.weight > 25;
                    break;
            }
        } else if (weightFilter !== "all" && !pet.weight) {
            matchesWeight = false;
        }

        return matchesSearch && matchesOwner && matchesAge && matchesWeight;
    });

    const uniqueOwners = [...new Set(pets.map(pet => pet.ownerName).filter(Boolean))];

    const totalPets = pets.length;
    const averageAge = pets.length > 0 
        ? Math.round(pets.filter(p => p.age).reduce((acc, pet) => acc + pet.age, 0) / pets.filter(p => p.age).length * 10) / 10
        : 0;
    const averageWeight = pets.length > 0 
        ? Math.round(pets.filter(p => p.weight).reduce((acc, pet) => acc + pet.weight, 0) / pets.filter(p => p.weight).length * 10) / 10
        : 0;

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg text-foreground dark:text-background ml-4">Cargando mascotas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-danger">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="mx-auto">
                
                <AdminPetsHeaderComponent 
                    totalPets={totalPets}
                    averageAge={averageAge}
                    averageWeight={averageWeight}
                    uniqueOwners={uniqueOwners.length}
                />

                <AdminPetsFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    ownerFilter={ownerFilter}
                    setOwnerFilter={setOwnerFilter}
                    ageFilter={ageFilter}
                    setAgeFilter={setAgeFilter}
                    weightFilter={weightFilter}
                    setWeightFilter={setWeightFilter}
                    uniqueOwners={uniqueOwners}
                />

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                        <p className="text-danger font-medium">{error}</p>
                    </div>
                )}

                {filteredPets.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MdPets className="text-4xl text-primary" />
                            </div>
                            <p className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                No se encontraron mascotas
                            </p>
                            <p className="text-accent dark:text-muted">
                                {pets.length === 0 
                                    ? "No hay mascotas registradas en el sistema"
                                    : "Ajusta los filtros para ver más resultados"
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-sm text-accent dark:text-muted">
                                Mostrando {filteredPets.length} de {pets.length} mascotas
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
                            {filteredPets.map((pet) => (
                                <AdminPetsCardComponent 
                                    key={`${pet.ownerId}-${pet.id}`}
                                    pet={pet}
                                    onEditPet={handleEditPet}
                                />
                            ))}
                        </div>
                    </>
                )}

                <AdminEditPetModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedPet(null);
                    }}
                    petData={selectedPet}
                    onSave={handleSaveEditPet}
                />
            </div>
        </div>
    );
};

export default AdminPets;