// Archivo: src/lib/tracking.ts
// Utilidad centralizada para disparar eventos personalizados hacia el dataLayer de GTM.
// El dataLayer se inicializa como array vacío si aún no existe, para que los eventos
// disparados antes de que GTM termine de cargar queden en cola y no se pierdan.

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

export function trackEvent(nombre: string, datos: Record<string, unknown> = {}): void {
    if (typeof window === "undefined") return; // nunca correr en el servidor

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: nombre,
        ...datos,
    });
}