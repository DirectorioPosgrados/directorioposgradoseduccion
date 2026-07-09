// Archivo: src/components/layout/Hero.tsx
// Componente de presentación: Barra de búsqueda, hero visual y banner publicitario rotativo.
// Layout: columna en mobile, dos columnas (58/42) en desktop (lg). Centrado vertical con items-center.

import { BannerRotativo } from "@/components/ui/BannerRotativo";

interface HeroProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit?: () => void;
}

export function Hero({ onSearch, onSearchSubmit }: HeroProps) {
  return (
    <section className="bg-black text-white px-10 py-16 max-sm:px-5 max-sm:py-12 relative overflow-hidden">
      {/* Círculo decorativo de fondo */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-yellow rounded-full opacity-[0.07] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

          {/* ── Columna Izquierda: Texto + Buscador (58%) ── */}
          <div className="w-full lg:w-[58%] flex flex-col justify-center text-left">
            <div className="self-start">
              <span className="inline-block bg-yellow text-black text-[11px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-sm mb-5">
                ✦ COMUNIDAD TESISTA DE LATINOAMÉRICA
              </span>
            </div>

            <h1 className="font-sans font-bold text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-1px] mb-4 text-left">
              Directorio de{" "}
              <em className="not-italic text-yellow">Posgrados en Educación de Latinoamérica</em>{" "}
              2026
            </h1>

            <p className="text-base text-white/65 mb-8 leading-relaxed text-left max-w-xl">
              Compara programas, costos, duración, y requisitos de grado de 18 países.
            </p>

            <div className="flex w-full max-w-xl">
              <input
                type="text"
                placeholder="Busca por programa o país... ej: MBA, Colombia"
                autoComplete="off"
                onChange={onSearch}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearchSubmit?.();
                  }
                }}
                className="flex-1 font-sans text-[15px] font-medium px-5 py-3.5 border-2 border-white/20 border-r-0 rounded-l-md bg-white/6 text-white outline-none transition-colors placeholder:text-white/40 focus:border-yellow focus:bg-white/10"
              />
              <button
                type="button"
                onClick={() => onSearchSubmit?.()}
                className="font-sans text-sm font-bold tracking-[0.5px] uppercase bg-yellow text-black border-2 border-yellow rounded-r-md px-6 py-3.5 cursor-pointer transition-colors hover:bg-yellow-dark hover:border-yellow-dark"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* ── Columna Derecha: Banner Publicitario (42%) ── */}
          <div className="w-full lg:w-[42%] flex items-center justify-end">
            <div className="w-full max-w-xl">
              <BannerRotativo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
