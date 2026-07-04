// Archivo: scripts/verificar-nivel.mjs
// Script temporal de diagnóstico — solo lectura.
// Verifica el valor exacto de la columna `nivel` para 2 registros específicos.

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUSQUEDAS = [
    { texto: '%Ciencias de la Educación%', descripcion: 'Ciencias de la Educación (Universidad Autónoma Juan Misael Saracho)' },
]

async function main() {
    for (const b of BUSQUEDAS) {
        console.log(`\n─── Buscando: ${b.descripcion} ───`)

        const { data, error } = await supabase
            .from('directorio_posgrados')
            .select('id, nombre, universidad, pais, nivel')
            .ilike('nombre', b.texto)

        if (error) {
            console.error(`  Error al consultar: ${error.message}`)
            continue
        }

        if (!data || data.length === 0) {
            console.log(`  No se encontró ningún registro que coincida con "${b.texto}".`)
            continue
        }

        console.log(`  ${data.length} resultado(s):`)
        for (const row of data) {
            console.log(`  - id: ${row.id}`)
            console.log(`    nombre: ${row.nombre}`)
            console.log(`    universidad: ${row.universidad}`)
            console.log(`    pais: ${row.pais}`)
            console.log(`    nivel: "${row.nivel}"`)
        }
    }

    console.log('\nDiagnóstico completado.')
}

main().catch((err) => {
    console.error('Error fatal:', err.message)
    process.exit(1)
})