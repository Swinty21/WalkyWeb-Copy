import { FaMapMarkerAlt, FaLocationArrow, FaDollarSign, FaPercent, FaCreditCard, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const WalkerServiceSettingsComponent = ({ 
    settings, 
    onSettingsChange, 
    onSave, 
    onSaveMercadoPago,
    isSaving 
}) => {
    const [showAccessToken, setShowAccessToken] = useState(false);
    const [savingMercadoPago, setSavingMercadoPago] = useState(false);

    const handleLocationChange = (e) => {
        onSettingsChange({ location: e.target.value });
    };

    const handlePriceChange = (e) => {
        onSettingsChange({ pricePerPet: Number(e.target.value) });
    };

    const handleDiscountToggle = () => {
        const newDiscountState = !settings.hasDiscount;
        onSettingsChange({ 
            hasDiscount: newDiscountState,
            discountPercentage: newDiscountState ? settings.discountPercentage : 0
        });
    };

    const handleDiscountPercentageChange = (e) => {
        const value = Number(e.target.value);
        if (value >= 0 && value <= 100) {
            onSettingsChange({ discountPercentage: value });
        }
    };

    const handleMercadoPagoToggle = () => {
        onSettingsChange({ hasMercadoPago: !settings?.hasMercadoPago });
    };

    const handletokenMercadoPagoChange = (e) => {
        onSettingsChange({ tokenMercadoPago: e.target.value });
    };

    const handleMercadoPagoSandboxToggle = () => {
        onSettingsChange({ mercadoPagoSandbox: !settings?.mercadoPagoSandbox });
    };

    const isMercadoPagoConfigured = () => {
        return settings.tokenMercadoPago;
    };

    const handleSaveMercadoPago = async () => {
        setSavingMercadoPago(true);
        try {
            await onSaveMercadoPago();
        } finally {
            setSavingMercadoPago(false);
        }
    };

    return (
        <div>
            <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mr-4">
                    <FaMapMarkerAlt className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-background">
                    Configuración
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                    <label className="block text-lg font-semibold text-background">
                        Localidad
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="text-blue-500" />
                        </div>
                        <input
                            type="text"
                            value={settings.location || ''}
                            onChange={handleLocationChange}
                            className="w-full pl-12 pr-4 py-4 border border-border dark:border-muted rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ingresa tu localidad"
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-lg font-semibold text-background">
                        Rastreador GPS
                    </label>
                    <div className="flex items-center p-4 bg-background dark:bg-foreground rounded-xl border-2 border-dashed border-border dark:border-muted">
                        <FaLocationArrow className="text-accent dark:text-muted mr-4" />
                        <span className="flex-1 text-accent dark:text-muted font-medium">
                            {settings.hasGPSTracker ? 'Rastreador activo' : '¿Tienes rastreador?'}
                        </span>
                        
                        <div className="relative group mr-4">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold cursor-help">
                                ?
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-10">
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                Solo se puede modificar desde la app móvil
                            </div>
                        </div>

                        <div className={`w-16 h-8 rounded-full relative opacity-50 cursor-not-allowed ${
                            settings.hasGPSTracker ? 'bg-green-500' : 'bg-muted'
                        }`}>
                            <span 
                                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 shadow-md ${
                                    settings.hasGPSTracker ? 'right-1' : 'left-1'
                                }`}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-accent dark:text-muted italic">
                        Esta configuración solo puede ser modificada desde la aplicación móvil
                    </p>
                </div>

                <div className="space-y-4">
                    <label className="block text-lg font-semibold text-background">
                        Precio por paseo por mascota
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaDollarSign className="text-green-500" />
                        </div>
                        <input
                            type="number"
                            value={settings.pricePerPet || 0}
                            onChange={handlePriceChange}
                            className="w-full pl-12 pr-4 py-4 border border-border dark:border-muted rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            min="0"
                            placeholder="0"
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-lg font-semibold text-background">
                        Sistema de descuentos
                    </label>
                    
                    <div className="flex items-center p-4 bg-background dark:bg-foreground rounded-xl mb-4">
                        <FaPercent className="text-orange-500 mr-4" />
                        <span className="flex-1 text-foreground dark:text-background font-medium">
                            Activar descuento
                        </span>
                        <button
                            onClick={handleDiscountToggle}
                            disabled={isSaving}
                            className={`w-16 h-8 rounded-full relative transition-all duration-300 ${
                                settings.hasDiscount ? "bg-orange-500 shadow-lg" : "bg-muted"
                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <span 
                                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 shadow-md ${
                                    settings.hasDiscount ? "right-1 transform scale-110" : "left-1"
                                }`}
                            />
                        </button>
                    </div>

                    {settings.hasDiscount && (
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.discountPercentage || 0}
                                onChange={handleDiscountPercentageChange}
                                className="w-full pr-12 pl-4 py-4 border border-border dark:border-muted rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                min="0"
                                max="100"
                                placeholder="Porcentaje de descuento"
                                disabled={isSaving}
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-orange-500 font-bold">%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button 
                    onClick={onSave}
                    disabled={isSaving}
                    className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                        isSaving 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transform hover:scale-105'
                    }`}
                >
                    {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                </button>
            </div>

            <div className="mt-8 space-y-6">
                <div className="border-t border-border dark:border-muted pt-8">
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mr-4">
                            <FaCreditCard className="text-2xl text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-background">
                                Configuración de Mercado Pago
                            </h3>
                            <p className="text-accent dark:text-muted">
                                Configura tu cuenta de Mercado Pago para recibir pagos automáticamente
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isMercadoPagoConfigured() 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {isMercadoPagoConfigured() ? 'Configurado' : 'Pendiente'}
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-background dark:bg-foreground rounded-xl mb-6">
                        <FaCreditCard className="text-blue-500 mr-4" />
                        <span className="flex-1 text-foreground dark:text-background font-medium">
                            {settings.hasMercadoPago ? 'Pagos habilitados' : 'Habilitar cobro automático'}
                        </span>
                        <button
                            onClick={handleMercadoPagoToggle}
                            disabled={savingMercadoPago}
                            className={`w-16 h-8 rounded-full relative transition-all duration-300 ${
                                settings.hasMercadoPago ? "bg-blue-500 shadow-lg" : "bg-muted"
                            } ${savingMercadoPago ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <span 
                                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 shadow-md ${
                                    settings.hasMercadoPago ? "right-1 transform scale-110" : "left-1"
                                }`}
                            />
                        </button>
                    </div>

                    {settings.hasMercadoPago && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-background">
                                    Access Token
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaKey className="text-blue-500" />
                                    </div>
                                    <input
                                        type={showAccessToken ? "text" : "password"}
                                        value={settings.tokenMercadoPago || ''}
                                        onChange={handletokenMercadoPagoChange}
                                        className="w-full pl-12 pr-12 py-4 border border-border dark:border-muted rounded-xl bg-background dark:bg-foreground text-foreground dark:text-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Ingresa tu Access Token de Mercado Pago"
                                        disabled={savingMercadoPago}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowAccessToken(!showAccessToken)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-accent dark:text-muted hover:text-foreground dark:hover:text-background"
                                    >
                                        {showAccessToken ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <p className="text-sm text-accent dark:text-muted">
                                    Token que comienza con APP_USR- (para producción) o TEST- (para pruebas)
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                <h4 className="font-semibold text-black mb-2">
                                    ¿Cómo obtener mis credenciales?
                                </h4>
                                <ol className="text-sm text-black space-y-1">
                                    <li>1. Ingresa a tu cuenta de Mercado Pago</li>
                                    <li>2. Ve a Desarrolladores → Credenciales</li>
                                    <li>3. Copia el Access Token y Public Key</li>
                                    <li>4. Para pruebas usa las credenciales de TEST</li>
                                    <li>5. Para producción usa las credenciales de PROD</li>
                                </ol>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={handleSaveMercadoPago}
                                    disabled={savingMercadoPago || !settings.hasMercadoPago}
                                    className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                                        savingMercadoPago || !settings.hasMercadoPago
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:from-blue-600 hover:to-cyan-700 hover:shadow-xl transform hover:scale-105'
                                    }`}
                                >
                                    {savingMercadoPago ? 'Guardando MercadoPago...' : 'Guardar MercadoPago'}
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="text-sm text-accent dark:text-muted mt-4">
                        {settings.hasMercadoPago && isMercadoPagoConfigured()
                            ? 'Los clientes podrán pagar directamente a través de Mercado Pago al precio configurado'
                            : settings.hasMercadoPago
                            ? 'Completa la configuración para permitir cobros automáticos'
                            : 'Activa esta opción para permitir cobros automáticos al precio que estableciste'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WalkerServiceSettingsComponent;