import { MdClose } from "react-icons/md";
import { FiCalendar, FiMapPin, FiClock, FiDollarSign, FiUser, FiFileText } from "react-icons/fi";
import { format } from "date-fns";

const ReceiptModal = ({ isOpen, onClose, receipt, loading }) => {
    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-background dark:bg-foreground rounded-2xl p-8 max-w-2xl w-full">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <span className="ml-4 text-foreground dark:text-background">Cargando recibo...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!receipt) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-background dark:bg-foreground rounded-2xl p-8 max-w-2xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-foreground dark:text-background">
                            Recibo del Paseo
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <MdClose className="text-2xl text-foreground dark:text-background" />
                        </button>
                    </div>
                    <p className="text-accent dark:text-muted text-center">
                        No se pudo cargar el recibo
                    </p>
                </div>
            </div>
        );
    }

    const getCreatedAtDate = () => {
        if (!receipt.createdAt) return null;
        if (typeof receipt.createdAt === 'object') {
            return receipt.createdAt.payment || receipt.createdAt.walk;
        }
        return receipt.createdAt;
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-foreground rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                
                <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                                <FiFileText className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground dark:text-background">
                                    Recibo del Paseo
                                </h2>
                                <p className="text-sm text-accent dark:text-muted">
                                    ID de Pago: {receipt.paymentId}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <MdClose className="text-2xl text-foreground dark:text-background" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    
                    <div className="bg-primary/10 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-foreground dark:text-background mb-3 flex items-center">
                            <FiDollarSign className="mr-2 text-primary" />
                            Información de Pago
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-accent dark:text-muted">Monto Pagado</p>
                                <p className="text-lg font-bold text-primary">
                                    ${parseFloat(receipt.amountPaid || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-accent dark:text-muted">Método de Pago</p>
                                <p className="text-sm font-semibold text-foreground dark:text-background">
                                    {receipt.paymentMethod || 'No especificado'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-accent dark:text-muted">Fecha de Pago</p>
                                <p className="text-sm font-semibold text-foreground dark:text-background">
                                    {receipt.paymentDate ? format(new Date(receipt.paymentDate), "dd/MM/yyyy HH:mm") : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-accent dark:text-muted">Estado</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    receipt.paymentStatus === 'completed' 
                                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                                        : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                                }`}>
                                    {receipt.paymentStatus === 'completed' ? 'Completado' : receipt.paymentStatus || 'Pendiente'}
                                </span>
                            </div>
                        </div>
                        {receipt.transactionId && (
                            <div className="mt-3 pt-3 border-t border-primary/20">
                                <p className="text-xs text-accent dark:text-muted">ID de Transacción</p>
                                <p className="text-sm font-mono text-foreground dark:text-background">
                                    {receipt.transactionId}
                                </p>
                            </div>
                        )}
                    </div>

                    {receipt.walk && (
                        <div className="bg-purple-100 dark:bg-purple-900/20 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-foreground dark:text-background mb-3">
                                Detalles del Paseo
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FiCalendar className="mr-3 text-purple-600 dark:text-purple-400" />
                                    <div>
                                        <p className="text-xs text-accent dark:text-muted">Fecha Programada</p>
                                        <p className="text-sm font-semibold text-foreground dark:text-background">
                                            {receipt.walk.scheduledStartTime 
                                                ? format(new Date(receipt.walk.scheduledStartTime), "dd/MM/yyyy HH:mm")
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {receipt.walk.startAddress && (
                                    <div className="flex items-start">
                                        <FiMapPin className="mr-3 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-accent dark:text-muted">Dirección de Inicio</p>
                                            <p className="text-sm font-semibold text-foreground dark:text-background">
                                                {receipt.walk.startAddress}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {receipt.walk.duration && (
                                    <div className="flex items-center">
                                        <FiClock className="mr-3 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <p className="text-xs text-accent dark:text-muted">Duración</p>
                                            <p className="text-sm font-semibold text-foreground dark:text-background">
                                                {receipt.walk.duration} minutos
                                                {receipt.walk.distance && ` • ${receipt.walk.distance >= 1000 
                                                    ? `${(receipt.walk.distance / 1000).toFixed(1)} km` 
                                                    : `${receipt.walk.distance} m`}`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-3 border-t border-purple-200 dark:border-purple-800">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-accent dark:text-muted">Precio Base</p>
                                            <p className="text-sm font-semibold text-foreground dark:text-background">
                                                ${parseFloat(receipt.walk.walkPrice || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-accent dark:text-muted">Estado del Paseo</p>
                                            <p className="text-sm font-semibold text-foreground dark:text-background">
                                                {receipt.walk.status || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {receipt.walker && (
                            <div className="bg-success/10 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-foreground dark:text-background mb-2 flex items-center">
                                    <FiUser className="mr-2 text-success" />
                                    Paseador
                                </h4>
                                <p className="text-base font-bold text-foreground dark:text-background">
                                    {receipt.walker.name || 'N/A'}
                                </p>
                                {receipt.walker.email && (
                                    <p className="text-xs text-accent dark:text-muted mt-1">
                                        {receipt.walker.email}
                                    </p>
                                )}
                            </div>
                        )}

                        {receipt.owner && (
                            <div className="bg-info/10 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-foreground dark:text-background mb-2 flex items-center">
                                    <FiUser className="mr-2 text-info" />
                                    Dueño
                                </h4>
                                <p className="text-base font-bold text-foreground dark:text-background">
                                    {receipt.owner.name || 'N/A'}
                                </p>
                                {receipt.owner.email && (
                                    <p className="text-xs text-accent dark:text-muted mt-1">
                                        {receipt.owner.email}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {receipt.pets && (
                        <div className="bg-accent/10 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-foreground dark:text-background mb-3">
                                Mascotas
                            </h4>
                            {receipt.pets.names ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">
                                            {receipt.pets.names[0] || 'P'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground dark:text-background">
                                            {receipt.pets.names}
                                        </p>
                                    </div>
                                </div>
                            ) : Array.isArray(receipt.pets) && receipt.pets.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {receipt.pets.map((pet, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                                <span className="text-primary font-bold text-sm">
                                                    {pet.name?.[0] || 'P'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground dark:text-background">
                                                    {pet.name}
                                                </p>
                                                <p className="text-xs text-accent dark:text-muted">
                                                    {pet.breed}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    )}

                    {receipt.paymentNotes && (
                        <div className="bg-muted/10 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-foreground dark:text-background mb-2">
                                Notas
                            </h4>
                            <p className="text-sm text-accent dark:text-muted italic">
                                "{receipt.paymentNotes}"
                            </p>
                        </div>
                    )}

                    <div className="text-center text-xs text-accent dark:text-muted pt-4 border-t border-border">
                        <p>Recibo generado el {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
                        {getCreatedAtDate() && (
                            <p className="mt-1">
                                Pago registrado el {format(new Date(getCreatedAtDate()), "dd/MM/yyyy HH:mm")}
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-primary/20">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;