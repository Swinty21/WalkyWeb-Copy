import { FiEdit3, FiUser, FiShield, FiCalendar, FiPackage } from "react-icons/fi";
import { MdPets } from "react-icons/md";

const AdminPetsCardComponent = ({ pet, onEditPet }) => {
    const getPetSizeCategory = (weight) => {
        if (!weight) return null;
        if (weight <= 10) return { category: "Pequeño", color: "text-green-600 bg-green-100" };
        if (weight <= 25) return { category: "Mediano", color: "text-yellow-600 bg-yellow-100" };
        return { category: "Grande", color: "text-red-600 bg-red-100" };
    };

    const getAgeCategory = (age) => {
        if (!age) return null;
        if (age <= 2) return { category: "Joven", color: "text-blue-600 bg-blue-100" };
        if (age <= 7) return { category: "Adulto", color: "text-purple-600 bg-purple-100" };
        return { category: "Mayor", color: "text-gray-600 bg-gray-100" };
    };

    const sizeInfo = getPetSizeCategory(pet.weight);
    const ageInfo = getAgeCategory(pet.age);

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-foreground/80 backdrop-blur-sm shadow-lg border border-emerald-500/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-emerald-500/30 h-full flex flex-col">

            <div className="absolute top-2 left-2 z-10">
                <div className="bg-emerald-500/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                    <FiShield className="text-white text-xs" />
                </div>
            </div>

            <div className="relative h-56 overflow-hidden">
                <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-between items-center text-white text-sm font-medium">
                        {sizeInfo && (
                            <span className="bg-black/60 px-3 py-1 rounded-full">
                                {sizeInfo.category}
                            </span>
                        )}
                        {ageInfo && (
                            <span className="bg-black/60 px-3 py-1 rounded-full">
                                {ageInfo.category}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
                        <MdPets className="text-white text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground dark:text-background group-hover:text-emerald-600 transition-colors duration-300 truncate">
                            {pet.name}
                        </h3>
                        <div className="flex items-center text-accent dark:text-muted">
                            <FiUser className="mr-1 flex-shrink-0" size={12} />
                            <span className="text-xs font-medium truncate">{pet.ownerName}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                    {pet.age && (
                        <div className="flex items-center p-2 bg-emerald-500/10 rounded-lg">
                            <FiCalendar className="mr-2 text-emerald-600 flex-shrink-0" size={14} />
                            <span className="text-xs font-semibold text-foreground dark:text-background">
                                {pet.age} año{pet.age !== 1 ? 's' : ''}
                            </span>
                            {ageInfo && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${ageInfo.color}`}>
                                    {ageInfo.category}
                                </span>
                            )}
                        </div>
                    )}

                    {pet.weight && (
                        <div className="flex items-center p-2 bg-teal-500/10 rounded-lg">
                            <FiPackage className="mr-2 text-teal-600 flex-shrink-0" size={14} />
                            <span className="text-xs font-semibold text-foreground dark:text-background">
                                {pet.weight} kg
                            </span>
                            {sizeInfo && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${sizeInfo.color}`}>
                                    {sizeInfo.category}
                                </span>
                            )}
                        </div>
                    )}

                    {pet.description && (
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <p className="text-xs text-accent dark:text-muted italic line-clamp-3">
                                "{pet.description}"
                            </p>
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg p-2 border border-emerald-500/20">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-600 font-medium">ID: {pet.id}</span>
                            <span className="text-teal-600 font-medium">Owner ID: {pet.ownerId}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    <button
                        onClick={() => onEditPet(pet)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <FiEdit3 className="mr-1" size={12} />
                        Editar Mascota
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPetsCardComponent;