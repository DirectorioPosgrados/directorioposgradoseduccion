"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { consultarExperto } from "@/app/actions/chatConsultor";
import type { MensajeChat, ContextoPrograma, ContextoOrientador } from "@/app/actions/chatConsultor";
import type { Programa } from "@/types";

interface ChatWidgetProps {
    variant: "detalle" | "catalogo";
    programa?: Programa;
}

type WidgetState = "minimized" | "preview" | "open";

/** Mensajes del ciclo de preview para variant="detalle" */
function buildDetalleMessages(programa: Programa, conContexto: boolean): string[] {
    const nombre = programa.nombre;
    const universidad = programa.universidad;

    const msg1Con = `Hola de nuevo 👋 El Orientador identificó esta ${nombre} en ${universidad} como una de tus mejores opciones. ¿Quieres que profundice en por qué encaja con tu perfil?`;
    const msg1Sin = `Hola 👋 Veo que estás explorando la ${nombre} en ${universidad}. ¿Tienes preguntas sobre costos, requisitos o cómo te beneficia en tu escalafón docente?`;

    return [
        conContexto ? msg1Con : msg1Sin,
        `💬 Puedo darte el detalle real: costos, escalafón docente por país y qué esperar del proceso de tesis. Sin compromisos.`,
        `Si prefieres seguir leyendo sin interrupciones, dale a la ✕. Si tienes dudas, sigo aquí para resolverlas.`,
    ];
}

/** Mensajes del ciclo de preview para variant="catalogo" */
const CATALOGO_MESSAGES = [
    `¿Explorando opciones? Entra a cualquier programa y habla con nuestro Consultor Experto de IA — te dice exactamente qué esperar.`,
    `💬 Cada programa tiene su propio Consultor de IA. Pregúntale por costos, escalafón docente o requisitos antes de decidir.`,
    `Si prefieres explorar en silencio, dale clic a la ✕ y no te interrumpo más. Si no, aquí sigo cuando quieras hablar con el Consultor.`,
];

export default function ChatWidget({ variant, programa }: ChatWidgetProps) {
    const [widgetState, setWidgetState] = useState<WidgetState>("minimized");
    const [isMobile, setIsMobile] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [showBubble, setShowBubble] = useState(false);
    const [chatHistory, setChatHistory] = useState<MensajeChat[]>([]);
    const [turno, setTurno] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [esTurnoFinal, setEsTurnoFinal] = useState(false);
    const [mensajeWhatsApp, setMensajeWhatsApp] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const hasTriggeredPreviewRef = useRef(false);
    const mensajesRef = useRef<string[]>([]);
    const variantRef = useRef(variant);
    variantRef.current = variant;
    const programaRef = useRef(programa);
    programaRef.current = programa;
    const previewIndexRef = useRef(0);

    // ── Detección de breakpoint mobile ──
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
        handler(mq);
        mq.addEventListener("change", handler as EventListener);
        return () => mq.removeEventListener("change", handler as EventListener);
    }, []);

    // ── Inicialización ──
    useEffect(() => {
        if (variant === "detalle") {
            if (isMobile) {
                setWidgetState("minimized");
                return;
            }
            // Desktop detalle
            const slug = programa?.slug;
            if (!slug) { setWidgetState("minimized"); return; }
            const dismissed = sessionStorage.getItem(`ctl_widget_dismissed_${slug}`);
            if (dismissed) { setWidgetState("minimized"); return; }

            // Determinar mensajes
            let conContexto = false;
            try {
                const ctx = sessionStorage.getItem("ctl_orientador_ctx");
                if (ctx) JSON.parse(ctx); // valida que sea JSON válido
                conContexto = !!ctx;
            } catch { conContexto = false; }

            const msgs = buildDetalleMessages(programa!, conContexto);
            mensajesRef.current = msgs;
            setWidgetState("preview");
            setShowBubble(true);
            previewIndexRef.current = 0;
            setPreviewIndex(0);
        } else {
            // variant === "catalogo"
            if (isMobile) {
                setWidgetState("minimized");
                return;
            }
            const dismissed = sessionStorage.getItem("ctl_widget_dismissed_catalogo");
            if (dismissed) { setWidgetState("minimized"); return; }

            mensajesRef.current = CATALOGO_MESSAGES;
            setWidgetState("minimized"); // arranca minimizado, espera IntersectionObserver
        }
    }, [variant, isMobile, programa]);

    // ── IntersectionObserver para catalogo ──
    useEffect(() => {
        if (variant !== "catalogo" || isMobile) return;
        const anchor = document.getElementById("catalogo-grid-anchor");
        if (!anchor) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !hasTriggeredPreviewRef.current) {
                    hasTriggeredPreviewRef.current = true;
                    const dismissed = sessionStorage.getItem("ctl_widget_dismissed_catalogo");
                    if (dismissed) return;
                    // Esperar 10s antes de arrancar preview
                    setTimeout(() => {
                        if (sessionStorage.getItem("ctl_widget_dismissed_catalogo")) return;
                        setWidgetState("preview");
                        setShowBubble(true);
                        previewIndexRef.current = 0;
                        setPreviewIndex(0);
                    }, 10000);
                }
            },
            { threshold: 0.1 }
        );
        observerRef.current.observe(anchor);

        return () => observerRef.current?.disconnect();
    }, [variant, isMobile]);

    // ── Ciclo de mensajes de preview ──
    useEffect(() => {
        if (widgetState !== "preview" || isMobile) return;
        const msgs = mensajesRef.current;
        if (msgs.length === 0) return;

        const currentMsg = msgs[previewIndexRef.current];
        const duration = currentMsg.length >= 100 ? 15000 : 10000;

        // Mostrar burbuja
        setShowBubble(true);

        // Ocultar burbuja después de duration
        bubbleTimerRef.current = setTimeout(() => {
            setShowBubble(false);
        }, duration);

        // Después de duration + 10s oculta, mostrar siguiente
        cycleTimerRef.current = setTimeout(() => {
            setShowBubble(false);
            const next = (previewIndexRef.current + 1) % msgs.length;
            previewIndexRef.current = next;
            setPreviewIndex(next);
        }, duration + 10000);

        return () => {
            if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
            if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
        };
    }, [widgetState, previewIndex, isMobile]);

    // ── Cleanup timers on unmount ──
    useEffect(() => {
        return () => {
            if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
            if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
        };
    }, []);

    // ── Handlers ──
    const handleDismiss = useCallback(() => {
        if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
        if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
        setShowBubble(false);
        setWidgetState("minimized");
        if (variantRef.current === "detalle" && programaRef.current?.slug) {
            sessionStorage.setItem(`ctl_widget_dismissed_${programaRef.current.slug}`, "true");
        } else if (variantRef.current === "catalogo") {
            sessionStorage.setItem("ctl_widget_dismissed_catalogo", "true");
        }
    }, []);

    const handleBubbleClick = useCallback(() => {
        if (variantRef.current !== "detalle") return;
        if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
        if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
        setShowBubble(false);
        setWidgetState("open");
    }, []);

    const handleMinimizedClick = useCallback(() => {
        if (variantRef.current === "detalle") {
            setWidgetState("open");
        } else {
            // catalogo: mostrar toast
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        }
    }, []);

    const handleSendMessage = useCallback(async () => {
        const text = inputValue.trim();
        if (!text || !programaRef.current) return;

        const userMsg: MensajeChat = { role: "user", content: text };
        const newHistory = [...chatHistory, userMsg];
        setChatHistory(newHistory);
        setInputValue("");
        setChatLoading(true);

        const ctxProg: ContextoPrograma = {
            nombre: programaRef.current.nombre,
            universidad: programaRef.current.universidad,
            pais: programaRef.current.pais,
            costo_usd: programaRef.current.matricula,
            modalidad: programaRef.current.modalidad,
            nivel: programaRef.current.nivel,
            requisito_grado: programaRef.current.requisito_grado,
        };

        let ctxOrientador: ContextoOrientador | null = null;
        try {
            const raw = sessionStorage.getItem("ctl_orientador_ctx");
            if (raw) ctxOrientador = JSON.parse(raw);
        } catch { ctxOrientador = null; }

        try {
            const res = await consultarExperto(newHistory, ctxProg, ctxOrientador, turno);
            const assistantMsg: MensajeChat = { role: "assistant", content: res.mensaje };
            setChatHistory([...newHistory, assistantMsg]);
            setTurno((t) => t + 1);
            if (res.esTurnoFinal) {
                setEsTurnoFinal(true);
                setMensajeWhatsApp(res.mensajeWhatsApp);
            }
        } catch {
            const fallbackMsg: MensajeChat = { role: "assistant", content: "En este momento no puedo conectarme. Por favor, contáctanos directamente en WhatsApp y con gusto te asesoramos sobre este programa." };
            setChatHistory([...newHistory, fallbackMsg]);
        } finally {
            setChatLoading(false);
        }
    }, [inputValue, chatHistory, turno]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    // ── Render ──
    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
            {/* ── Toast para catalogo mobile ── */}
            {showToast && variant === "catalogo" && isMobile && (
                <div className="bg-[#0a0a0a] border border-yellow/30 rounded-2xl px-5 py-3 max-w-[280px] shadow-2xl animate-fade-in">
                    <p className="text-white/80 text-xs leading-relaxed">{CATALOGO_MESSAGES[0]}</p>
                </div>
            )}

            {/* ── Burbuja de preview ── */}
            {widgetState === "preview" && showBubble && !isMobile && (
                <div
                    onClick={handleBubbleClick}
                    className={`bg-[#0a0a0a] border border-yellow/30 rounded-2xl px-5 py-3.5 max-w-[280px] shadow-2xl relative ${variant === "detalle" ? "cursor-pointer" : "cursor-default"}`}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss();
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#0a0a0a] border border-yellow/30 rounded-full flex items-center justify-center cursor-pointer hover:border-yellow/60 transition-colors"
                    >
                        <X size={12} className="text-white/60" />
                    </button>
                    <p className="text-white/80 text-xs leading-relaxed">
                        {mensajesRef.current[previewIndex] ?? ""}
                    </p>
                </div>
            )}

            {/* ── Chat abierto (detalle, desktop) ── */}
            {widgetState === "open" && variant === "detalle" && (
                <div className="bg-[#0a0a0a] border border-yellow/30 rounded-2xl w-[340px] max-h-[500px] flex flex-col shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-yellow">
                            Consultor Experto
                        </span>
                        <button
                            onClick={() => setWidgetState("minimized")}
                            className="text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {chatHistory.map((msg, i) => (
                            <div
                                key={i}
                                className={`text-xs leading-relaxed rounded-xl px-3 py-2 max-w-[85%] ${msg.role === "user"
                                    ? "bg-yellow/10 text-white/90 ml-auto"
                                    : "bg-white/5 text-white/80 mr-auto"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="text-white/40 text-xs italic px-3 py-2">
                                Escribiendo...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-white/10">
                        {esTurnoFinal && mensajeWhatsApp ? (
                            <a
                                href={`https://wa.me/573005347644?text=${encodeURIComponent(mensajeWhatsApp)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-[#25D366] text-white font-bold text-xs py-2.5 rounded-full no-underline hover:bg-[#1ebe5d] transition-colors"
                            >
                                Contactar por WhatsApp
                            </a>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={esTurnoFinal}
                                    placeholder="Escribe tu mensaje..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-yellow/50"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || chatLoading}
                                    className="bg-yellow text-black font-bold text-xs px-4 py-2 rounded-full cursor-pointer hover:bg-yellow/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Enviar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Mobile chat (detalle) ── */}
            {widgetState === "open" && variant === "detalle" && isMobile && (
                <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-yellow">
                            Consultor Experto
                        </span>
                        <button
                            onClick={() => setWidgetState("minimized")}
                            className="text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {chatHistory.map((msg, i) => (
                            <div
                                key={i}
                                className={`text-sm leading-relaxed rounded-xl px-3 py-2 max-w-[85%] ${msg.role === "user"
                                    ? "bg-yellow/10 text-white/90 ml-auto"
                                    : "bg-white/5 text-white/80 mr-auto"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="text-white/40 text-sm italic px-3 py-2">
                                Escribiendo...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-white/10">
                        {esTurnoFinal && mensajeWhatsApp ? (
                            <a
                                href={`https://wa.me/573005347644?text=${encodeURIComponent(mensajeWhatsApp)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-[#25D366] text-white font-bold text-sm py-3 rounded-full no-underline hover:bg-[#1ebe5d] transition-colors"
                            >
                                Contactar por WhatsApp
                            </a>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={esTurnoFinal}
                                    placeholder="Escribe tu mensaje..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-yellow/50"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || chatLoading}
                                    className="bg-yellow text-black font-bold text-sm px-5 py-2.5 rounded-full cursor-pointer hover:bg-yellow/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Enviar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Botón minimizado (ícono) ── */}
            <button
                onClick={widgetState === "minimized" ? handleMinimizedClick : undefined}
                className={`w-12 h-12 bg-[#0a0a0a] border-2 border-yellow rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:border-yellow/70 transition-colors ${widgetState !== "minimized" ? "hidden" : ""}`}
            >
                <MessageCircle size={22} className="text-yellow" />
            </button>

            {/* Keyframes para toast fade-in */}
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}