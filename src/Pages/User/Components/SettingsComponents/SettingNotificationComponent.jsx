import { FaBell, FaDog, FaBullhorn, FaEnvelopeOpen, FaExclamationTriangle, FaCreditCard } from 'react-icons/fa';

const SettingNotificationComponent = ({ settings, onToggleNotification }) => {
    const notificationConfig = {
        walkStatus: {
            label: 'Estados de paseos',
            description: 'Notificaciones sobre inicio, finalización y cambios en tus paseos',
            icon: FaDog,
            color: 'text-blue-500'
        },
        announcements: {
            label: 'Anuncios y beneficios', 
            description: 'Promociones, ofertas especiales y nuevas funcionalidades',
            icon: FaBullhorn,
            color: 'text-green-500'
        },
        subscription: {
            label: 'Avisos de suscripción',
            description: 'Recordatorios de renovación, cambios de plan y facturación',
            icon: FaCreditCard,
            color: 'text-purple-500'
        },
        messages: {
            label: 'Mensajes',
            description: 'Mensajes de paseadores y comunicaciones durante el servicio',
            icon: FaEnvelopeOpen,
            color: 'text-orange-500'
        },
        systemAlerts: {
            label: 'Alertas de sistema',
            description: 'Alertas importantes de seguridad y mantenimiento del sistema',
            icon: FaExclamationTriangle,
            color: 'text-red-500'
        }
    };

    return (
        <div className="bg-background dark:bg-foreground rounded-2xl shadow-xl p-8 border border-border dark:border-muted">
            <div className="flex items-center mb-6">
                <FaBell className="text-3xl text-primary mr-4" />
                <div>
                    <h2 className="text-2xl font-bold text-foreground dark:text-background">
                        Configuración de Notificaciones
                    </h2>
                    <p className="text-accent dark:text-muted text-sm mt-1">
                        Personaliza qué Notificaciones y Alertas quieres recibir
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {Object.entries(settings.notifications).map(([key, value]) => {
                    const config = notificationConfig[key];
                    if (!config) return null;

                    const IconComponent = config.icon;

                    return (
                        <div 
                            key={key} 
                            className="group p-6 bg-muted/30 dark:bg-accent/10 rounded-xl hover:bg-muted/50 dark:hover:bg-accent/20 transition-all duration-200 border border-transparent hover:border-primary/20"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className={`p-3 rounded-full bg-white dark:bg-foreground shadow-sm ${config.color}`}>
                                        <IconComponent className="text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-foreground dark:text-background text-lg">
                                                {config.label}
                                            </h3>
                                            {value && (
                                                <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full font-medium">
                                                    Activo
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-accent dark:text-muted text-sm leading-relaxed">
                                            {config.description}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="ml-4 flex-shrink-0">
                                    <button
                                        onClick={() => onToggleNotification(key)}
                                        className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${
                                            value 
                                                ? "bg-primary shadow-lg" 
                                                : "bg-accent dark:bg-muted"
                                        }`}
                                        aria-label={`${value ? 'Desactivar' : 'Activar'} ${config.label}`}
                                    >
                                        <span 
                                            className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 shadow-md flex items-center justify-center ${
                                                value 
                                                    ? "right-1 transform scale-110" 
                                                    : "left-1"
                                            }`}
                                        >
                                            {value && (
                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-info/10 border border-info/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <FaBell className="text-info mt-1" />
                    <div>
                        <h4 className="font-semibold text-info mb-1">
                            Información sobre Notificaciones
                        </h4>
                        <p className="text-info/80 text-sm leading-relaxed">
                            Las notificaciones se enviarán al correo electrónico configurado en tu cuenta. 
                            Puedes cambiar estas preferencias en cualquier momento. Las alertas de sistema 
                            críticas se enviarán independientemente de esta configuración por seguridad.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingNotificationComponent;