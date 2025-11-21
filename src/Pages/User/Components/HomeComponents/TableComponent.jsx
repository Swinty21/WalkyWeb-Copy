import { format } from "date-fns";
import { useNavigation } from "../../../../BackEnd/Context/NavigationContext";
import { FiEye, FiXCircle, FiCreditCard } from "react-icons/fi";

const TableComponent = ({ trips, onCancelTrip, onPayTrip }) => {
    const { navigateToContent } = useNavigation();

    const handleViewTrip = (tripId) => {
        navigateToContent('trip', { tripId });
    };

    const handleMyTrips = () => {
        navigateToContent('my-walks');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Solicitado":
                return "bg-blue-500/70 text-white";
            case "Esperando pago":
                return "bg-orange-500/70 text-white";
            case "Agendado":
                return "bg-yellow-500/70 text-black";
            case "Activo":
                return "bg-green-500/70 text-white";
            case "Finalizado":
                return "bg-gray-500/70 text-white";
            case "Rechazado":
                return "bg-red-500/70 text-white";
            default:
                return "bg-neutral/70 text-black";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Solicitado":
                return "Solicitado";
            case "Esperando pago":
                return "Esperando Pago";
            case "Agendado":
                return "Agendado";
            case "Activo":
                return "En Progreso";
            case "Finalizado":
                return "Finalizado";
            case "Rechazado":
                return "Rechazado";
            default:
                return status;
        }
    };

    const canCancel = (status) => {
        return ["Solicitado", "Esperando pago"].includes(status);
    };

    const needsPayment = (status) => {
        return status === "Esperando pago";
    };

    const canView = (status) => {
        return ["Agendado", "Activo", "Finalizado"].includes(status);
    };

    return (
        <div>
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground dark:text-background">
                    Mis paseos activos
                    <span className="text-lg font-normal text-accent dark:text-muted ml-2">
                        (limitado a 5)
                    </span>
                </h2>
                <button 
                    onClick={handleMyTrips}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 btn-hover"
                >
                    Ver todos
                </button>
            </div>

            <div className="bg-background dark:bg-foreground rounded-xl shadow-xl overflow-hidden border border-border dark:border-muted">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-foreground2">
                            <tr>
                                {["Trip ID", "Dog Name", "Walker", "Start Time", "Status", "Actions"].map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 text-left font-semibold text-white uppercase tracking-wider text-xs"
                                >
                                    {col}
                                </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        {trips.map((trip, index) => (
                            <tr
                                key={trip.id}
                                className={`transition-colors duration-200 bg-background dark:bg-foreground hover:bg-muted/30 dark:hover:bg-accent/30`}
                            >

                            <td className="px-6 py-4 font-medium text-foreground dark:text-background">
                                {trip.id}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-primary font-bold">{trip.dogName[0]}</span>
                                    </div>
                                    <span className="font-medium text-foreground dark:text-background">
                                        {trip.dogName}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-foreground dark:text-background">
                                {trip.walker}
                            </td>

                            <td className="px-6 py-4 text-foreground dark:text-background">
                                {format(new Date(trip.startTime), "MMM d, yyyy h:mm a")}
                            </td>

                            <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                                    {getStatusText(trip.status)}
                                </span>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                    {canView(trip.status) && (
                                        <button
                                            onClick={() => handleViewTrip(trip.id)}
                                            className="flex items-center px-3 py-1 text-xs rounded-lg border border-info text-info hover:bg-info hover:text-white transition-colors duration-200"
                                            title="Ver detalles del paseo"
                                        >
                                            <FiEye className="mr-1" size={12} />
                                            Ver
                                        </button>
                                    )}
                                    
                                    {needsPayment(trip.status) && onPayTrip && (
                                        <button
                                            onClick={() => onPayTrip(trip)}
                                            className="flex items-center px-3 py-1 text-xs rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors duration-200"
                                            title={`Pagar $${trip.totalPrice?.toLocaleString() || 0}`}
                                        >
                                            <FiCreditCard className="mr-1" size={12} />
                                            Pagar
                                        </button>
                                    )}
                                    
                                    {canCancel(trip.status) && onCancelTrip && (
                                        <button
                                            onClick={() => onCancelTrip(trip)}
                                            className="flex items-center px-3 py-1 text-xs rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors duration-200"
                                            title="Cancelar paseo"
                                        >
                                            <FiXCircle className="mr-1" size={12} />
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;