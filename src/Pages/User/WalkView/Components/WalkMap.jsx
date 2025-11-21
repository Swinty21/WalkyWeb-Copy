import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { FiMap, FiMapPin } from "react-icons/fi";
import { WalkTrackingController } from "../../../../BackEnd/Controllers/WalkTrackingController";

const containerStyle = {
  width: "100%", 
  height: "100%",
  minHeight: "400px",
};

const defaultCenter = {
  lat: -34.6037,
  lng: -58.3816,
};

export default function WalkMap({ tripId, walkStatus }) {
  const [path, setPath] = useState([]);
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const isMapVisible = WalkTrackingController.isMapVisible(walkStatus);
  const mapStatusMessage = WalkTrackingController.getMapStatusMessage(walkStatus);

  useEffect(() => {
    if (tripId && isMapVisible) {
      loadWalkRoute();
    } else {
      setPath([]);
      setDirections(null);
    }
  }, [tripId, isMapVisible]);

  const loadWalkRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const route = await WalkTrackingController.fetchWalkRoute(tripId);
      
      if (!route || route.length === 0) {
        setPath([]);
        return;
      }

      const normalizedPath = route
        .filter(point => point.lat && point.lng)
        .map(point => ({
          lat: parseFloat(point.lat),
          lng: parseFloat(point.lng)
        }));
      
      setPath(normalizedPath);
      
      if (normalizedPath.length >= 2) {
        setDirections(null);
      }
    } catch (err) {
      console.error('Error loading walk route:', err);
      setError('Error al cargar la ruta del paseo');
    } finally {
      setLoading(false);
    }
  };

  if (!isMapVisible) {
    return (
      <div className="w-full h-full min-h-[400px]">
        <div className="bg-gray-100 rounded-2xl shadow-md p-8 border border-gray-300 h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FiMap size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="font-medium text-lg mb-2">Mapa no disponible</p>
            <p className="text-sm">{mapStatusMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  const center = path.length > 0 ? path[0] : defaultCenter;

  return (
    <div className="w-full bg-foreground rounded-2xl shadow-md border border-border">

      <div className="p-4 border-b border-border rounded-t-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-primary" size={20} />
            <h3 className="font-bold text-black">Mapa del Paseo</h3>
          </div>
          {path.length > 0 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {path.length} punto{path.length !== 1 ? 's' : ''} registrado{path.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600">{mapStatusMessage}</p>
      </div>

      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="p-4">
        <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100" style={{ height: '400px' }}>

          {(loading || !mapLoaded) && (
            <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">Cargando mapa...</p>
              </div>
            </div>
          )}

          <LoadScript 
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
          onLoad={() => setMapLoaded(true)}
          onError={() => {
            setMapLoaded(true);
            setError('Error al cargar Google Maps');
          }}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={path.length > 0 ? 14 : 13}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              gestureHandling: 'greedy',
              styles: walkStatus?.toLowerCase() === 'finalizado' ? [
                {
                  featureType: "all",
                  elementType: "all",
                  stylers: [{ saturation: -20 }]
                }
              ] : []
            }}
          >
            
            {path.length >= 2 && !directions && (
              <DirectionsService
                options={{
                  origin: path[0],
                  destination: path[path.length - 1],
                  waypoints: path.slice(1, -1).map((p) => ({
                    location: p,
                    stopover: true,
                  })),
                  travelMode: "WALKING",
                }}
                callback={(res) => {
                  if (res !== null && res.status === "OK") {
                    setDirections(res);
                  } else {
                    console.error('Directions request failed:', res?.status);
                  }
                }}
              />
            )}

            {directions && (
              <DirectionsRenderer
                options={{
                  directions: directions,
                  polylineOptions: {
                    strokeColor: walkStatus?.toLowerCase() === 'finalizado' ? "#4476ffff" : "#10b981",
                    strokeOpacity: walkStatus?.toLowerCase() === 'finalizado' ? 0.7 : 1,
                    strokeWeight: 5,
                  },
                  markerOptions: {
                    visible: false,
                  },
                }}
              />
            )}

            {path.map((point, index) => {
              
              if (index === 0) {
                return (
                  <Marker
                    key={`marker-${index}`}
                    position={point}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }}
                    title={`Inicio del paseo`}
                  />
                );
              }
              
              if (index === path.length - 1) {
                
                if (walkStatus?.toLowerCase() === 'finalizado') {
                  return (
                    <Marker
                      key={`marker-${index}`}
                      position={point}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      }}
                      title="Fin del paseo"
                    />
                  );
                }
                
                return (
                  <Marker
                    key={`marker-${index}`}
                    position={point}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                    title="Ubicación actual"
                    animation={window.google?.maps?.Animation?.BOUNCE}
                  />
                );
              }
              
              return (
                <Marker
                  key={`marker-${index}`}
                  position={point}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                  }}
                  title={`Punto ${index + 1}`}
                />
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>

      {path.length === 0 && !loading && (
        <div className="mx-4 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-700 text-sm">
            {walkStatus?.toLowerCase() === 'activo' 
              ? 'Esperando el primer punto de seguimiento...'
              : 'No hay puntos de seguimiento registrados'}
          </p>
        </div>
      )}
      </div>
    </div>
  );
}