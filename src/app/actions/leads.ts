"use server";

import { createClient } from '@supabase/supabase-js'

interface LeadData {
    nombre: string
    apellido: string
    telefono: string
    correo: string
    pais: string
}

export async function submitLead(
    data: LeadData
): Promise<{ ok: boolean; message?: string }> {
    try {
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { error } = await supabase
            .from('leads')
            .upsert(
                {
                    nombre: data.nombre.trim(),
                    apellido: data.apellido.trim(),
                    telefono: data.telefono.trim(),
                    correo: data.correo.trim().toLowerCase(),
                    pais: data.pais,
                },
                { onConflict: 'correo' }
            )

        if (error) {
            console.error('[Leads] Error:', error.message)
            return { ok: false, message: "Hubo un error al registrar tus datos. Intenta de nuevo." }
        }

        return { ok: true }
    } catch {
        return { ok: false, message: "Error inesperado. Intenta de nuevo." }
    }
}