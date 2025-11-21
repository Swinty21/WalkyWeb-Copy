import React, { useEffect, useRef, useState } from "react";
import { FiSend, FiMessageCircle } from "react-icons/fi";
import { ChatController } from "../../../../BackEnd/Controllers/ChatController";
import { useUser } from "../../../../BackEnd/Context/UserContext";

const WalkChat = ({ tripId, walkStatus }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const user = useUser();
    const userId = user?.id;
    const userName = user?.name || "Usuario";
    const userType = user?.type || "owner";

    const isChatVisible = ChatController.isChatVisible(walkStatus);
    const canSendMessages = ChatController.canSendMessages(walkStatus);
    const chatStatusMessage = ChatController.getChatStatusMessage(walkStatus);

    const isCurrentUserMessage = (message) => {
        return message.sender === userType;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        let interval;
        
        const start = async () => {
            if (tripId && userId) {
                await loadMessages();
                interval = setInterval(() => {
                    loadMessages();
                }, 30000); // Polling cada 30 segundos
            }
        };
        
        start();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [tripId, userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const chatMessages = await ChatController.fetchChatMessages(tripId);
            setMessages(chatMessages || []);

            if ((chatMessages || []).length > 0) {
                await ChatController.markMessagesAsRead(tripId, userId);
            }
        } catch (err) {
            console.error("Error loading messages:", err);
            setError("Error al cargar mensajes");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !tripId || !userId || !canSendMessages) return;

        const messageToSend = newMessage.trim();
        setNewMessage(""); // Limpiar inmediatamente para mejor UX

        try {
            setSendingMessage(true);
            setError(null);

            const sentMessage = await ChatController.sendMessage(
                tripId,
                userId,
                userType,
                userName,
                messageToSend
            );

            setMessages((prev) => [...prev, sentMessage]);
            scrollToBottom();
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Error al enviar mensaje");
            setNewMessage(messageToSend); // Restaurar el mensaje si falla
        } finally {
            setSendingMessage(false);
        }
    };

    // Estado de carga inicial
    if (loading && messages.length === 0) {
        return (
            <div className="bg-foreground rounded-2xl shadow-md border border-border h-full flex flex-col">
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <FiMessageCircle className="text-primary" size={20} />
                        <h3 className="font-semibold text-black">Chat del Paseo</h3>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                        <span className="text-gray-600">Cargando chat...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-foreground rounded-2xl shadow-md border border-border h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-3 md:p-4 border-b border-border rounded-t-2xl">
                <div className="flex items-center gap-2 mb-1">
                    <FiMessageCircle className="text-primary" size={20} />
                    <h3 className="font-semibold text-black">Chat del Paseo</h3>
                </div>
                <p className="text-xs text-gray-600">Estado: {chatStatusMessage}</p>
                {error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                        {error}
                    </div>
                )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 min-h-0">
                {!isChatVisible ? (
                    <div className="h-full flex items-center justify-center text-center text-gray-500 p-4">
                        <div>
                            <FiMessageCircle size={48} className="mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">Chat no disponible</p>
                            <p className="text-sm mt-1">{chatStatusMessage}</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-gray-500 p-4">
                        <div>
                            <FiMessageCircle size={48} className="mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">No hay mensajes aún</p>
                            <p className="text-sm mt-1">
                                {walkStatus === "Finalizado" 
                                    ? "El paseo ha finalizado" 
                                    : "¡Inicia la conversación!"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => {
                            const isCurrentUser = isCurrentUserMessage(message);
                            return (
                                <div
                                    key={message.id || index}
                                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                                >
                                    <div
                                        className={`max-w-[80%] md:max-w-[75%] rounded-lg p-3 shadow-sm transition-all ${
                                            isCurrentUser
                                                ? "bg-primary text-black rounded-br-sm"
                                                : "bg-black text-white rounded-bl-sm border border-gray-700"
                                        }`}
                                    >
                                        {!isCurrentUser && (
                                            <p className="text-xs font-medium text-gray-400 mb-1">
                                                {message.senderName}
                                            </p>
                                        )}
                                        <p className="break-words text-sm leading-relaxed">
                                            {message.text}
                                        </p>
                                        <p className={`text-xs mt-1 text-right ${
                                            isCurrentUser ? "text-gray-700" : "text-gray-400"
                                        }`}>
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Footer */}
            <form
                onSubmit={sendMessage}
                className={`flex-shrink-0 p-3 md:p-4 border-t border-border transition-opacity ${
                    !canSendMessages ? "opacity-50" : ""
                }`}
            >
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                            walkStatus === "Finalizado"
                                ? "Paseo finalizado"
                                : canSendMessages
                                ? "Escribe un mensaje..."
                                : "Chat no disponible"
                        }
                        disabled={sendingMessage || !canSendMessages}
                        className="flex-1 h-10 px-4 rounded-full border border-gray-300 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={sendingMessage || !newMessage.trim() || !canSendMessages}
                        className="w-10 h-10 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg active:scale-95"
                    >
                        {sendingMessage ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                            <FiSend size={16} />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WalkChat;