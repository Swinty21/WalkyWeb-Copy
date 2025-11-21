import { useState, useEffect } from "react";
import FAQComponent from "./Components/TicketsComponents/FAQComponent";
import MyTicketsComponent from "./Components/TicketsComponents/MyTicketsComponent";
import CreateTicketModal from "./Modals/TicketsModals/CreateTicketModal";
import { TicketController } from "../../BackEnd/Controllers/TicketController";
import { useUser } from "../../BackEnd/Context/UserContext";
import { useToast } from '../../BackEnd/Context/ToastContext';

const Tickets = () => {
    const [activeTab, setActiveTab] = useState("faq");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [faqs, setFAQs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorState, seterrorState] = useState(null);
    const { success, error } = useToast();

    const user = useUser();
    const userId = user?.id;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                seterrorState(null);
                
                const [faqsData, ticketsData] = await Promise.all([
                    TicketController.fetchFAQs(),
                    TicketController.fetchTicketsByUser(userId)
                ]);
                
                setFAQs(faqsData);
                setTickets(ticketsData);
            } catch (err) {
                seterrorState('errorState loading data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadData();
        }
    }, [userId]);

    const handleCreateTicket = async (ticketData) => {
        try {
            const newTicket = await TicketController.createTicket({
                ...ticketData,
                userId
            });
            success('Ticket creado correctamente', {
                title: 'Éxito',
                duration: 4000
            });
            setTickets(prev => [newTicket, ...prev]);
            setIsCreateModalOpen(false);
            setActiveTab("my-tickets");
        } catch (err) {
            error('Error al crear el ticket', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    const refreshTickets = async () => {
        try {
            const ticketsData = await TicketController.fetchTicketsByUser(userId);
            setTickets(ticketsData);
        } catch (err) {
            error('Error actualizar los tickets', {
                title: 'Error',
                duration: 4000
            });
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg text-foreground dark:text-background">Cargando...</p>
                </div>
            </div>
        );
    }

    if (errorState) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-red-500">{errorState}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-6 bg-background dark:bg-foreground">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground dark:text-background">
                        Centro de Soporte
                    </h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                        Nueva Consulta
                    </button>
                </div>

                <div className="border-b border-border dark:border-muted">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("faq")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === "faq"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-accent dark:text-muted hover:text-foreground dark:hover:text-background hover:border-border"
                            }`}
                        >
                            Preguntas Frecuentes
                        </button>
                        <button
                            onClick={() => setActiveTab("my-tickets")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === "my-tickets"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-accent dark:text-muted hover:text-foreground dark:hover:text-background hover:border-border"
                            }`}
                        >
                            Mis Consultas ({tickets.length})
                        </button>
                    </nav>
                </div>
            </div>

            <div className="transition-all duration-300">
                {activeTab === "faq" ? (
                    <FAQComponent faqs={faqs} />
                ) : (
                    <MyTicketsComponent
                        tickets={tickets} 
                        onRefresh={refreshTickets}
                    />
                )}
            </div>

            <CreateTicketModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTicket}
            />
        </div>
    );
};

export default Tickets;