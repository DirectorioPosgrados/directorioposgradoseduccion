"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

interface NuevasTarifas {
    trmCop: number;
    precioMaestriaCop: number;
    precioDoctoradoCop: number;
}

export async function actualizarTarifas(
    data: NuevasTarifas
): Promise<{ ok: boolean; message?: string }> {
    try {
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabase
            .from('tarifas_tesis')
            .update({
                trm_cop: data.trmCop,
                precio_maestria_cop: data.precioMaestriaCop,
                precio_doctorado_cop: data.precioDoctoradoCop,
                updated_at: new Date().toISOString(),
            })
            .eq('id', 1);

        if (error) {
            console.error('[Tarifas] Error:', error.message);
            return { ok: false, message: "No se pudo actualizar. Intenta de nuevo." };
        }

        revalidatePath('/');
        revalidatePath('/programas/[slug]', 'layout');

        return { ok: true };
    } catch {
        return { ok: false, message: "Error inesperado." };
    }
}