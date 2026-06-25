// Archivo: src/components/ui/Card.tsx
// Tarjeta de programa académico con estructura Flexbox rígida anti-desborde.
// Incluye fallback de imagen (gradiente oficial) si la URL no existe o falla la carga.
// Función de venta cruzada: checkbox para incluir redacción de tesis con cálculo unificado en COP.

import { useState } from "react";
import type { Programa } from "@/types";
import { badgeClass, fmtUSD } from "@/lib/utils";
import Link from "next/link";

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

interface CardProps {
  programa: Programa;
  index: number;
}

export function Card({ programa, index }: CardProps) {
  const bc = badgeClass(programa.pais);
  const delay = 0.05 + index * 0.07;

  // ── Estado local del checkbox de tesis ──
  const [incluirTesis, setIncluirTesis] = useState(false);

  // ── Lógica de cálculo unificada en COP ──
  // Determinar precio de tesis según nivel
  const nivelNormalizado = programa.nivel.toLowerCase();
  const precioTesisCop =
    nivelNormalizado.includes("maestría") || nivelNormalizado.includes("magíster")
      ? PRECIO_MAESTRIA_COP
      : nivelNormalizado.includes("doctorado")
        ? PRECIO_DOCTORADO_COP
        : 0;

  // Convertir matrícula de USD → COP
  const matriculaEnCop = programa.matricula * TASA_CAMBIO_USD;

  // Total si el checkbox está activo
  const totalCop = incluirTesis ? matriculaEnCop + precioTesisCop : null;

  // ── Sección de Imagen con Fallback ──
  const imgSection = programa.imagen ? (
    <div className="h-40 bg-gray-800 flex items-center justify-center w-full relative overflow-hidden">
      <img
        src={programa.imagen}
        alt={programa.nombre}
        className="w-full h-full object-cover absolute inset-0"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div
        className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-[#1a1a1a] to-[#333]"
        style={{ display: "none" }}
      >
        🎓
      </div>
    </div>
  ) : (
    <div className="h-40 bg-gray-800 flex items-center justify-center w-full relative text-4xl bg-gradient-to-br from-[#1a1a1a] to-[#333]">
      🎓
    </div>
  );

  return (
    <article
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full min-h-[450px] justify-between border border-gray-200"
      style={{ animation: `slide-up-card 0.5s ease forwards ${delay}s` }}
    >
      {/* ── Imagen del programa (altura fija, fallback incluido) ── */}
      {imgSection}

      {/* ── Cuerpo: Título, universidad, inversión y duración ── */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Título + Badge de país */}
          <div className="flex items-start justify-between gap-2.5 mb-2.5">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-black leading-tight tracking-[-0.3px]">
                {programa.nombre}
              </h2>
              {programa.universidad && (
                <p className="text-sm text-gray-text mt-1 truncate">
                  {programa.universidad}
                </p>
              )}
            </div>
            <span className={`badge-pais ${bc}`}>{programa.pais}</span>
          </div>

          {/* Separador */}
          <div className="h-px bg-gray-light my-3.5" />

          {/* Datos: Inversión + Duración/Modalidad */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-gray-text mb-0.5">
                Inversión
              </p>
              <p className="text-xl font-bold text-black tracking-[-0.5px] leading-none">
                {fmtUSD(programa.matricula)}
                <small className="text-xs font-medium text-gray-text ml-0.5">
                  {" "}
                  USD
                </small>
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-gray-text mb-0.5">
                Duración / Modalidad
              </p>
              <p className="text-sm font-semibold text-black leading-tight">
                {programa.duracion} Meses
                <br />
                <small className="text-xs font-medium text-gray-text">
                  {programa.modalidad}
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección inferior: Checkbox de tesis + Botones de acción ── */}
      <div className="w-full bg-gray-100 p-4 mt-auto border-t border-gray-200 flex flex-col gap-2">
        {/* ── Opcional de redacción de tesis ── */}
        {precioTesisCop > 0 && (
          <div className="flex flex-col gap-1.5">
            {/* Checkbox estilizado */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={incluirTesis}
                onChange={(e) => setIncluirTesis(e.target.checked)}
                className="peer sr-only"
              />
              <span className="w-4 h-4 border-2 border-gray-400 rounded-[3px] flex items-center justify-center transition-colors peer-checked:bg-yellow peer-checked:border-yellow peer-focus:outline-none">
                {incluirTesis && (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
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
              <span className="text-xs font-medium text-black/80">
                Incluir redacción de tesis
              </span>
            </label>

            {/* Total estimado en COP cuando el checkbox está activo */}
            {incluirTesis && totalCop !== null && (
              <div className="bg-black/5 rounded-md px-3 py-2 border border-black/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-text">
                  Matrícula: {fmtCOP(matriculaEnCop)} · Tesis: {fmtCOP(precioTesisCop)}
                </p>
                <p className="text-sm font-bold text-black mt-0.5">
                  Total Estimado: {fmtCOP(totalCop)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botón WhatsApp */}
        <button
          className="font-sans text-sm font-semibold no-underline rounded-[4px] px-3.5 py-2 flex items-center justify-center gap-1.5 cursor-pointer w-full transition-all text-white bg-[#25D366] border-2 border-[#25D366] hover:bg-[#1ebe5d] hover:border-[#1ebe5d]"
          data-programa-id={programa.id}
          data-programa-nombre={programa.nombre}
          data-programa-pais={programa.pais}
          data-accion="contacto_whatsapp"
          onClick={() => {
            const mensaje = incluirTesis
              ? `Hola, me interesa el programa: ${programa.nombre} incluyendo redacción de tesis. Total estimado: ${fmtCOP(totalCop!)}`
              : `Hola, me interesa el programa: ${programa.nombre}`;
            const text = encodeURIComponent(mensaje);
            window.open(`https://wa.me/?text=${text}`, "_blank");
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
          Contactar Asesor
        </button>

        {/* Botón "Ver Programa" — navega a la ruta dinámica /programas/[slug] */}
        <Link
          href={`/programas/${programa.slug}`}
          className="font-sans text-sm font-semibold no-underline rounded-[4px] px-3.5 py-2 flex items-center justify-center gap-1.5 cursor-pointer w-full transition-all text-black bg-yellow border-2 border-yellow hover:bg-yellow-dark hover:border-yellow-dark"
        >
          Ver Programa
        </Link>
      </div>
    </article>
  );
}