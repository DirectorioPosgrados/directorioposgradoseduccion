"use client";

import { useState, useEffect } from "react";

interface Slide {
  logo?: string;
  mensaje: string;
  ctaTexto: string;
  link: string;
}

const SLIDES: Slide[] = [
  {
    logo: "/images/logo-vertical-blanco.png",
    mensaje: "¿Quieres acelerar tu titulación? Recibe asesoría de expertos en la Comunidad Tesista de Latinoamérica",
    ctaTexto: "QUIERO SABER MÁS →",
    link: "https://comunidadtesistadelatinoamerica.com/",
  },
  {
    logo: "/images/logo-vertical-blanco.png",
    mensaje: "¿Necesitas ayuda urgente con tu proyecto de grado? Chatea directamente con un asesor académico.",
    ctaTexto: "COTIZAR POR WHATSAPP →",
    link: "https://wa.me/573005347644?text=Hola,%20quiero%20cotizar%20mi%20tesis%20con%20CTL.",
  },
  {
    logo: "/images/logo-vertical-blanco.png",
    mensaje: "Evita retrasos en tu aumento de sueldo. Asegura tu aprobación y cotiza tu tesis hoy mismo.",
    ctaTexto: "HABLAR CON EXPERTO →",
    link: "https://wa.me/573005347644?text=Hola,%20vengo%20del%20directorio%20y%20quiero%20asesor%C3%ADa.",
  },
];

export function BannerRotativo() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div
      className={`bg-white/[0.04] border border-white/10 rounded-xl p-6 min-h-[150px] w-full flex flex-col sm:flex-row items-center gap-6 transition-opacity duration-300 relative ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {slide.logo && (
        <img
          src={slide.logo}
          alt="CTL Logo"
          className="h-16 w-auto object-contain opacity-95 flex-shrink-0"
        />
      )}

      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <p className="text-white font-sans text-base md:text-[17px] font-medium leading-snug pr-4">
          {slide.mensaje}
        </p>
        <div>
          <a
            href={slide.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-sans font-bold text-xs tracking-[0.5px] uppercase bg-yellow text-black px-5 py-2.5 rounded-full cursor-pointer transition-colors hover:bg-yellow-dark no-underline whitespace-nowrap"
          >
            {slide.ctaTexto}
          </a>
        </div>
      </div>

      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (i !== current) {
                setFade(false);
                setTimeout(() => {
                  setCurrent(i);
                  setFade(true);
                }, 300);
              }
            }}
            className={`w-1.5 h-1.5 rounded-full border-none cursor-pointer transition-colors ${
              i === current ? "bg-yellow" : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
