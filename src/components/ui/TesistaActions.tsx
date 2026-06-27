// Archivo: src/components/ui/TesistaActions.tsx
// Componente reutilizable: Checkbox de redacción de tesis + Botón WhatsApp "Cotizar tesis con CTL".
// Usado tanto en las Cards del catálogo como en las páginas de detalle /programas/[slug].
// Lógica de cálculo unificada en COP (pesos colombianos).

"use client";

import { useState } from "react";
import type { Programa } from "@/types";

// ── Constantes Financieras ──
const TASA_CAMBIO_USD = 3500;
const PRECIO_MAESTRIA_COP = 3450000;
const PRECIO_DOCTORADO_COP = 6000000;

/** Formatea un valor numérico como COP sin decimales */
function fmtCOP(valor: number): string {
    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    });
}

interface TesistaActionsProps {
    programa: Programa;
    /** Variante visual: "card" usa estilos compactos, "detalle" usa estilos más amplios */
    variant?: "card" | "detalle";
}

export function TesistaActions({ programa, variant = "card" }: TesistaActionsProps) {
    const [incluirTesis, setIncluirTesis] = useState(false);

    // ── Lógica de cálculo unificada en COP ──
    const nivelNormalizado = programa.nivel.toLowerCase();
    const precioTesisCop =
        nivelNormalizado.includes("maestría") || nivelNormalizado.includes("magíster")
            ? PRECIO_MAESTRIA_COP
            : nivelNormalizado.includes("doctorado")
                ? PRECIO_DOCTORADO_COP
                : 0;

    const matriculaEnCop = programa.matricula * TASA_CAMBIO_USD;
    const totalCop = incluirTesis ? matriculaEnCop + precioTesisCop : null;

    const esDetalle = variant === "detalle";

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* ── Opcional de redacción de tesis ── */}
            {precioTesisCop > 0 && (
                <div className={`flex flex-col gap-1.5 ${esDetalle ? "bg-white/5 border border-white/10 rounded-xl p-5" : ""}`}>
                    {/* Checkbox estilizado */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={incluirTesis}
                            onChange={(e) => setIncluirTesis(e.target.checked)}
                            className="peer sr-only"
                        />
                        <span className={`w-4 h-4 border-2 rounded-[3px] flex items-center justify-center transition-colors peer-checked:bg-yellow peer-checked:border-yellow peer-focus:outline-none ${esDetalle ? "border-white/40" : "border-gray-400"}`}>
                            {incluirTesis && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path
                                        d="M1 4l2.5 2.5L9 1"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </span>
                        <span className={`text-xs font-medium ${esDetalle ? "text-white/80" : "text-black/80"}`}>
                            Incluir redacción de tesis
                        </span>
                    </label>

                    {/* Desglose cuando el checkbox está activo */}
                    {incluirTesis && totalCop !== null && (
                        <div className={`rounded-md px-3 py-2 border ${esDetalle ? "bg-yellow/10 border-yellow/30" : "bg-black/5 border-black/10"}`}>
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${esDetalle ? "text-white/50" : "text-gray-text"}`}>
                                Matrícula: {fmtCOP(matriculaEnCop)} · Tesis: {fmtCOP(precioTesisCop)}
                            </p>
                            <p className={`text-sm font-bold mt-0.5 ${esDetalle ? "text-yellow" : "text-black"}`}>
                                Total Estimado: {fmtCOP(totalCop)}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Botón WhatsApp "Cotizar tesis con CTL" ── */}
            <button
                className={`font-sans text-sm font-semibold no-underline rounded-full flex items-center justify-center gap-1.5 cursor-pointer w-full transition-all text-white bg-[#25D366] border-2 border-[#25D366] hover:bg-[#1ebe5d] hover:border-[#1ebe5d] ${esDetalle ? "px-8 py-4" : "px-3.5 py-2"}`}
                data-programa-id={programa.id}
                data-programa-nombre={programa.nombre}
                data-programa-pais={programa.pais}
                data-accion="contacto_whatsapp"
                onClick={() => {
                    const mensaje = incluirTesis
                        ? `Hola, me interesa el programa: ${programa.nombre} incluyendo redacción de tesis. Total estimado: ${fmtCOP(totalCop!)}`
                        : `Hola, me interesa el programa: ${programa.nombre}`;
                    const text = encodeURIComponent(mensaje);
                    window.open(`https://wa.me/573005347644?text=${text}`, "_blank");
                }}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                Cotizar tesis con CTL
            </button>
        </div>
    );
}