// Archivo: src/components/ui/OrientadorModal.tsx
// Modal del Orientador Vocacional con IA.
// Formulario de 5 pasos (Área, Objetivo, Modalidad, País, Presupuesto) → Server Action → respuesta enriquecida.
// Los programas recomendados son links a sus URLs dinámicas. Reset total al cerrar.

"use client";

import { useState } from "react";
import Link from "next/link";
import { orientarUsuarioConIA, type PerfilOrientador, type RespuestaOrientador } from "@/app/actions/orientador";

const PAISES = [
    "Sin preferencia", "México", "Colombia", "Venezuela", "Perú", "Ecuador", "Chile",
    "Argentina", "España", "Costa Rica", "Panamá", "Cuba", "República Dominicana",
    "Puerto Rico", "Bolivia", "Paraguay", "Uruguay", "Honduras", "El Salvador",
    "Nicaragua",
];

interface Props {
    abierto: boolean;
    onCerrar: () => void;
}

const AREAS = ["Educación", "Pedagogía", "Gestión Educativa",
    "TIC en Educación", "Ciencias Sociales"];
const OBJETIVOS = ["Ascenso salarial", "Investigación", "Docencia universitaria", "Cambio de carrera"];
const MODALIDADES = ["Virtual", "Presencial", "Híbrida", "Todas"];
const RANGOS_PRECIO = [
    { label: "Sin límite", value: 0 },
    { label: "Hasta $1,000 USD", value: 1000 },
    { label: "Hasta $3,000 USD", value: 3000 },
    { label: "Hasta $5,000 USD", value: 5000 },
    { label: "Hasta $10,000 USD", value: 10000 },
    { label: "Manual...", value: -1 },
];

