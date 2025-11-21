import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -34.6037, // Buenos Aires
  lng: -58.3816,
};

export default function Map({ onPointAdded, onClear }) {
  const [path, setPath] = useState(() => {
    const saved = localStorage.getItem("ruta");
    return saved ? JSON.parse(saved) : [];
  });

  const [directions, setDirections] = useState(null);

  const handleClick = (event) => {
    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    const newPath = [...path, newPoint];
    setPath(newPath);
    setDirections(null); // reset al agregar un punto
    localStorage.setItem("ruta", JSON.stringify(newPath));
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newPoint }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        const record = {
          time: new Date().toLocaleTimeString(),
          timeFull: new Date().toISOString(),
          address,
          lat: newPoint.lat,
          lng: newPoint.lng,
        };
        onPointAdded?.(record); //ejecuta callback si existe
      }
    });
  };

  const clearPath = () => {
    setPath([]);
    setDirections(null);
    localStorage.removeItem("ruta");
    onClear?.(); //limpia lista de registros del paseo en chat map
  };



  // si tengo puntos guardados, centrar en el primero
  const center = path.length > 0 ? path[0] : defaultCenter;

  return (
    <div className="w-full">
      {/* Botón para limpiar */}
      <div className="mb-2">
        <button
          onClick={clearPath}
          className="bg-danger text-black px-3 py-1 rounded-md hover:bg-foreground"
        >
          Borrar Ruta
        </button>
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={handleClick}
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
                }
              }}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                polylineOptions: {
                  strokeColor: "#4ade80",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {/* Marcador de inicio */}
          {path.length > 0 && (
            <Marker
              position={path[0]}
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          )}

          {/*Marcador de destino
          {path.length > 1 && (
            <Marker
              position={path[path.length - 1]}
              label={{text: "Destino",color: "#ffffff",fontWeight: "bold",}}
              icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            />
          )}*/}

        </GoogleMap>
      </LoadScript>
    </div>
  );
}
