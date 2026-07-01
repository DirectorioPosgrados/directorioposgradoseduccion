import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Set global para deduplicación de slugs ────────────────
const slugsUsados = new Set()

/**
 * Genera un slug único a partir de los campos del programa.
 * Si el slug ya existe, agrega sufijo -2, -3, etc.
 */
function generarSlug(nombre, universidad, pais, enfoque, modalidad) {
    const base = `${nombre} ${universidad} ${pais} ${enfoque} ${modalidad}`
    let slug = base
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')

    // Deduplicación
    let candidato = slug
    let contador = 2
    while (slugsUsados.has(candidato)) {
        candidato = `${slug}-${contador}`
        contador++
    }
    slugsUsados.add(candidato)
    return candidato
}

/**
 * Convierte el string del CSV 'Costo Total USD' a número.
 * Ej: '$3500,00' → 3500
 * Ej: '$107,00' → 107
 * Retorna null si no se puede parsear.
 */
function limpiarCostoUSD(valor) {
    if (!valor || typeof valor !== 'string') return null
    const limpio = valor
        .replace(/\$/g, '')
        .trim()
        .replace(',', '.')
    const num = parseFloat(limpio)
    return isNaN(num) ? null : num
}

// ── Leer y parsear el CSV ─────────────────────────────────
const contenido = readFileSync('data/programas.csv', 'utf-8')
const filas = parse(contenido, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
})

// Filtrar filas con 'Nombre del Programa' vacío
const filasValidas = filas.filter((fila) => {
    const nombre = fila['Nombre del Programa']
    return nombre && nombre.trim() !== ''
})

const total = filasValidas.length

// ── Mapeo de cada fila a objeto Supabase ──────────────────
const registros = filasValidas.map((fila) => ({
    id_programa: fila['ID Programa']?.trim() || null,
    nombre: fila['Nombre del Programa'].trim(),
    universidad: fila['Universidad']?.trim() || null,
    tipo_institucion: fila['Tipo de Institución']?.trim() || null,
    pais: fila['País']?.trim() || null,
    nivel: fila['Nivel']?.trim() || null,
    enfoque_programa: fila['Enfoque del Programa']?.trim() || null,
    modalidad: fila['Modalidad']?.trim() || null,
    duracion: parseInt(fila['Duración (Meses)']) || null,
    costo_usd: limpiarCostoUSD(fila['Costo Total USD']),
    url_programa: fila['URL del Programa']?.trim() || null,
    requisito_grado: fila['Requisito de Grado']?.trim() || null,
    convalidable: fila['Convalidable Internacionalmente']?.trim() || null,
    slug: generarSlug(
        fila['Nombre del Programa'],
        fila['Universidad'],
        fila['País'],
        fila['Enfoque del Programa'] || '',
        fila['Modalidad'] || '',
    ),
}))

// ── Inserción en lotes ────────────────────────────────────
const TAMANIO_LOTE = 50
const totalLotes = Math.ceil(registros.length / TAMANIO_LOTE)
let insertados = 0

for (let i = 0; i < registros.length; i += TAMANIO_LOTE) {
    const lote = registros.slice(i, i + TAMANIO_LOTE)
    const numLote = Math.floor(i / TAMANIO_LOTE) + 1
    const desde = i + 1
    const hasta = Math.min(i + TAMANIO_LOTE, registros.length)

    const { error } = await supabase
        .from('directorio_posgrados')
        .insert(lote)

    if (error) {
        console.error(`Error en lote ${numLote}/${totalLotes}: ${error.message}`)
    } else {
        insertados += lote.length
        console.log(`Lote ${numLote}/${totalLotes} insertado correctamente (registros ${desde}–${hasta})`)
    }
}

console.log(`\nMigración completa: ${insertados} registros procesados de ${total} en CSV`)