export function OrientadorModal({ abierto, onCerrar }: Props) {
    const [area, setArea] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [modalidad, setModalidad] = useState("");
    const [pais, setPais] = useState("Sin preferencia");
    const [presupuestoRango, setPresupuestoRango] = useState(0);
    const [presupuestoManual, setPresupuestoManual] = useState("");
    const [cargando, setCargando] = useState(false);
    const [resultado, setResultado] = useState<RespuestaOrientador | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!abierto) return null;

    const esManual = RANGOS_PRECIO[presupuestoRango]?.value === -1;
    const presupuestoNumerico = esManual
        ? Number(presupuestoManual)
        : RANGOS_PRECIO[presupuestoRango]?.value ?? 0;

    const presupuestoValido = presupuestoNumerico > 0 || (!esManual && RANGOS_PRECIO[presupuestoRango]?.value === 0);

    const puedeEnviar = area && objetivo && modalidad && presupuestoValido;

    const handleEnviar = async () => {
        if (!puedeEnviar) return;
        setCargando(true);
        setError(null);
        setResultado(null);

        try {
            const perfil: PerfilOrientador = {
                area,
                objetivo,
                modalidad,
                pais: pais === "Sin preferencia" ? "" : pais,
                presupuesto: presupuestoNumerico > 0 ? presupuestoNumerico : null,
            };
            const res = await orientarUsuarioConIA(perfil);
            setResultado(res);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error inesperado al consultar el orientador."
            );
        } finally {
            setCargando(false);
        }
    };

    const handleCerrar = () => {
        setArea("");
        setObjetivo("");
        setModalidad("");
        setPais("Sin preferencia");
        setPresupuestoRango(0);
        setPresupuestoManual("");
        setCargando(false);
        setResultado(null);
        setError(null);
        onCerrar();
    };

    const handleWhatsApp = () => {
        const programasTexto = resultado
            ? resultado.recomendaciones.map((r) => r.nombre).join(", ")
            : "";
        const texto = `Hola, vengo del Orientador Vocacional de CTL.` +
            (programasTexto
                ? ` Me recomendaron: ${programasTexto}.`
                : "") +
            ` Me interesa el servicio de redacción de tesis.`;
        window.open(`https://wa.me/573005347644?text=${encodeURIComponent(texto)}`, "_blank");
    };

    // Renderizar mensaje con soporte Markdown básico (**negrita**)
    const renderMensaje = () => {
        if (!resultado) return null;
        const lineas = resultado.mensaje.split("\n");
        return lineas.map((linea, i) => {
            const partes = linea.split(/(\*\*[^*]+\*\*)/g);
            return (
                <p key={i} className="mb-2 last:mb-0">
                    {partes.map((fragmento, j) => {
                        if (fragmento.startsWith("**") && fragmento.endsWith("**")) {
                            return (
                                <strong key={j} className="text-white font-semibold">
                                    {fragmento.slice(2, -2)}
                                </strong>
                            );
                        }
                        return <span key={j}>{fragmento}</span>;
                    })}
                </p>
            );
        });
    };

    // Renderizar el párrafo de tesis con "contactando con uno de nuestros asesores" como link a WhatsApp
    const renderParrafoTesis = () => (
        <p className="text-white/80 text-sm leading-relaxed">
            📝 Recuerda que la tesis no tiene por qué ser un obstáculo. Comunidad Tesista de Latinoamérica ofrece redacción de tesis personalizada. Puedes añadirla marcando la casilla en el programa elegido o{" "}
            <button
                onClick={handleWhatsApp}
                className="text-yellow underline font-semibold hover:text-yellow-dark transition-colors cursor-pointer bg-transparent border-none p-0"
            >
                contactando con uno de nuestros asesores
            </button>
            .
        </p>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="bg-gray-bg border border-yellow/40 rounded-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h2 className="font-sans text-lg font-bold text-yellow">
                        🧠 Orientador Vocacional de IA
                    </h2>
                    <button
                        onClick={handleCerrar}
                        className="text-white/50 hover:text-white transition-colors text-xl leading-none cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    {/* Estado: Formulario */}
                    {!resultado && !cargando && !error && (
                        <div className="space-y-5">
                            <p className="text-white/70 text-sm leading-relaxed">
                                Responde 5 preguntas rápidas y nuestra IA te recomendará los mejores programas para tu perfil académico y profesional. 🎓
                            </p>

                            {/* Pregunta 1: Área */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                                    1. ¿Cuál es tu área de interés?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {AREAS.map((a) => (
                                        <button
                                            key={a}
                                            onClick={() => setArea(a)}
                                            className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${area === a
                                                ? "bg-yellow border-yellow text-black"
                                                : "bg-black/40 border-white/20 text-white/70 hover:border-yellow/50"
                                                }`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 2: Objetivo */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                                    2. ¿Cuál es tu objetivo principal?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {OBJETIVOS.map((o) => (
                                        <button
                                            key={o}
                                            onClick={() => setObjetivo(o)}
                                            className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${objetivo === o
                                                ? "bg-yellow border-yellow text-black"
                                                : "bg-black/40 border-white/20 text-white/70 hover:border-yellow/50"
                                                }`}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 3: Modalidad */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                                    3. ¿Qué modalidad prefieres?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {MODALIDADES.map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setModalidad(m)}
                                            className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${modalidad === m
                                                ? "bg-yellow border-yellow text-black"
                                                : "bg-black/40 border-white/20 text-white/70 hover:border-yellow/50"
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 4: País */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                                    4. ¿Desde qué país nos visitas?
                                </label>
                                <select
                                    value={pais}
                                    onChange={(e) => setPais(e.target.value)}
                                    className="w-full bg-black/40 border border-white/20 rounded-full px-4 py-2 text-white/70 text-sm outline-none focus:border-yellow/50 transition-colors"
                                >
                                    {PAISES.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pregunta 5: Presupuesto */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                                    5. ¿Cuál es tu presupuesto máximo en USD?
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {RANGOS_PRECIO.map((r, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setPresupuestoRango(i);
                                                if (r.value !== -1) setPresupuestoManual("");
                                            }}
                                            className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${presupuestoRango === i
                                                ? "bg-yellow border-yellow text-black"
                                                : "bg-black/40 border-white/20 text-white/70 hover:border-yellow/50"
                                                }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                                {esManual && (
                                    <input
                                        type="number"
                                        placeholder="Ingresa tu presupuesto en USD"
                                        value={presupuestoManual}
                                        onChange={(e) => setPresupuestoManual(e.target.value)}
                                        className="w-full bg-black/40 border border-white/20 rounded-full px-4 py-2 text-white/70 text-sm outline-none focus:border-yellow/50 transition-colors"
                                    />
                                )}
                            </div>

                            {/* Botón Enviar */}
                            <button
                                onClick={handleEnviar}
                                disabled={!puedeEnviar}
                                className="w-full font-sans text-sm font-bold tracking-[0.5px] uppercase bg-yellow text-black border-2 border-yellow rounded-full px-6 py-3 cursor-pointer transition-all hover:bg-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Obtener recomendación personalizada 🚀
                            </button>
                        </div>
                    )}

                    {/* Estado: Cargando */}
                    {cargando && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="w-10 h-10 border-4 border-yellow/30 border-t-yellow rounded-full animate-spin" />
                            <p className="text-white/60 text-sm">
                                Analizando tu perfil con IA...
                            </p>
                        </div>
                    )}

                    {/* Estado: Error */}
                    {error && !cargando && (
                        <div className="text-center py-10 space-y-4">
                            <div className="text-3xl">⚠️</div>
                            <p className="text-red-400 text-sm">{error}</p>
                            <button
                                onClick={handleCerrar}
                                className="font-sans text-sm font-medium text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-none underline"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}

                    {/* Estado: Resultado */}
                    {resultado && (
                        <div className="space-y-5">
                            <div className="bg-black/40 border border-yellow/30 rounded-xl p-5">
                                <div className="text-white/80 text-sm leading-relaxed space-y-1">
                                    {renderMensaje()}
                                </div>
                            </div>

                            {/* Párrafo de tesis con link a WhatsApp */}
                            {renderParrafoTesis()}

                            {/* Programas recomendados como links */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-yellow">
                                    Programas recomendados:
                                </h3>
                                {resultado.recomendaciones.map((p) => (
                                    <Link
                                        key={p.airtableId || p.slug}
                                        href={`/programas/${p.slug}`}
                                        className="block bg-black/40 border border-white/10 rounded-lg px-4 py-3 hover:border-yellow/40 transition-colors no-underline"
                                    >
                                        <p className="text-sm font-semibold text-white">{p.nombre}</p>
                                        <p className="text-xs text-white/50">
                                            {p.universidad} · {p.pais} · {p.modalidad} · ${p.matricula.toLocaleString("es-MX")} USD
                                        </p>
                                    </Link>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleWhatsApp}
                                    className="flex-1 font-sans text-sm font-semibold no-underline rounded-full px-3.5 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer transition-all text-white bg-[#25D366] border-2 border-[#25D366] hover:bg-[#1ebe5d]"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                        <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                    </svg>
                                    Cotizar tesis con CTL
                                </button>
                                <button
                                    onClick={handleCerrar}
                                    className="flex-1 font-sans text-sm font-semibold rounded-md px-3.5 py-2.5 cursor-pointer transition-colors border-2 border-white/20 text-white/70 hover:bg-white/10"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}