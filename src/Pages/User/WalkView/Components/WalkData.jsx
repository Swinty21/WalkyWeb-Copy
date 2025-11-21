import { useState, useEffect } from "react";
import { FiActivity, FiMapPin } from "react-icons/fi";
import { WalkTrackingController } from "../../../../BackEnd/Controllers/WalkTrackingController";

const WalkData = ({ tripId, walkStatus }) => {
  const [apiRecords, setApiRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const isTrackingVisible = WalkTrackingController.isTrackingVisible(walkStatus);
  const trackingStatusMessage = WalkTrackingController.getTrackingStatusMessage(walkStatus);

  useEffect(() => {
    if (tripId && isTrackingVisible) {
      loadWalkRecords();
      
      let interval;
      if (walkStatus?.toLowerCase() === 'activo') {
        interval = setInterval(() => {
          loadWalkRecords();
        }, 30000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [tripId, isTrackingVisible, walkStatus]);

  const loadWalkRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedRecords = await WalkTrackingController.fetchWalkRecords(tripId);
      
      if (!fetchedRecords || fetchedRecords.length === 0) {
        setApiRecords([]);
        return;
      }

      const recordsWithAddresses = await Promise.all(
        fetchedRecords.map(async (record) => {
          const hasRealAddress = record.address && 
                                !record.address.startsWith('Lat:') &&
                                record.address !== '';
          
          if (hasRealAddress) {
            return record;
          }
          
          try {
            const address = await reverseGeocode(
              parseFloat(record.lat),
              parseFloat(record.lng)
            );
            return { ...record, address };
          } catch (err) {
            console.error('Error geocoding:', err);
            return { 
              ...record, 
              address: `${parseFloat(record.lat).toFixed(4)}, ${parseFloat(record.lng).toFixed(4)}` 
            };
          }
        })
      );
      
      setApiRecords(recordsWithAddresses);
    } catch (err) {
      console.error('Error loading walk records:', err);
      setError('Error al cargar los registros del paseo');
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const streetAddress = data.results.find(
          result => result.types.includes('street_address') ||
                    result.types.includes('route')
        );
        
        if (streetAddress) {
          return streetAddress.formatted_address;
        }
        
        return data.results[0].formatted_address;
      }
      
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const sortedRecords = [...apiRecords].sort(
    (a, b) => new Date(b.timeFull) - new Date(a.timeFull)
  );

  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = sortedRecords.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [sortedRecords.length, totalPages]);

  if (!isTrackingVisible) {
    return (
      <div className="bg-foreground rounded-2xl shadow-md p-6 border border-border h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FiActivity size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="font-medium text-lg mb-2">Seguimiento no disponible</p>
          <p className="text-sm">{trackingStatusMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-foreground rounded-2xl shadow-md border border-border h-full flex flex-col">

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiActivity className="text-primary" size={20} />
            <h3 className="font-bold text-black">Seguimiento del paseo</h3>
          </div>
          {sortedRecords.length > 0 && (
            <span className="text-xs text-black-100 bg-gray-100 px-3 py-1 rounded-full">
              {sortedRecords.length} registro{sortedRecords.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-xs text-black">{trackingStatusMessage}</p>
      </div>

      {error && (
        <div className="flex-shrink-0 mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading && sortedRecords.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-black text-sm">Cargando registros...</p>
          </div>
        </div>
      )}

      {!loading || sortedRecords.length > 0 ? (
        <div className="flex-1 overflow-y-auto min-h-0">
          {sortedRecords.length === 0 ? (
            <div className="h-full flex items-center justify-center p-6 text-center text-black">
              <div>
                <FiMapPin size={40} className="mx-auto mb-3 text-black" />
                <p className="font-medium mb-1">No hay registros todavía</p>
                <p className="text-sm">
                  {walkStatus?.toLowerCase() === 'activo' 
                    ? 'Esperando puntos de seguimiento...'
                    : walkStatus?.toLowerCase() === 'finalizado'
                      ? 'Este paseo no registró puntos de seguimiento'
                      : 'Los registros aparecerán cuando el paseo esté activo'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {currentRecords.map((record, index) => {
                
                const realIndex = startIndex + index;
                
                return (
                  <div 
                    key={record.id || realIndex} 
                    className={`border-b pb-3 last:border-b-0 last:pb-0 border-gray-200 transition-opacity ${
                      walkStatus?.toLowerCase() === 'finalizado' ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <FiMapPin 
                          size={16} 
                          className={`${
                            walkStatus?.toLowerCase() === 'finalizado' 
                              ? 'text-black' 
                              : 'text-primary'
                          }`} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <p className="text-sm text-black font-medium">
                            {record.time}
                          </p>
                          {realIndex === 0 && walkStatus?.toLowerCase() === 'activo' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                              Actual
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-black break-words leading-relaxed">
                          {record.address}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && sortedRecords.length > 0 && (
                <div className="pt-3 text-center">
                  <div className="inline-flex items-center gap-2 text-black text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span>Actualizando...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {sortedRecords.length > 0 && (
        <div className="flex-shrink-0 p-3 border-t border-gray-200">
          <div className="flex items-center justify-between">

            <p className="text-xs text-black">
              {walkStatus?.toLowerCase() === 'finalizado' ? 'Paseo completado - ' : ''}
              Mostrando {startIndex + 1}-{Math.min(endIndex, sortedRecords.length)} de {sortedRecords.length}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs rounded border border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página anterior"
                >
                  ←
                </button>
                
                <span className="text-xs text-black px-2">
                  {currentPage} / {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs rounded border border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página siguiente"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkData;