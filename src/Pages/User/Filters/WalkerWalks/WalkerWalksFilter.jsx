import { FiSearch } from "react-icons/fi";

const WalkerWalksFilter = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-success text-xl" />
                <input
                    type="text"
                    placeholder="Buscar por nombre del perro o notas..."
                    className="w-full pl-12 pr-6 py-4 border-2 border-success/20 rounded-2xl focus:outline-none focus:border-success focus:ring-4 focus:ring-success/10 bg-white/80 dark:bg-foreground/80 backdrop-blur-sm text-foreground dark:text-background shadow-lg transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
};

export default WalkerWalksFilter;