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

const NIVELES_INTERES = ["Maestría", "Doctorado", "Quiero explorar el directorio"];

const AREAS_INTERES = ["Educación", "Pedagogía", "Gestión Educativa", "TIC en Educación"];

interface LeadModalProps {
    onVisibilidadChange?: (visible: boolean) => void;
}

export default function LeadModal({ onVisibilidadChange }: LeadModalProps) {
    const [visible, setVisible] = useState(false);
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [pais, setPais] = useState("");
    const [nivelInteres, setNivelInteres] = useState<string | null>(null);
    const [areaInteres, setAreaInteres] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const yaRegistrado = localStorage.getItem("ctl_lead_email");
        if (!yaRegistrado) {
            setVisible(true);
            onVisibilidadChange?.(true);
        }
    }, []);

    if (!visible) return null;

    const handleSubmit = async () => {
        if (!nombreCompleto.trim() || !telefono.trim() || !correo.trim()) {
            setError("Por favor completa los campos obligatorios.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
            setError("Ingresa un correo electrónico válido.");
            return;
        }

        const partes = nombreCompleto.trim().split(/\s+/);
        const nombre = partes[0] ?? "";
        const apellido = partes.slice(1).join(" ") || "";

        setEnviando(true);
        setError(null);

        try {
            const result = await submitLead({
                nombre,
                apellido,
                telefono: telefono.trim(),
                correo: correo.trim(),
                pais: pais || null,
                nivelInteres,
                areaInteres,
            });

            if (result.ok) {
                localStorage.setItem("ctl_lead_email", correo.trim());
                setVisible(false);
                onVisibilidadChange?.(false);
            } else {
                setError(result.message ?? "Error inesperado.");
            }
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-[#0a0a0a] border border-yellow/30 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
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
                        placeholder="Primer nombre y primer apellido"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
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
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow/50 mb-3"
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

                    {/* ── Nivel de posgrado (opcional) ── */}
                    <div className="mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                            ¿Qué nivel de posgrado te interesa? (opcional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {NIVELES_INTERES.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setNivelInteres(nivelInteres === n ? null : n)}
                                    className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${nivelInteres === n
                                        ? "bg-yellow border-yellow text-black"
                                        : "bg-black/40 border-white/20 text-white/70 hover:border-yellow/50"
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Área de interés (opcional) ── */}
                    <div className="mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                            ¿Cuál es tu área de interés? (opcional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {AREAS_INTERES.map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setAreaInteres(areaInteres === a ? null : a)}
                                    className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${areaInteres === a
                                        ? "bg-yellow border-yellow text-black"
                                        : "bg-black/40 border-white/20 text-white/70 hover:border-yellow/50"
                                        }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

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
                    Con tu registro, obtendrás acceso total al directorio y a nuestra calculadora de inversión para posgrados, con el servicio opcional de redacción de tesis. Sin complicaciones. Tu información está segura y nunca la compartiremos con terceros.
                </p>
            </div>
        </div>
    );
}