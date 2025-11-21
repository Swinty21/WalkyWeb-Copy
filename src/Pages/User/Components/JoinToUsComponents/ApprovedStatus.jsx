import { FaCheckCircle, FaUserCheck, FaClock, FaStar } from 'react-icons/fa';
import ImageGallery from './ImageGallery';

const ApprovedStatus = ({ application }) => {
    return (
        <div className="w-full h-full p-6 bg-background dark:bg-foreground overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl p-12 text-center border border-success/20">
                    <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground dark:text-background mb-4">
                        ¡Felicitaciones! Solicitud Aprobada
                    </h2>
                    <p className="text-lg text-accent dark:text-muted mb-8 max-w-2xl mx-auto">
                        Tu solicitud ha sido aprobada exitosamente. Bienvenido al equipo de paseadores.
                        Tu cuenta será actualizada automáticamente en las próximas 48 horas hábiles.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-background dark:bg-foreground rounded-xl p-6 border border-border dark:border-muted">
                            <h3 className="text-xl font-semibold text-foreground dark:text-background mb-3 flex items-center justify-center">
                                <FaUserCheck className="text-success mr-2" />
                                Estado de tu Solicitud
                            </h3>
                            <div className="text-left space-y-3 text-accent dark:text-muted">
                                <div className="flex items-center justify-between">
                                    <span>ID:</span>
                                    <span className="font-mono text-sm">{application.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Enviada:</span>
                                    <span>{new Date(application.submittedAt).toLocaleDateString('es-ES')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Aprobada:</span>
                                    <span>{new Date(application.reviewedAt).toLocaleDateString('es-ES')}</span>
                                </div>
                                {application.applicationScore && (
                                    <div className="flex items-center justify-between">
                                        <span>Puntuación:</span>
                                        <div className="flex items-center">
                                            <FaStar className="text-warning mr-1" />
                                            <span className="font-bold">{application.applicationScore}/100</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-background dark:bg-foreground rounded-xl p-6 border border-border dark:border-muted">
                            <h3 className="text-xl font-semibold text-foreground dark:text-background mb-3 flex items-center justify-center">
                                <FaClock className="text-primary mr-2" />
                                Próximos Pasos
                            </h3>
                            <div className="text-left space-y-2 text-accent dark:text-muted">
                                <p>✓ Documentación verificada</p>
                                <p>✓ Perfil aprobado</p>
                                <p>⏳ Activación de cuenta (48hs hábiles)</p>
                                <p>⏳ Acceso a plataforma de paseadores</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-info/10 border border-info/20 rounded-xl p-6 mb-6">
                        <h4 className="text-lg font-semibold text-foreground dark:text-background mb-3">
                            ¿Qué sigue ahora?
                        </h4>
                        <div className="text-left space-y-2 text-accent dark:text-muted">
                            <p>• Tu cuenta será actualizada automáticamente en las próximas 48 horas hábiles</p>
                            <p>• Recibirás un email de confirmación cuando tu cuenta esté lista</p>
                            <p>• Podrás acceder a todas las funciones de paseador desde tu panel de usuario</p>
                            <p>• Te contactaremos si necesitamos información adicional</p>
                        </div>
                    </div>

                    {application.adminNotes && (
                        <div className="bg-success/10 border border-success/20 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-foreground dark:text-background mb-3">
                                Comentarios del equipo de revisión:
                            </h4>
                            <p className="text-success font-medium">
                                {application.adminNotes}
                            </p>
                        </div>
                    )}
                </div>

                {application.images && (
                    <ImageGallery 
                        images={application.images}
                        title="Documentación Aprobada"
                    />
                )}
            </div>
        </div>
    );
};

export default ApprovedStatus;