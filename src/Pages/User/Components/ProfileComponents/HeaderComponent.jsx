import { useState } from "react";
import { FiSettings, FiLock, FiUser } from "react-icons/fi";
import { UserController } from "../../../../BackEnd/Controllers/UserController";
import { useNavigation } from "../../../../BackEnd/Context/NavigationContext";
import EditProfileModal from "../../Modals/ProfileModals/EditProfileModal";
import ChangePassModal from "../../Modals/ProfileModals/ChangePassModal";

const HeaderComponent = ({ userData, buttonBase, buttonInactive, onUpdateProfile, userId }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

    const { navigateToContent } = useNavigation();

    const handleSaveProfile = async (updatedData) => {
        try {
            onUpdateProfile?.(updatedData);
        } catch (er) {
            
        }
    };

    const handleChangePassword = async (passwordData) => {
        try {
            await UserController.changeUserPassword(userId, passwordData);
        } catch (er) {
            
        }
    };

    const handleViewWalkerProfile = () => {
        const walkerId = userData.id
        navigateToContent('walker-profile', {walkerId});
    };

    return (
        <>
            <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src={userData.avatar}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-heading font-heading text-background">{userData.name}</h1>
                            <p className="text-accent dark:text-muted">{userData.email}</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className={`${buttonBase} ${buttonInactive} flex items-center`}
                        >
                            <FiSettings className="mr-2" /> Editar Perfil
                        </button>
                        <button 
                            onClick={() => setIsChangePassModalOpen(true)}
                            className={`${buttonBase} ${buttonInactive} flex items-center`}
                        >
                            <FiLock className="mr-2" /> Cambiar Contraseña
                        </button>
                        {userData?.rol === 'walker' && (
                            <button 
                                onClick={handleViewWalkerProfile}
                                className={`${buttonBase} ${buttonInactive} flex items-center`}
                            >
                                <FiUser className="mr-2" /> Ver Mi Perfil de Paseador
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={userData}
                onSave={handleSaveProfile}
            />

            <ChangePassModal
                isOpen={isChangePassModalOpen}
                onClose={() => setIsChangePassModalOpen(false)}
                onSave={handleChangePassword}
            />
        </>
    );
};

export default HeaderComponent;