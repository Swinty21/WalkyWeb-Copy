import { FiPlus, FiCheck, FiX, FiDollarSign, FiLock } from "react-icons/fi";
import PlanCard from "./PlanCard";

const AdminPlansSection = ({ 
        plans, 
        onCreatePlan, 
        onEditPlan, 
        onDeletePlan, 
        onToggleStatus, 
        loading 
    }) => {
        const freePlan = plans.find(plan => plan.plan_id === "free");
        const activePlans = plans.filter(plan => plan.is_active && plan.plan_id !== "free");
        const inactivePlans = plans.filter(plan => !plan.is_active && plan.plan_id !== "free");

    return (
        <div className="space-y-8">
            
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground dark:text-background">
                        Gestión de Planes
                    </h2>
                    <p className="text-accent dark:text-muted mt-1">
                        Administra los planes de suscripción disponibles para los usuarios
                    </p>
                </div>
                <button
                    onClick={onCreatePlan}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
                >
                    <FiPlus size={16} />
                    Crear Plan
                </button>
            </div>

            {freePlan && (
                <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-info/20">
                    <div className="flex items-center gap-2 mb-4">
                        <FiLock className="text-info" size={20} />
                        <h3 className="text-xl font-semibold text-foreground dark:text-background">
                            Plan Gratuito (Sistema)
                        </h3>
                        <span className="px-2 py-1 bg-info/10 text-info rounded-full text-xs font-medium">
                            No modificable
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <PlanCard
                            plan={freePlan}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onToggleStatus={() => {}}
                            loading={false}
                            isActive={true}
                            isEditable={false}
                        />
                    </div>
                </div>
            )}

            {activePlans.length > 0 && (
                <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-success/20">
                    <div className="flex items-center gap-2 mb-4">
                        <FiCheck className="text-success" size={20} />
                        <h3 className="text-xl font-semibold text-foreground dark:text-background">
                            Planes Activos ({activePlans.length}/3)
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activePlans.map((plan) => (
                            <PlanCard
                                key={plan.id || plan.plan_id}
                                plan={plan}
                                onEdit={onEditPlan}
                                onDelete={onDeletePlan}
                                onToggleStatus={onToggleStatus}
                                loading={loading}
                                isActive={true}
                                isEditable={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {inactivePlans.length > 0 && (
                <div className="bg-white/80 dark:bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-4">
                        <FiX className="text-accent" size={20} />
                        <h3 className="text-xl font-semibold text-foreground dark:text-background">
                            Planes Inactivos ({inactivePlans.length})
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inactivePlans.map((plan) => (
                            <PlanCard
                                key={plan.id || plan.plan_id}
                                plan={plan}
                                onEdit={onEditPlan}
                                onDelete={onDeletePlan}
                                onToggleStatus={onToggleStatus}
                                loading={loading}
                                isActive={false}
                                isEditable={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {plans.filter(p => p.plan_id !== "free").length === 0 && (
                <div className="text-center py-16">
                    <div className="bg-white/50 dark:bg-foreground/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiDollarSign className="text-4xl text-primary" />
                        </div>
                        <p className="text-xl font-semibold text-foreground dark:text-background mb-2">
                            No hay planes personalizados
                        </p>
                        <p className="text-accent dark:text-muted mb-4">
                            Crea planes de suscripción personalizados para tus usuarios
                        </p>
                        <button
                            onClick={onCreatePlan}
                            disabled={loading}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
                        >
                            Crear Primer Plan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlansSection;