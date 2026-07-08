// Archivo: src/lib/tracking.ts
// Utilidad centralizada para disparar eventos personalizados hacia el dataLayer de GTM.
// Si GTM no está instalado (variable de entorno vacía), esto no falla — dataLayer
// simplemente no existe y el push se ignora de forma segura.

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

export function trackEvent(nombre: string, datos: Record<string, unknown> = {}): void {
    if (typeof window === "undefined") return; // nunca correr en el servidor
    if (!window.dataLayer) return; // GTM no instalado, no hacer nada

    window.dataLayer.push({
        event: nombre,
        ...datos,
    });
}