import { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { JoinToUsController } from '../../BackEnd/Controllers/JoinToUsController';
import { useUser } from '../../BackEnd/Context/UserContext';
import { useToast } from '../../BackEnd/Context/ToastContext';

import PendingStatus from './Components/JoinToUsComponents/PendingStatus';
import RejectedStatus from './Components/JoinToUsComponents/RejectedStatus';
import ApprovedStatus from './Components/JoinToUsComponents/ApprovedStatus';
import RegistrationForm from './Components/JoinToUsComponents/RegistrationForm';

const JoinToUs = () => {
    const user = useUser();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [currentApplication, setCurrentApplication] = useState(null);
    const [errors, setErrors] = useState({});
    const { success, error } = useToast();

    useEffect(() => {
        const checkExistingApplication = async () => {
            if (!user?.id) {
                setInitialLoading(false);
                return;
            }

            try {
                const application = await JoinToUsController.getApplicationByUserId(user.id);

                setCurrentApplication(application);
            } catch (er) {
                error('Ocurrió un error al buscar su solicitud.', {
                    title: 'Error',
                    duration: 4000
                });
            } finally {
                setInitialLoading(false);
            }
        };

        checkExistingApplication();
    }, [user?.id]);

    const handleSubmit = async (registrationData) => {
        setLoading(true);
        setErrors({});
        
        try {
            const completeData = {
                ...registrationData,
                userId: user?.id  
            };

            const result = await JoinToUsController.submitWalkerRegistration(completeData);
            
            success('Solicitud Enviada', {
                    title: 'Éxito',
                    duration: 4000
                });
            setCurrentApplication(result);
            setSubmitted(true);
            

        } catch (er) {
            error('Ocurrió un error al enviar el registro. Por favor intenta nuevamente.', {
                    title: 'Error',
                    duration: 4000
                });
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = async () => {
        setLoading(true);
        setErrors({});
        
        try {
            await JoinToUsController.retryRejectedApplication(user?.id);
            setCurrentApplication(null);
        } catch (er) {
            error('Ocurrió un error al procesar la solicitud. Por favor intenta nuevamente.', {
                    title: 'Error',
                    duration: 4000
                });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground flex items-center justify-center">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                    <span className="text-foreground dark:text-background">Cargando...</span>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl p-12 text-center border border-success/20">
                        <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="text-4xl text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground dark:text-background mb-4">
                            ¡Registro Enviado Exitosamente!
                        </h2>
                        <p className="text-lg text-accent dark:text-muted mb-8 max-w-2xl mx-auto">
                            Gracias por tu interés en unirte a nuestro equipo de paseadores. 
                            Hemos recibido tu solicitud y la revisaremos en un plazo de 3-5 días hábiles.
                        </p>
                        <div className="bg-background dark:bg-foreground rounded-xl p-6 border border-border dark:border-muted">
                            <h3 className="text-xl font-semibold text-foreground dark:text-background mb-3">
                                Próximos Pasos:
                            </h3>
                            <div className="text-left space-y-2 text-accent dark:text-muted">
                                <p>• Revisaremos tu documentación</p>
                                <p>• Te daremos acceso a nuestra plataforma si eres seleccionado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentApplication) {
        const { status } = currentApplication;

        switch (status) {
            case 'pending':
            case 'under_review':
                return <PendingStatus application={currentApplication} />;
                
            case 'rejected':
                return (
                    <RejectedStatus 
                        application={currentApplication}
                        onRetry={handleRetry}
                    />
                );
                
            case 'approved':
                return <ApprovedStatus application={currentApplication} />;
                
            default:
                
                return (
                    <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="bg-danger/10 border border-danger/20 rounded-xl p-8">
                                <h2 className="text-2xl font-bold text-danger mb-4">
                                    Estado de solicitud desconocido
                                </h2>
                                <p className="text-accent dark:text-muted">
                                    Ha ocurrido un error al obtener el estado de tu solicitud. 
                                    Por favor contacta al soporte técnico.
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    }

    return (
        <>
            {errors.submit && (
                <div className="fixed top-4 right-4 z-50 bg-danger text-white p-4 rounded-lg shadow-lg">
                    {errors.submit}
                </div>
            )}
            {errors.retry && (
                <div className="fixed top-4 right-4 z-50 bg-danger text-white p-4 rounded-lg shadow-lg">
                    {errors.retry}
                </div>
            )}
            
            <RegistrationForm 
                onSubmit={handleSubmit}
                loading={loading}
            />
        </>
    );
};

export default JoinToUs;