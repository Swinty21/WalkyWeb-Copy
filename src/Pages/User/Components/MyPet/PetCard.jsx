import { FiEdit3, FiTrash2, FiHeart } from "react-icons/fi";
import { MdDirectionsWalk } from "react-icons/md";

const PetCard = ({ 
    pet, 
    onRequestWalk, 
    onEditPet, 
    onDeletePet 
}) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-background dark:bg-foreground shadow-lg border border-border dark:border-muted transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30">

            <div className="relative h-56 overflow-hidden">
                <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FiHeart className="text-red-500 w-5 h-5" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-between items-center text-white text-sm font-medium">
                        {pet.weight && (
                            <span className="bg-black/60 px-3 py-1 rounded-full">
                                {pet.weight} kg
                            </span>
                        )}
                        {pet.age && (
                            <span className="bg-black/60 px-3 py-1 rounded-full">
                                {pet.age} años
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-bold text-xl text-foreground dark:text-background leading-tight">
                            {pet.name}
                        </h3>
                        {pet.description && (
                            <p className="text-accent dark:text-muted text-sm leading-relaxed line-clamp-2">
                                {pet.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button 
                            onClick={() => onRequestWalk(pet)}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
                        >
                            <MdDirectionsWalk className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                            Solicitar Paseo
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => onEditPet(pet)}
                                className="w-full bg-background dark:bg-foreground border border-primary/30 text-primary hover:bg-primary hover:text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                            >
                                <FiEdit3 className="w-4 h-4 mr-2" />
                                Editar
                            </button>
                            <button 
                                onClick={() => onDeletePet(pet)}
                                className="w-full bg-background dark:bg-foreground border border-red-300 text-red-500 hover:bg-red-500 hover:text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                            >
                                <FiTrash2 className="w-4 h-4 mr-2" />
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetCard;