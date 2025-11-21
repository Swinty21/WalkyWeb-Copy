import { FaClock, FaFileAlt } from 'react-icons/fa';
import ImageGallery from './ImageGallery';

const PendingStatus = ({ application }) => {
    return (
        <div className="w-full h-full p-6 bg-background dark:bg-foreground overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-gradient-to-br from-warning/10 to-primary/10 rounded-2xl p-12 text-center border border-warning/20">
                    <div className="w-24 h-24 bg-warning rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaClock className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground dark:text-background mb-4">
                        Solicitud en Revisión
                    </h2>
                    <p className="text-lg text-accent dark:text-muted mb-8 max-w-2xl mx-auto">
                        Tu solicitud está siendo revisada por nuestro equipo. 
                        Te notificaremos por email una vez que tengamos una respuesta.
                    </p>
                    
                    <div className="bg-background dark:bg-foreground rounded-xl p-6 border border-border dark:border-muted">
                        <h3 className="text-xl font-semibold text-foreground dark:text-background mb-3">
                            Detalles de tu solicitud:
                        </h3>
                        <div className="text-left space-y-2 text-accent dark:text-muted">
                            <div className="flex items-center">
                                <FaFileAlt className="mr-2" />
                                <span>ID: {application.id}</span>
                            </div>
                            <div className="flex items-center">
                                <FaClock className="mr-2" />
                                <span>Enviada: {new Date(application.submittedAt).toLocaleDateString('es-ES')}</span>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
                            <p className="text-sm text-info">
                                <strong>Tiempo estimado de revisión:</strong> 3-5 días hábiles
                            </p>
                        </div>
                    </div>
                </div>

                {application.images && (
                    <ImageGallery 
                        images={application.images}
                        title="Documentación en Revisión"
                    />
                )}
            </div>
        </div>
    );
};

export default PendingStatus;