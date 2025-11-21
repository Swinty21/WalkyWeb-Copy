import { format, isValid, parseISO } from "date-fns";

const PersonalDetailsComponent = ({ userData }) => {

    const formatDate = (dateString) => {
        try {
            if (!dateString) return "No disponible";
            
            let date;
            if (typeof dateString === 'string') {
                date = parseISO(dateString);
            } else {
                date = new Date(dateString);
            }
            
            if (isValid(date)) {
                return format(date, "MMMM dd, yyyy");
            } else {
                return "Fecha inválida";
            }
        } catch (error) {
            return "Fecha inválida";
        }
    };

    return (
        <div className="bg-foreground-userProfile p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-heading mb-4 text-background">Información Personal</h2>
            <div className="grid grid-cols-5 gap-4">
                <div>
                    <p className="text-accent dark:text-muted">Nombre</p>
                    <p className="font-semibold text-background">{userData.name || "No disponible"}</p>
                </div>
                <div>
                    <p className="text-accent dark:text-muted">Email</p>
                    <p className="font-semibold text-background">{userData.email || "No disponible"}</p>
                </div>
                <div>
                    <p className="text-accent dark:text-muted">Teléfono</p>
                    <p className="font-semibold text-background">{userData.contact || "No disponible"}</p>
                </div>
                <div>
                    <p className="text-accent dark:text-muted">Localidad</p>
                    <p className="font-semibold text-background">{userData.location || "No disponible"}</p>
                </div>
                <div>
                    <p className="text-accent dark:text-muted">Fecha de Ingreso</p>
                    <p className="font-semibold text-background">
                        {formatDate(userData.joinedDate)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsComponent;