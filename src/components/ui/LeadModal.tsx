"use client";

import { useEffect, useState } from "react";
import { submitLead } from "@/app/actions/leads";

const PAISES_LATAM = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica",
    "Cuba", "Ecuador", "El Salvador", "Guatemala", "Honduras", "México",
    "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico",
    "República Dominicana", "Uruguay", "Venezuela",
];

const PAISES_RESTO = [
    "Alemania", "Arabia Saudita", "Australia", "Bélgica", "Canadá",
    "China", "Corea del Sur", "España", "Estados Unidos", "Francia",
    "India", "Italia", "Japón", "Países Bajos", "Portugal",
    "Reino Unido", "Rusia", "Sudáfrica", "Suiza", "Turquía", "Otro",
];

export default function LeadModal() {
    const [visible, setVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [pais, setPais] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const yaRegistrado = localStorage.getItem("ctl_lead_email");
        if (!yaRegistrado) setVisible(true);
    }, []);

    if (!visible) return null;

    const handleSubmit = async () => {
        if (!nombre.trim() || !apellido.trim() || !telefono.trim() || !correo.trim() || !pais) {
            setError("Por favor completa todos los campos.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
            setError("Ingresa un correo electrónico válido.");
            return;
        }

        setEnviando(true);
        setError(null);

        try {
            const result = await submitLead({
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                correo: correo.trim(),
                pais,
            });

            if (result.ok) {
                localStorage.setItem("ctl_lead_email", correo.trim());
                setVisible(false);
            } else {
                setError(result.message ?? "Error inesperado.");
            }
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
            <div className="bg-[#0a0a0a] border border-yellow/30 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                <span className="text-[10px] font-bold tracking-widest text-yellow uppercase mb-4 block">
                    ✦ DIRECTORIO DE POSGRADOS DE EDUCACIÓN
                </span>

                <h2 className="text-xl font-bold text-white mb-2">
                    Antes de explorar, un dato importante
                </h2>

                <p className="text-sm text-white/70 leading-relaxed mb-6">
                    Más de 358 programas de posgrado en 18 países. Gratis. Sin filtros.
                    Pero primero, ¿a quién le estamos abriendo la puerta?
                </p>

                <div>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-yellow/50 mb-3"
                    />
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-yellow/50 mb-3"
                    />
                    <input
                        type="tel"
                        placeholder="Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-yellow/50 mb-3"
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-yellow/50 mb-3"
                    />
                    <select
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow/50"
                    >
                        <option value="" disabled className="bg-[#0a0a0a] text-white/30">
                            Selecciona tu país
                        </option>
                        {PAISES_LATAM.map((p) => (
                            <option key={p} value={p} className="bg-[#0a0a0a] text-white">
                                {p}
                            </option>
                        ))}
                        <option disabled className="bg-[#0a0a0a] text-white/20">── Resto del mundo ──</option>
                        {PAISES_RESTO.map((p) => (
                            <option key={p} value={p} className="bg-[#0a0a0a] text-white">
                                {p}
                            </option>
                        ))}
                    </select>

                    {error && (
                        <p className="text-red-400 text-xs mt-1 mb-2">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={enviando}
                        className="w-full bg-yellow text-black font-bold text-sm py-3 rounded-full mt-2 hover:bg-yellow/90 transition-all"
                    >
                        {enviando ? "Registrando..." : "Quiero acceder al directorio →"}
                    </button>
                </div>

                <p className="text-[11px] text-white/40 leading-relaxed mt-4 text-center">
                    Al registrarte obtienes acceso completo al directorio y a un
                    sistema de orientación inteligente que analiza tu perfil y te
                    dice exactamente qué programa conviene más según tu país,
                    objetivo y presupuesto — sin rodeos. Tu información es privada
                    y nunca será compartida con terceros.
                </p>
            </div>
        </div>
    );
}