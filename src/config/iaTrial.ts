// Archivo: src/config/iaTrial.ts
// Fuente única de verdad para el vencimiento de la cortesía de 15 días de IA.
// Cubre: Orientador Vocacional, Chat Consultor Experto, y cualquier módulo futuro de IA.

export const IA_TRIAL_DEADLINE = new Date("2026-07-24T23:59:59-05:00");

/**
 * Retorna true si la cortesía de 15 días de IA ya venció.
 * Usable tanto en Server Components como en Client Components (JS puro, sin dependencias de servidor).
 */
export function estaVencidaPruebaIA(): boolean {
    return new Date() > IA_TRIAL_DEADLINE;
}