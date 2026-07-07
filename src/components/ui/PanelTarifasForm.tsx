"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { actualizarTarifas } from "@/app/actions/tarifas";
import { logoutPanel } from "@/app/actions/panelAuth";
import type { Tarifas } from "@/lib/services/supabase";

interface Props {
    tarifasIniciales: Tarifas;
}

export default function PanelTarifasForm({ tarifasIniciales }: Props) {
    const [trmCop, setTrmCop] = useState(String(tarifasIniciales.trmCop));
    const [precioMaestriaCop, setPrecioMaestriaCop] = useState(String(tarifasIniciales.precioMaestriaCop));
    const [precioDoctoradoCop, setPrecioDoctoradoCop] = useState(String(tarifasIniciales.precioDoctoradoCop));
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [guardando, setGuardando] = useState(false);
    const router = useRouter();

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        const trm = Number(trmCop);
        const maestria = Number(precioMaestriaCop);
        const doctorado = Number(precioDoctoradoCop);

        if (!trm || !maestria || !doctorado || trm <= 0 || maestria <= 0 || doctorado <= 0) {
            setError("Todos los campos deben ser números mayores a 0.");
            return;
        }

        setGuardando(true);
        setError(null);
        setMensaje(null);

        const result = await actualizarTarifas({
            trmCop: trm,
            precioMaestriaCop: maestria,
            precioDoctoradoCop: doctorado,
        });

        if (result.ok) {
            setMensaje("Tarifas actualizadas correctamente. Los cambios ya están reflejados en el sitio.");
            router.refresh();
        } else {
            setError(result.message ?? "Error al actualizar.");
        }

        setGuardando(false);
    };

    const handleLogout = async () => {
        await logoutPanel();
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-bg flex items-center justify-center px-4">
            <div className="bg-[#0a0a0a] border border-yellow/30 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold tracking-widest text-yellow uppercase">
                        ✦ PANEL CTL — TARIFAS
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none underline"
                    >
                        Cerrar sesión
                    </button>
                </div>

                <h2 className="text-xl font-bold text-white mb-6">
                    Actualizar tarifas
                </h2>

                <form onSubmit={handleGuardar}>
                    <div className="mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                            TRM (COP por 1 USD)
                        </label>
                        <input
                            type="number"
                            value={trmCop}
                            onChange={(e) => setTrmCop(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow/50"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                            Precio Maestría (COP)
                        </label>
                        <input
                            type="number"
                            value={precioMaestriaCop}
                            onChange={(e) => setPrecioMaestriaCop(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow/50"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-yellow mb-2">
                            Precio Doctorado (COP)
                        </label>
                        <input
                            type="number"
                            value={precioDoctoradoCop}
                            onChange={(e) => setPrecioDoctoradoCop(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow/50"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs mb-3">{error}</p>
                    )}
                    {mensaje && (
                        <p className="text-green-400 text-xs mb-3">{mensaje}</p>
                    )}

                    <button
                        type="submit"
                        disabled={guardando}
                        className="w-full bg-yellow text-black font-bold text-sm py-3 rounded-full hover:bg-yellow/90 transition-all"
                    >
                        {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </form>
            </div>
        </div>
    );
}