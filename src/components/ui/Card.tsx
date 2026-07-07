// Archivo: src/components/ui/Card.tsx
// Tarjeta de programa académico con estructura Flexbox rígida anti-desborde.
// Incluye fallback de imagen (gradiente oficial) si la URL no existe o falla la carga.
// Función de venta cruzada: checkbox para incluir redacción de tesis con cálculo unificado en COP.

import type { Programa } from "@/types";
import { badgeClass, fmtUSD } from "@/lib/utils";
import { TesistaActions } from "@/components/ui/TesistaActions";
import Link from "next/link";

interface CardProps {
  programa: Programa;
  index: number;
}

export function Card({ programa, index }: CardProps) {
  const bc = badgeClass(programa.pais);
  const delay = 0.05 + index * 0.07;

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
                {programa.duracion} Meses / {programa.modalidad}
              </p>
              <p className="text-xs font-medium text-gray-text mt-1">
                {programa.requisito_grado || "No especificado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección inferior: Ver Programa + TesistaActions ── */}
      <div className="w-full bg-gray-100 p-4 mt-auto border-t border-gray-200 flex flex-col gap-2">
        {/* Botón "Ver Programa" — navega a la ruta dinámica /programas/[slug] */}
        <Link
          href={`/programas/${programa.slug}`}
          className="font-sans text-sm font-semibold no-underline rounded-full px-3.5 py-2 flex items-center justify-center gap-1.5 cursor-pointer w-full transition-all text-black bg-yellow border-2 border-yellow hover:bg-yellow-dark hover:border-yellow-dark"
        >
          Ver Programa
        </Link>

        <TesistaActions programa={programa} variant="card" />
      </div>
    </article>
  );
}