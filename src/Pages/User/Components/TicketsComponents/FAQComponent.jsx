import { useState } from "react";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQComponent = ({ faqs }) => {
    const [openFAQ, setOpenFAQ] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-background dark:bg-foreground rounded-xl shadow-lg p-6 border border-border dark:border-muted">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-background mb-2">
                        Buscar en preguntas frecuentes
                    </h3>
                    <input
                        type="text"
                        placeholder="Escriba su pregunta aquí..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-foreground text-foreground dark:text-background"
                    />
                </div>
            </div>

            <div className="bg-background dark:bg-foreground rounded-xl shadow-lg border border-border dark:border-muted overflow-hidden">
                <div className="p-6 border-b border-border dark:border-muted">
                    <h2 className="text-2xl font-bold text-foreground dark:text-background flex items-center gap-2">
                        <FaQuestionCircle className="text-primary" />
                        Preguntas Frecuentes
                    </h2>
                    {searchTerm && (
                        <p className="text-accent dark:text-muted mt-2">
                            Mostrando {filteredFAQs.length} resultado(s) para "{searchTerm}"
                        </p>
                    )}
                </div>

                <div className="divide-y divide-border dark:divide-muted">
                    {filteredFAQs.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-6xl text-accent dark:text-muted mb-4">
                                🔍
                            </div>
                            <h3 className="text-xl font-semibold text-foreground dark:text-background mb-2">
                                No se encontraron resultados
                            </h3>
                            <p className="text-accent dark:text-muted">
                                {searchTerm 
                                    ? `No encontramos preguntas que coincidan con "${searchTerm}"`
                                    : "No hay preguntas frecuentes disponibles"
                                }
                            </p>
                        </div>
                    ) : (
                        filteredFAQs.map((faq, index) => (
                            <div key={faq.id || index} className="transition-colors duration-200">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full p-6 text-left hover:bg-muted/30 dark:hover:bg-accent/30 focus:outline-none focus:bg-muted/30 dark:focus:bg-accent/30 transition-colors duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-foreground dark:text-background flex items-center gap-3 pr-4">
                                            <FaQuestionCircle className="text-primary text-sm flex-shrink-0" />
                                            <span className="flex-1">{faq.question}</span>
                                        </h3>
                                        <div className="flex-shrink-0 ml-2">
                                            {openFAQ === index ? (
                                                <FaChevronUp className="text-primary" />
                                            ) : (
                                                <FaChevronDown className="text-accent dark:text-muted" />
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {openFAQ === index && (
                                    <div className="px-6 pb-6 mt-5">
                                        <div className="ml-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border-l-4 border-primary">
                                            <p className="text-foreground dark:text-background leading-relaxed">
                                                {faq.answer}
                                            </p>
                                            {faq.category && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs text-accent dark:text-muted">
                                                        Categoría:
                                                    </span>
                                                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                                        {faq.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-start gap-4">
                    <div className="text-2xl">💡</div>
                    <div>
                        <h3 className="font-semibold text-foreground dark:text-background mb-2">
                            ¿No encuentras lo que buscas?
                        </h3>
                        <p className="text-accent dark:text-muted mb-3">
                            Si no pudiste resolver tu consulta con nuestras preguntas frecuentes, 
                            no dudes en crear un ticket de soporte personalizado.
                        </p>
                        <p className="text-sm text-accent dark:text-muted">
                            Nuestro equipo de soporte responde en un promedio de 24-48 horas hábiles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQComponent;