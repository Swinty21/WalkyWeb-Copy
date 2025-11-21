import { useState, useEffect } from "react";
import WalkMap from "../Components/WalkMap";
import WalkData from "../Components/WalkData";
import WalkChat from "../Components/WalkChat";
import { WalksController } from "../../../../BackEnd/Controllers/WalksController";

const WalkView = ({ id }) => {
    const { tripId } = id || {};
    const [walkData, setWalkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWalkData = async () => {
            if (!tripId) {
                setLoading(false);
                setError("No se proporcionó un ID de paseo válido");
                return;
            }

            try {
                setLoading(true);
                const data = await WalksController.fetchWalkDetails(tripId);
                setWalkData(data);
                setError(null);
            } catch (error) {
                console.error('Error cargando datos del paseo:', error);
                setError("Error al cargar los datos del paseo");
            } finally {
                setLoading(false);
            }
        };

        loadWalkData();
    }, [tripId]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-background dark:bg-foreground p-4 md:p-6">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                        {/* Chat Skeleton */}
                        <div className="lg:col-span-3 h-[600px]">
                            <div className="bg-foreground rounded-2xl shadow-md h-full border border-border animate-pulse">
                                <div className="p-4 border-b border-border">
                                    <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-9 space-y-4 md:space-y-6">
                            <div className="bg-gray-200 rounded-2xl shadow-md h-[400px] animate-pulse flex items-center justify-center">
                                <div className="text-gray-400 text-center">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                                    <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                                </div>
                            </div>

                            <div className="bg-foreground rounded-2xl shadow-md h-[200px] border border-border animate-pulse">
                                <div className="p-4">
                                    <div className="h-5 bg-gray-300 rounded w-40 mb-3"></div>
                                    <div className="space-y-2">
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tripId) {
        return (
            <div className="w-full min-h-screen bg-background dark:bg-foreground p-4 md:p-6 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                    <div className="text-red-500 text-5xl mb-3">⚠️</div>
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                    <p className="text-red-600">{error || "No se pudo cargar el paseo"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background dark:bg-foreground p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto">
                {walkData && (
                    <div className="mb-4 md:mb-6 bg-foreground rounded-lg p-4 border border-border">
                        <h1 className="text-xl md:text-2xl font-bold text-foreground dark:text-background">
                            Detalles del Paseo
                        </h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <span className={`px-3 py-1 rounded-full font-medium ${
                                walkData.status === 'Activo' ? 'bg-green-100 text-green-700' :
                                walkData.status === 'Finalizado' ? 'bg-gray-100 text-gray-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                Estado: {walkData.status}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <div className="lg:sticky lg:top-6">
                            <div className="h-[500px] lg:h-[calc(100vh-200px)] lg:min-h-[600px] lg:max-h-[800px]">
                                <WalkChat 
                                    tripId={tripId} 
                                    walkStatus={walkData?.status} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-9 order-1 lg:order-2 space-y-4 md:space-y-6">

                        <div className="min-h-[400px]">
                            <WalkMap
                                tripId={tripId}
                                walkStatus={walkData?.status}
                            />
                        </div>

                        <div className="min-h-[300px] max-h-[400px]">
                            <WalkData
                                tripId={tripId}
                                walkStatus={walkData?.status}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkView;