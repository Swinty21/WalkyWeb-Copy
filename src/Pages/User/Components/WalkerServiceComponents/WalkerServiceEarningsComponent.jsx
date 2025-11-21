import { FaCoins, FaChartLine, FaDollarSign } from "react-icons/fa";

const WalkerServiceEarningsComponent = ({ earnings }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateAveragePerWalk = () => {
        if (!earnings || !earnings.completedWalks || earnings.completedWalks === 0) {
            return 0;
        }
        return earnings.total / earnings.completedWalks;
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mr-4">
                    <FaCoins className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-background">
                    Ganancias
                </h3>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:shadow-md transition-all duration-300">
                    <div>
                        <span className="text-sm font-medium text-accent dark:text-muted">
                            Ganancia mensual
                        </span>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {earnings ? formatCurrency(earnings.monthly) : formatCurrency(0)}
                        </p>
                        <span className="text-xs text-accent dark:text-muted">
                            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="text-green-500">
                        <FaChartLine className="text-2xl" />
                    </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:shadow-md transition-all duration-300">
                    <div>
                        <span className="text-sm font-medium text-accent dark:text-muted">
                            Ganancia total
                        </span>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {earnings ? formatCurrency(earnings.total) : formatCurrency(0)}
                        </p>
                        <span className="text-xs text-accent dark:text-muted">
                            {earnings ? `${earnings.completedWalks} paseos completados` : '0 paseos completados'}
                        </span>
                    </div>
                    <div className="text-blue-500">
                        <FaDollarSign className="text-2xl" />
                    </div>
                </div>
                
                {earnings && earnings.completedWalks > 0 && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-accent dark:text-muted">
                                Promedio por paseo
                            </span>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {formatCurrency(calculateAveragePerWalk())}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalkerServiceEarningsComponent;