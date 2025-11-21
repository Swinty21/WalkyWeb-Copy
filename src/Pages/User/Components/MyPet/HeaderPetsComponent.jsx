import { FiPlus, FiMapPin } from "react-icons/fi";
import { MdPets, MdDirectionsWalk } from "react-icons/md";

const HeaderPetsComponent = ({ 
    pets, 
    onAddPet, 
    onFindWalkers 
}) => {
    const totalPets = pets.length;
    const averageWeight = totalPets > 0 
        ? Math.round(pets.reduce((acc, pet) => acc + (pet.weight || 0), 0) / totalPets * 10) / 10
        : 0;
    const averageAge = totalPets > 0 
        ? Math.round(pets.reduce((acc, pet) => acc + (pet.age || 0), 0) / totalPets * 10) / 10
        : 0;

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground dark:text-background flex items-center">
                        <MdPets className="mr-3 text-primary" />
                        Mis Mascotas
                    </h1>
                    <p className="text-accent dark:text-muted mt-2">
                        Gestiona tus mascotas y solicita servicios de paseo
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onFindWalkers}
                        className="px-6 py-3 bg-background dark:bg-foreground border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                    >
                        <MdDirectionsWalk className="mr-2" />
                        Buscar Paseadores
                    </button>
                    <button
                        onClick={onAddPet}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                    >
                        <FiPlus className="mr-2" />
                        Agregar Mascota
                    </button>
                </div>
            </div>

            {totalPets > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-accent dark:text-muted">Total Mascotas</p>
                                <p className="text-2xl font-bold text-foreground dark:text-background">{totalPets}</p>
                            </div>
                            <MdPets className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-success/10 to-success/5 p-6 rounded-xl border border-success/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-accent dark:text-muted">Peso Promedio</p>
                                <p className="text-2xl font-bold text-foreground dark:text-background">
                                    {averageWeight} kg
                                </p>
                            </div>
                            <FiMapPin className="w-8 h-8 text-success" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-warning/10 to-warning/5 p-6 rounded-xl border border-warning/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-accent dark:text-muted">Edad Promedio</p>
                                <p className="text-2xl font-bold text-foreground dark:text-background">
                                    {averageAge} años
                                </p>
                            </div>
                            <MdDirectionsWalk className="w-8 h-8 text-warning" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeaderPetsComponent;