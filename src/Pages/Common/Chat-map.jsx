//la idea es 1) que este componente abarque todo el fondo gris, 2) arreglar color modo oscuro/claro
//3)que cargue el mapa; 4)poder guardar una marca en el mapa (local storage); 5) unir los puntos mediante lineas en el mapa
//ver acceso a la api de google
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import Map from "./ChatMapComponents/Map";

const ChatMap = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("records");
    return saved ? JSON.parse(saved) : [];
  }); //registros del recorrido

  const handlePointAdded = (record) => {
    setRecords((prev) => {
      const updated = [...prev, record];
      localStorage.setItem("records", JSON.stringify(updated)); //guardo punto de seguimiento
      return updated;
    });
  };

  const handleClearRecords = () => {
    setRecords([]);
    localStorage.removeItem("records");
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="mx-auto px-4 py-8 min-h-[80vh] grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Chat */}
      <div className="bg-foreground rounded-2xl shadow-md flex flex-col h-full border border-border mx-auto">
        <div className="flex-1 overflow-y-auto mb-4 p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"
                }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg text-body ${message.sender === "user"
                  ? "bg-primary text-black"
                  : "bg-muted text-foreground"
                  }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={sendMessage}
          className="flex gap-2 mb-2 px-2 border-t border-border pt-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 rounded-md border border-primary 
                       bg-foreground text-black 
                       placeholder:text-neutral 
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-md hover:bg-opacity-90 btn-neon-hover"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>

      {/* Map + registro */}
      <div className="md:col-span-2 flex flex-col gap-4 h-full">
        <div className="flex">
          <Map onPointAdded={handlePointAdded} onClear={handleClearRecords} />
        </div>
        <div className="bg-foreground rounded-2xl shadow-md p-4 border border-border text-black flex-grow overflow-y-auto">
          <h3 className="font-bold mb-2">Seguimiento del paseo</h3>
          {records.length === 0 ? (
            <p>No hay registros todavía.</p>
          ) : (
            <ul className="space-y-2 max-h-50 overflow-y-auto">
              {[...records]
              .sort((a, b) => new Date(b.timeFull) - new Date(a.timeFull))  //le doy orden descendente a los registros de paseo
              .map((r, i) => (
                <li key={i} className="border-b pb-2">
                  <p className="text-sm text-gray-700">{r.time}</p>
                  <p className="text-base">{r.address}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMap;
