import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { FaChartLine } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WalkerServiceChartComponent = ({ chartData }) => {
    const generateChartConfig = () => {
        if (!chartData || chartData.length === 0) {
            return {
                labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
                datasets: [{
                    label: "Paseos por día",
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "rgb(59, 130, 246)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            };
        }

        return {
            labels: chartData.map(item => item.day),
            datasets: [{
                label: "Paseos por día",
                data: chartData.map(item => item.walks),
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true,
                pointBackgroundColor: "rgb(59, 130, 246)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (context) => {
                        const dataIndex = context[0].dataIndex;
                        if (chartData && chartData[dataIndex]) {
                            return chartData[dataIndex].date.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            });
                        }
                        return '';
                    },
                    label: (context) => {
                        const value = context.parsed.y;
                        return `${value} paseo${value !== 1 ? 's' : ''} completado${value !== 1 ? 's' : ''}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        return Math.floor(value) === value ? value : '';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const totalWalks = chartData ? chartData.reduce((sum, day) => sum + day.walks, 0) : 0;
    const avgWalks = chartData ? (totalWalks / 7).toFixed(1) : '0.0';

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-4">
                        <FaChartLine className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-background">
                            Paseos última semana
                        </h3>
                        <p className="text-sm text-accent dark:text-muted">
                            Promedio: {avgWalks} paseos/día
                        </p>
                    </div>
                </div>
                    
                <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalWalks}
                    </p>
                    <p className="text-xs text-accent dark:text-muted">
                        Total semanal
                    </p>
                </div>
            </div>
            
            <div className="h-48 relative bg-background dark:bg-foreground rounded-lg p-4">
                <Line data={generateChartConfig()} options={chartOptions} />
            </div>
            
            {totalWalks === 0 && (
                <div className="text-center mt-4">
                    <p className="text-sm text-accent dark:text-muted">
                        No hay datos de paseos completados en los últimos 7 días
                    </p>
                </div>
            )}
        </div>
    );
};

export default WalkerServiceChartComponent;