import { useState } from "react";
import {
    FiMenu,
    FiX,
    FiMoon,
    FiSun,
} from "react-icons/fi";

import { getAllMenuItemsByRole } from '../../BackEnd/Generics/Menu.jsx';
import { useNavigation } from '../../BackEnd/Context/NavigationContext';
import { useHistory } from '../../BackEnd/Context/HistoryContext';
import LogoutConfirmModal from './Modal/LogoutConfirmModal';

const Navbar = ({
    isOpen,
    toggleSidebar,
    isLightMode,
    toggleLightMode,
    activeItem,
    setActiveItem,
    navigateToContent,
    user,
    onLogout,
}) => {
    const { navigateToContent: navContextNavigate } = useNavigation();
    const { clearHistory } = useHistory();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleMenuClick = (id) => {
        if (id === "logout") {
            setShowLogoutModal(true);
        } else {
            if (navContextNavigate) {
                navContextNavigate(id);
            } else if (navigateToContent) {
                navigateToContent(id);
            } else {
                setActiveItem(id);
            }
        }
    };

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            clearHistory();
            await onLogout();
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const { roleItems, commonItems } = getAllMenuItemsByRole(user?.role);

    return (
        <>
            <aside
                className={`${
                    isOpen ? "w-64" : "w-20"
                } relative transition-all duration-300 ease-in-out bg-card dark:bg-foreground shadow-lg flex flex-col`}
            >

            <div className="p-4 flex justify-between items-center">
                <h1
                    className={`${
                        !isOpen && "hidden"
                    } text-xl font-bold text-foreground dark:text-background`}
                >
                WalkyApp
                </h1>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-primary hover:bg-ring text-white"
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            <div className="p-4 border-b border-border dark:border-accent">
                <div className="flex items-center space-x-4">
                    <img
                        src={user?.profileImage}
                        alt="User"
                        className="w-12 h-12 rounded-full"
                        onError={(e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
                        }}
                    />
                    {isOpen && (
                        <div>
                            <h2 className="text-foreground dark:text-background font-semibold">
                                {user?.fullName}
                            </h2>
                            <p className="text-accent text-sm">{user?.email}</p>
                            <span className="text-xs px-2 py-1 bg-primary text-white rounded-full">
                                {user?.role}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <nav className="p-4 space-y-2 flex-1 overflow-auto">
                
                {roleItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${
                        activeItem === item.id
                        ? "bg-primary text-white"
                        : "hover:bg-muted dark:hover:bg-accent text-foreground dark:text-background"
                    }`}
                >
                    <item.icon size={20} />
                    {isOpen && <span>{item.label}</span>}
                </button>
                ))}

                {commonItems?.length > 0 && (
                    <div className="border-t border-border dark:border-accent my-4"></div>
                )}

                {commonItems?.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${
                        activeItem === item.id
                        ? "bg-primary text-white"
                        : item.id === "logout" 
                            ? "hover:bg-destructive hover:text-white text-foreground dark:text-background"
                            : "hover:bg-muted dark:hover:bg-accent text-foreground dark:text-background"
                    }`}
                >
                    <item.icon size={20} />
                    {isOpen && <span>{item.label}</span>}
                </button>
                ))}
            </nav>

            <div className="p-4 border-t border-border dark:border-accent">
                <button
                onClick={toggleLightMode}
                className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-muted dark:bg-accent hover:bg-primary dark:hover:bg-primary text-foreground dark:text-background"
                >
                {isLightMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                {isOpen && <span>{isLightMode ? "Light Mode" : "Dark Mode"}</span>}
                </button>
            </div>
            </aside>

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
                isLoading={isLoggingOut}
            />
        </>
    );
};

export default Navbar;