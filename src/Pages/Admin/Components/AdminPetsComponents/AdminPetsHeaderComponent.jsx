import { FiUsers, FiShield } from "react-icons/fi";
import { MdPets } from "react-icons/md";

const AdminPetsHeaderComponent = ({ 
    totalPets, 
    averageAge, 
    averageWeight,
    uniqueOwners
}) => {
    return (
        <>
            <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-8">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                            <MdPets className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center">
                                Gestión de Mascotas
                                <div className="ml-3 bg-white/20 backdrop-blur-sm rounded-full p-2">
                                    <FiShield className="text-white text-lg" />
                                </div>
                            </h1>
                            <p className="text-white/80 text-sm mt-1">
                                Panel de administración - Vista general de todas las mascotas registradas
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-6 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Total Mascotas</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">{totalPets}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <MdPets className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/5 p-6 rounded-xl border border-teal-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Propietarios Únicos</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">{uniqueOwners}</p>
                        </div>
                        <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-teal-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 p-6 rounded-xl border border-green-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Peso Promedio</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">
                                {averageWeight > 0 ? `${averageWeight} kg` : 'N/A'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 p-6 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent dark:text-muted font-medium">Edad Promedio</p>
                            <p className="text-3xl font-bold text-foreground dark:text-background mt-1">
                                {averageAge > 0 ? `${averageAge} años` : 'N/A'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-cyan-600 rounded-full ml-1"></div>
                            <div className="w-1 h-1 bg-cyan-600 rounded-full ml-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPetsHeaderComponent;