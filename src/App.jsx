import { useState, useEffect } from "react";
import Navbar from "./Pages/General/Navbar";
import MainContent from "./Pages/General/MainContent";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import { AuthController } from "./BackEnd/Controllers/AuthController.js";
import { UserProvider } from "./BackEnd/Context/UserContext";
import { NavigationProvider } from "./BackEnd/Context/NavigationContext";
import { HistoryProvider } from "./BackEnd/Context/HistoryContext";
import { ToastProvider } from "./BackEnd/Context/ToastContext";

const App = () => {
  // Inicializar estados con valores del sessionStorage si existen
  const [isOpen, setIsOpen] = useState(() => {
    const saved = sessionStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });
  
  const [isLightMode, setIsLightMode] = useState(() => {
    const saved = sessionStorage.getItem("lightMode");
    return saved ? JSON.parse(saved) : true;
  });
  
  const [activeItem, setActiveItem] = useState(() => {
    const saved = sessionStorage.getItem("activeItem");
    return saved || "home";
  });
  
  const [contentParams, setContentParams] = useState(() => {
    const saved = sessionStorage.getItem("contentParams");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    sessionStorage.setItem("sidebarOpen", JSON.stringify(newIsOpen));
  };
  
  const toggleLightMode = () => {
    const newLightMode = !isLightMode;
    setIsLightMode(newLightMode);
    sessionStorage.setItem("lightMode", JSON.stringify(newLightMode));
  };

  // Método para cambiar contenido del MainContent
  // para utilizarlo se necesita el useNavegation del NavigationContext (pero solo funciona dentro de los componentes de NavigationProvider)
  const navigateToContent = (contentId, params = null) => {
    setActiveItem(contentId);
    setContentParams(params);
    
    // Guardar en sessionStorage
    sessionStorage.setItem("activeItem", contentId);
    sessionStorage.setItem("contentParams", JSON.stringify(params));
  };

  // pagina principal por rol de usuario
  const getDefaultActiveItem = (userRole) => {
    switch (userRole) {
      case 'admin':
        return 'promotions';
      case 'client':
        return 'home';
      case 'walker':
        return 'my-walks-walker';
      case 'support':
        return 'tickets-general';
      default:
        return 'home';
    }
  };

  const handleLogin = async (credentials) => {
    const loggedUser = await AuthController.login(credentials);
    sessionStorage.setItem("token", loggedUser.token);
    setUser(loggedUser);
    
    const defaultItem = getDefaultActiveItem(loggedUser.role);
    setActiveItem(defaultItem);
    setContentParams(null);
    
    sessionStorage.setItem("activeItem", defaultItem);
    sessionStorage.setItem("contentParams", JSON.stringify(null));
  };

  const handleRegister = async (data) => {
    await AuthController.register(data);
    setAuthScreen("login");
  };

  const handleLogout = async () => {
    await AuthController.logout();
    sessionStorage.removeItem("token");
    setUser(null);
    setAuthScreen("login");
    setActiveItem("home"); 
    setContentParams(null);
    
    sessionStorage.removeItem("activeItem");
    sessionStorage.removeItem("contentParams");
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const u = await AuthController.checkSession(token);
        setUser(u);
        
        const savedActiveItem = sessionStorage.getItem("activeItem");
        if (savedActiveItem) {
          setActiveItem(savedActiveItem);
        } else {
          const defaultItem = getDefaultActiveItem(u.role);
          setActiveItem(defaultItem);
          sessionStorage.setItem("activeItem", defaultItem);
        }

      } catch (err) {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("activeItem");
        sessionStorage.removeItem("contentParams");
        
        setUser(null);
        setActiveItem("home");
        setContentParams(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-foreground">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground dark:text-background">Cargando...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isLightMode ? "" : "dark"}`}>
      <ToastProvider>
        {!user ? (
          authScreen === "login" ? (
            <Login
              onLogin={handleLogin}
              switchToRegister={() => setAuthScreen("register")}
            />
          ) : (
            <Register
              onRegister={handleRegister}
              switchToLogin={() => setAuthScreen("login")}
            />
          )
        ) : (
          <UserProvider user={user}>
            <HistoryProvider>
              <NavigationProvider navigateToContent={navigateToContent}>
                <div className="flex h-screen bg-background dark:bg-foreground">
                  <Navbar
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                    isLightMode={isLightMode}
                    toggleLightMode={toggleLightMode}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    navigateToContent={navigateToContent}
                    user={user}
                    onLogout={handleLogout}
                  />
                  <MainContent 
                    activeItem={activeItem} 
                    contentParams={contentParams}
                    navigateToContent={navigateToContent}
                    isLightMode={isLightMode} 
                  />
                </div>
              </NavigationProvider>
            </HistoryProvider>
          </UserProvider>
        )}
      </ToastProvider>
    </div>
  );
};

export default App;