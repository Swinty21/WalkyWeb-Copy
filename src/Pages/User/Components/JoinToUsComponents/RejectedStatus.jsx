import { FaTimes, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import ImageGallery from './ImageGallery';

const RejectedStatus = ({ application, onRetry }) => {
    return (
        <div className="w-full h-full p-6 bg-background dark:bg-foreground overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-gradient-to-br from-danger/10 to-warning/10 rounded-2xl p-12 text-center border border-danger/20">
                    <div className="w-24 h-24 bg-danger rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTimes className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground dark:text-background mb-4">
                        Solicitud Rechazada
                    </h2>
                    <p className="text-lg text-accent dark:text-muted mb-8 max-w-2xl mx-auto">
                        Lamentablemente, tu solicitud no pudo ser aprobada en esta ocasión. 
                        Revisa los comentarios a continuación y puedes intentar nuevamente.
                    </p>
                    
                    <div className="bg-background dark:bg-foreground rounded-xl p-6 border border-border dark:border-muted mb-8">
                        <h3 className="text-xl font-semibold text-foreground dark:text-background mb-4 flex items-center justify-center">
                            <FaExclamationTriangle className="text-warning mr-2" />
                            Razón del rechazo:
                        </h3>
                        <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                            <p className="text-danger font-medium">
                                {application.adminNotes || 'No se proporcionaron detalles específicos.'}
                            </p>
                        </div>
                        
                        <div className="mt-4 text-left space-y-2 text-accent dark:text-muted text-sm">
                            <p><strong>ID de solicitud:</strong> {application.id}</p>
                            <p><strong>Enviada:</strong> {new Date(application.submittedAt).toLocaleDateString('es-ES')}</p>
                            <p><strong>Revisada:</strong> {new Date(application.reviewedAt).toLocaleDateString('es-ES')}</p>
                        </div>
                    </div>

                    <div className="bg-info/10 border border-info/20 rounded-xl p-6 mb-8">
                        <h4 className="text-lg font-semibold text-foreground dark:text-background mb-3">
                            Consejos para tu próxima solicitud:
                        </h4>
                        <div className="text-left space-y-2 text-accent dark:text-muted">
                            <p>• Asegúrate de que las fotos del DNI sean claras y legibles</p>
                            <p>• La selfie con DNI debe mostrar claramente tu rostro y el documento</p>
                            <p>• Verifica que toda la información personal sea correcta</p>
                            <p>• Las imágenes deben tener buena iluminación y calidad</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onRetry}
                        className="bg-gradient-to-r from-primary to-success text-white py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-lg transform hover:scale-[1.02] flex items-center mx-auto"
                    >
                        <FaRedo className="mr-3" />
                        Enviar Nueva Solicitud
                    </button>
                </div>

                {/* Galería de imágenes - mostrar la documentación rechazada para referencia */}
                {application.images && (
                    <ImageGallery 
                        images={application.images}
                        title="Documentación Rechazada (para referencia)"
                    />
                )}
            </div>
        </div>
    );
};

export default RejectedStatus;