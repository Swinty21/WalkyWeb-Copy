import { useState, useEffect } from "react";

const BannerHomeComponent = ({ announcements }) => {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [announcements.length]);

    return (
        <div className="relative h-80 mb-8 rounded-lg overflow-hidden">
            {announcements.map((announcement, index) => (
                <div
                    key={announcement.id}
                    className={`absolute w-full h-full transition-opacity duration-500 ${
                        index === activeSlide ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="text-white text-xl font-bold">{announcement.title}</h3>
                        <p className="text-white">{announcement.description}</p>
                    </div>
                </div>
            ))}
            <div className="absolute bottom-4 right-4 flex space-x-2">
                {announcements.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-2 h-2 rounded-full ${
                            index === activeSlide ? "bg-primary" : "bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerHomeComponent;