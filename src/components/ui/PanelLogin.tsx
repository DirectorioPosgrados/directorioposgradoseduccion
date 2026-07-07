"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginPanel } from "@/app/actions/panelAuth";

export default function PanelLogin() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario.trim() || !password.trim()) {
            setError("Completa ambos campos.");
            return;
        }
        setEnviando(true);
        setError(null);
        try {
            const result = await loginPanel(usuario.trim(), password.trim());
            if (result.ok) {
                router.refresh();
            } else {
                setError(result.message ?? "Error al iniciar sesión.");
            }
        } catch {
            setError("Error inesperado.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-bg flex items-center justify-center px-4">
            <div className="bg-[#0a0a0a] border border-yellow/30 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                <span className="text-[10px] font-bold tracking-widest text-yellow uppercase mb-4 block">
                    ✦ PANEL CTL — TARIFAS
                </span>
                <h2 className="text-xl font-bold text-white mb-6">
                    Iniciar sesión
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-yellow/50 mb-3"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-yellow/50 mb-3"
                    />
                    {error && (
                        <p className="text-red-400 text-xs mb-3">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full bg-yellow text-black font-bold text-sm py-3 rounded-full hover:bg-yellow/90 transition-all"
                    >
                        {enviando ? "Verificando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}