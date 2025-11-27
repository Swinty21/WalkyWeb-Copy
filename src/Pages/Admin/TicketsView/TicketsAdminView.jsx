import { useState, useEffect } from "react";
import { TicketController } from '../../../BackEnd/Controllers/TicketController';
import { useToast } from '../../../BackEnd/Context/ToastContext';

import AdminTicketsHeaderComponent from '../Components/TicketsAdminComponents/AdminTicketsHeaderComponent';
import AdminPendingTicketsTable from '../Components/TicketsAdminComponents/AdminPendingTicketsTable';
import AdminResolvedTicketsTable from '../Components/TicketsAdminComponents/AdminResolvedTicketsTable';
import AdminTicketResponseModal from '../Components/TicketsAdminComponents/AdminTicketResponseModal';
import AdminTicketsFilter from '../Filters/TicketsAdminFilter/AdminTicketsFilter.jsx';

const TicketsAdminView = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [responseLoading, setResponseLoading] = useState(false);

    const { success, warning } = useToast();

    useEffect(() => {
        loadAllTickets();
    }, []);

    const loadAllTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const allTickets = await TicketController.fetchAllTickets();
            setTickets(allTickets);
        } catch (err) {
            setError('Error al cargar los tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleRespondToTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsResponseModalOpen(true);
    };

    const handleTicketResponse = async (ticketId, responseData) => {
        try {
            setResponseLoading(true);
            
            // Validar datos antes de enviar
            const validation = TicketController.validateResponseData(responseData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Usar el backend para responder al ticket
            const result = await TicketController.respondToTicket(ticketId, responseData);
            
            setTickets(prevTickets => 
                prevTickets.map(ticket => 
                    ticket.id === ticketId 
                        ? {
                            ...ticket,
                            status: responseData.status,
                            response: {
                                agentName: responseData.agentName,
                                date: new Date().toISOString(),
                                content: responseData.content
                            },
                            updatedAt: new Date().toISOString(),
                            cancellationReason: responseData.status === "Cancelada" ? responseData.content : undefined
                        }
                        : ticket
                )
            );
            
            success('Respuesta al ticket enviada con éxito.', {
                title: 'Éxito',
                duration: 4000
            });
            
            setIsResponseModalOpen(false);
            setSelectedTicket(null);
            
            await loadAllTickets();
            
        } catch (error) {
            warning('No se pudo enviar la respuesta al ticket.', {
                title: 'Error',
                duration: 4000
            });
        } finally {
            setResponseLoading(false);
        }
    };

    const handleRefresh = () => {
        loadAllTickets();
    };

    const filteredPendingTickets = tickets.filter((ticket) => {
        const isPending = ticket.status === "En Espera";
        const matchesSearch = ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.id?.toString().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
        const matchesDate = !dateFilter || ticket.createdAt?.includes(dateFilter);

        return isPending && matchesSearch && matchesCategory && matchesDate;
    });

    const filteredResolvedTickets = tickets.filter((ticket) => {
        const isResolved = ticket.status !== "En Espera";
        const matchesSearch = ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.id?.toString().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
        const matchesDate = !dateFilter || ticket.createdAt?.includes(dateFilter);

        return isResolved && matchesSearch && matchesCategory && matchesDate;
    });

    const pendingTicketsCount = tickets.filter(ticket => ticket.status === "En Espera").length;
    const resolvedTicketsCount = tickets.filter(ticket => ticket.status !== "En Espera").length;

    if (loading) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-lg text-foreground dark:text-background ml-4">Cargando tickets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full p-6 bg-background dark:bg-foreground">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <p className="text-lg text-danger mb-4">{error}</p>
                        <button 
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-background dark:bg-foreground">
            <div className="max-w-full mx-auto">
                <AdminTicketsHeaderComponent 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onRefresh={handleRefresh}
                    pendingTicketsCount={pendingTicketsCount}
                    resolvedTicketsCount={resolvedTicketsCount}
                    totalTickets={tickets.length}
                />

                <AdminTicketsFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                />

                {activeTab === "pending" && (
                    <AdminPendingTicketsTable 
                        tickets={filteredPendingTickets}
                        onRespondToTicket={handleRespondToTicket}
                        searchQuery={searchQuery}
                    />
                )}

                {activeTab === "resolved" && (
                    <AdminResolvedTicketsTable 
                        tickets={filteredResolvedTickets}
                        searchQuery={searchQuery}
                    />
                )}

                <AdminTicketResponseModal
                    isOpen={isResponseModalOpen}
                    onClose={() => {
                        if (!responseLoading) {
                            setIsResponseModalOpen(false);
                            setSelectedTicket(null);
                            setError(null);
                        }
                    }}
                    ticket={selectedTicket}
                    onSubmitResponse={handleTicketResponse}
                    loading={responseLoading}
                />
            </div>
        </div>
    );
};

export default TicketsAdminView;