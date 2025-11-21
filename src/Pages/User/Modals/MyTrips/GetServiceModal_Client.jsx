import React, { useState } from "react";
import { MdClose, MdLocationOn, MdAccessTime, MdPets, MdVerified } from "react-icons/md";
import { AiOutlineStar } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

const GetServiceModal_Client = ({
    showCreateForm,
    onCloseModal,
    onSubmit,
    walkers,
    pets,
    selectedWalker,
    setSelectedWalker,
    selectedPets,
    onPetSelection,
    walkDate,
    setWalkDate,
    walkTime,
    setWalkTime,
    startAddress,
    setStartAddress,
    description,
    setDescription,
    loadingModal,
    loadingWalkers,
    loadingPets
}) => {
    const [walkerSearch, setWalkerSearch] = useState("");
    const [petSearch, setPetSearch] = useState("");
    
    const totalPrice = selectedWalker ? selectedPets.length * (selectedWalker.pricePerPet || 15000) : 0;

    const filteredWalkers = walkers.filter(walker =>
        walker.name?.toLowerCase().includes(walkerSearch.toLowerCase()) ||
        walker.specialties?.toLowerCase().includes(walkerSearch.toLowerCase())
    );

    const filteredPets = pets.filter(pet =>
        pet.name?.toLowerCase().includes(petSearch.toLowerCase())
    );

    if (!showCreateForm) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-foreground rounded-3xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl">

                <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-success/10 rounded-t-3xl flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-foreground dark:text-background">
                            Programar Nuevo Paseo
                        </h2>
                        <button
                            onClick={onCloseModal}
                            className="p-3 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <MdClose className="text-2xl text-foreground dark:text-background" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <form id="create-trip-form" onSubmit={onSubmit} className="p-6">
                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-foreground dark:text-background mb-4 flex items-center">
                                <MdLocationOn className="mr-2 text-primary" />
                                Seleccionar Paseador
                            </h4>
                            
                            <div className="mb-4">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                                    <input
                                        type="text"
                                        placeholder="Buscar paseador por nombre o especialidad..."
                                        className="w-full pl-10 pr-4 py-3 border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white dark:bg-foreground text-foreground dark:text-background transition-all duration-300"
                                        value={walkerSearch}
                                        onChange={(e) => setWalkerSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {loadingWalkers ? (
                                <p className="text-accent dark:text-muted">Cargando paseadores...</p>
                            ) : filteredWalkers.length === 0 ? (
                                <p className="text-accent dark:text-muted">
                                    {walkerSearch ? "No se encontraron paseadores que coincidan con tu búsqueda" : "No hay paseadores disponibles"}
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
                                    {filteredWalkers.map(walker => (
                                        <div
                                            key={walker.id}
                                            onClick={() => setSelectedWalker(walker)}
                                            className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                                selectedWalker?.id === walker.id
                                                    ? 'border-primary bg-primary/10 shadow-lg transform scale-105'
                                                    : 'border-primary/20 hover:border-primary/40 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={walker.image}
                                                    alt={walker.name}
                                                    className="w-16 h-16 rounded-full object-cover shadow-lg flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h5 className="font-bold text-foreground dark:text-background truncate">
                                                            {walker.name}
                                                        </h5>
                                                        {walker.verified && (
                                                            <MdVerified className="text-green-500 w-5 h-5 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <AiOutlineStar className="text-yellow-400 flex-shrink-0" />
                                                        <span className="text-sm font-semibold">{walker.rating}</span>
                                                        <span className="text-xs text-accent dark:text-muted">• {walker.experience}</span>
                                                    </div>
                                                    <p className="text-sm text-accent dark:text-muted mb-2 line-clamp-2">
                                                        {walker.specialties}
                                                    </p>
                                                    <p className="text-lg font-bold text-primary">
                                                        ${(walker.pricePerPet || 15000).toLocaleString()} / mascota
                                                    </p>
                                                </div>
                                                {selectedWalker?.id === walker.id && (
                                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                        <span className="text-white font-bold">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-foreground dark:text-background mb-4 flex items-center">
                                <MdPets className="mr-2 text-primary" />
                                Seleccionar Mascotas
                            </h4>
                            
                            <div className="mb-4">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                                    <input
                                        type="text"
                                        placeholder="Buscar mascota por nombre..."
                                        className="w-full pl-10 pr-4 py-3 border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white dark:bg-foreground text-foreground dark:text-background transition-all duration-300"
                                        value={petSearch}
                                        onChange={(e) => setPetSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {loadingPets ? (
                                <p className="text-accent dark:text-muted">Cargando mascotas...</p>
                            ) : filteredPets.length === 0 ? (
                                <p className="text-accent dark:text-muted">
                                    {petSearch ? "No se encontraron mascotas que coincidan con tu búsqueda" : "No tienes mascotas registradas"}
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto pr-2">
                                    {filteredPets.map(pet => (
                                        <div
                                            key={pet.id}
                                            onClick={() => onPetSelection(pet.id)}
                                            className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                                selectedPets.includes(pet.id)
                                                    ? 'border-primary bg-primary/10 shadow-lg transform scale-105'
                                                    : 'border-primary/20 hover:border-primary/40 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={pet.image}
                                                    alt={pet.name}
                                                    className="w-12 h-12 rounded-full object-cover shadow-lg flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-foreground dark:text-background truncate">
                                                        {pet.name}
                                                    </p>
                                                    <p className="text-sm text-accent dark:text-muted">
                                                        {pet.weight}kg • {pet.age} años
                                                    </p>
                                                </div>
                                                {selectedPets.includes(pet.id) && (
                                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                        <span className="text-white font-bold">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-foreground dark:text-background mb-4 flex items-center">
                            <MdAccessTime className="mr-2 text-primary" />
                            Fecha y Hora
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-accent dark:text-muted mb-2">
                                    Fecha del Paseo
                                </label>
                                <input
                                    type="date"
                                    value={walkDate}
                                    onChange={(e) => setWalkDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-4 border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white dark:bg-foreground text-foreground dark:text-background transition-all duration-300"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-accent dark:text-muted mb-2">
                                    Hora del Paseo
                                </label>
                                <input
                                    type="time"
                                    value={walkTime}
                                    onChange={(e) => setWalkTime(e.target.value)}
                                    className="w-full p-4 border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white dark:bg-foreground text-foreground dark:text-background transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-foreground dark:text-background mb-4 flex items-center">
                            <MdLocationOn className="mr-2 text-primary" />
                            Dirección de Inicio
                        </h4>
                        <div>
                            <label className="block text-sm font-semibold text-accent dark:text-muted mb-2">
                                Dirección completa donde iniciará el paseo
                            </label>
                            <input
                                type="text"
                                value={startAddress}
                                onChange={(e) => setStartAddress(e.target.value)}
                                placeholder="Ej: Av. Santa Fe 1234, Palermo, Buenos Aires"
                                className="w-full p-4 border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white dark:bg-foreground text-foreground dark:text-background transition-all duration-300"
                                required
                            />
                            <p className="text-xs text-accent dark:text-muted mt-2">
                                Proporciona la dirección exacta donde el paseador recogerá a tu(s) mascota(s)
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-accent dark:text-muted mb-2">
                            Instrucciones Especiales (opcional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Instrucciones especiales, preferencias del paseo, alergias, comportamiento..."
                            className="w-full p-4 border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white dark:bg-foreground text-foreground dark:text-background resize-none transition-all duration-300"
                            rows="4"
                        />
                    </div>

                    {selectedWalker && selectedPets.length > 0 && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl border-2 border-primary/20">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground dark:text-background font-semibold">
                                        {selectedPets.length} mascota{selectedPets.length > 1 ? 's' : ''} × ${(selectedWalker.pricePerPet || 15000).toLocaleString()}
                                    </span>
                                    <span className="font-bold text-foreground dark:text-background">
                                        ${totalPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="border-t-2 border-primary/20 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-foreground dark:text-background">
                                            Total a Pagar
                                        </span>
                                        <span className="text-2xl font-bold text-primary">
                                            ${totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onCloseModal}
                            className="flex-1 py-4 px-6 border-2 border-primary/20 text-accent dark:text-muted rounded-xl hover:bg-primary/10 transition-all duration-300 font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loadingModal || !selectedWalker || selectedPets.length === 0 || !walkDate || !walkTime || !startAddress}
                            className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-success text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loadingModal ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Programando...
                                </div>
                            ) : (
                                `Programar Paseo • $${totalPrice.toLocaleString()}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default GetServiceModal_Client;