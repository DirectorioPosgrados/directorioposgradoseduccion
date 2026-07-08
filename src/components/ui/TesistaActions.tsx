// Archivo: src/components/ui/TesistaActions.tsx
// Componente reutilizable: Checkbox de redacción de tesis + Botón WhatsApp "Cotizar tesis con CTL".
// Usado tanto en las Cards del catálogo como en las páginas de detalle /programas/[slug].
// Lógica de cálculo unificada en USD (dólares estadounidenses).

"use client";

import { useState } from "react";
import type { Programa } from "@/types";
import type { Tarifas } from "@/lib/services/supabase";
import { trackEvent } from "@/lib/tracking";

/** Formatea un valor numérico como USD */
function fmtUSD(valor: number): string {
    return valor.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

interface TesistaActionsProps {
    programa: Programa;
    variant?: "card" | "detalle";
    tarifas: Tarifas;
}

export function TesistaActions({ programa, variant = "card", tarifas }: TesistaActionsProps) {
    const [incluirTesis, setIncluirTesis] = useState(false);
    const nivelNormalizado = programa.nivel.toLowerCase();

    const precioTesisUSD =
        nivelNormalizado.includes("maestría") ||
            nivelNormalizado.includes("magíster") ||
            nivelNormalizado.includes("maestria") ||
            nivelNormalizado.includes("magister")
            ? tarifas.precioMaestriaCop / tarifas.trmCop
            : nivelNormalizado.includes("doctorado")
                ? tarifas.precioDoctoradoCop / tarifas.trmCop
                : 0;

    const totalUSD = incluirTesis ? programa.matricula + precioTesisUSD : null;
    const esDetalle = variant === "detalle";

    return (
        <div className="flex flex-col gap-2 w-full">
            {precioTesisUSD > 0 && (
                <div className={`flex flex-col gap-1.5 ${esDetalle ? "bg-white/5 border border-white/10 rounded-xl p-5" : ""}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${esDetalle ? "text-white/50" : "text-gray-text"}`}>
                        Calcula aquí el costo de tu inversión
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={incluirTesis} onChange={(e) => {
                            setIncluirTesis(e.target.checked);
                            if (e.target.checked) {
                                trackEvent("calculadora_uso", {
                                    programa: programa.nombre,
                                    universidad: programa.universidad,
                                });
                            }
                        }} className="peer sr-only" />
                        <span className={`w-4 h-4 border-2 rounded-[3px] flex items-center justify-center transition-colors peer-checked:bg-yellow peer-checked:border-yellow peer-focus:outline-none ${esDetalle ? "border-white/40" : "border-gray-400"}`}>
                            {incluirTesis && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4l2.5 2.5L9 1" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </span>
                        <span className={`text-xs font-medium ${esDetalle ? "text-white/80" : "text-black/80"}`}>
                            Posgrado + Servicio de redacción de tesis.
                        </span>
                    </label>

                    {incluirTesis && totalUSD !== null && (
                        <div className={`rounded-md px-3 py-2 border ${esDetalle ? "bg-yellow/10 border-yellow/30" : "bg-black/5 border-black/10"}`}>
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${esDetalle ? "text-white/50" : "text-gray-text"}`}>
                                Posgrado: {fmtUSD(programa.matricula)} · Tesis: {fmtUSD(precioTesisUSD)}
                            </p>
                            <p className={`text-sm font-bold mt-0.5 ${esDetalle ? "text-yellow" : "text-black"}`}>
                                Total Estimado: {fmtUSD(totalUSD)}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <button
                className={`font-sans text-sm font-semibold no-underline rounded-full flex items-center justify-center gap-1.5 cursor-pointer w-full transition-all text-white bg-[#25D366] border-2 border-[#25D366] hover:bg-[#1ebe5d] hover:border-[#1ebe5d] ${esDetalle ? "px-8 py-4" : "px-3.5 py-2"}`}
                data-programa-id={programa.id}
                data-programa-nombre={programa.nombre}
                data-programa-pais={programa.pais}
                data-accion="contacto_whatsapp"
                onClick={() => {
                    const nivelNorm = programa.nivel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                    const nombreNorm = programa.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                    const yaIncluyeNivel = nombreNorm.startsWith(nivelNorm);
                    const programaTexto = yaIncluyeNivel ? programa.nombre : `${programa.nivel} en ${programa.nombre}`;

                    const mensaje = `Hola, vengo del Directorio de Posgrados. Me interesa ` +
                        `el servicio de redacción de tesis para el programa: ` +
                        `${programaTexto} — ` +
                        `${programa.universidad}, ${programa.pais}.`;
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
