"use server";

// Archivo: src/app/actions/chatConsultor.ts
// Server Action: Chat Consultor Experto en Posgrados.
// Sistema de redundancia con failover: Gemini → DeepSeek → Fallback manual.

export interface MensajeChat {
    role: "user" | "assistant";
    content: string;
}

export interface ContextoPrograma {
    nombre: string;
    universidad: string;
    pais: string;
    costo_usd: number;
    modalidad: string;
    nivel: string;
    requisito_grado?: string;
}

export interface ContextoOrientador {
    area: string;
    objetivo: string;
    modalidad: string;
}

export interface RespuestaConsultor {
    mensaje: string;
    mensajeWhatsApp: string | null;
    esTurnoFinal: boolean;
}

/**
 * Consulta al experto en posgrados usando IA con failover Gemini → DeepSeek → Fallback.
 */
export async function consultarExperto(
    historial: MensajeChat[],
    contextoPrograma: ContextoPrograma,
    contextoOrientador: ContextoOrientador | null,
    turnoActual: number
): Promise<RespuestaConsultor> {
    const systemPrompt = buildSystemPrompt(contextoPrograma, contextoOrientador, turnoActual);
    const userPrompt = buildUserPrompt(historial);

    // ── 1. Intentar Gemini ──
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (geminiKey) {
        try {
            console.log("[Chat Consultor] Intentando Gemini...");
            const texto = await callGemini(geminiKey, systemPrompt, userPrompt);
            if (texto) return procesarRespuesta(texto, turnoActual);
        } catch (err) {
            console.warn("[Chat Consultor] Gemini falló:", err instanceof Error ? err.message : err);
        }
    }

    // ── 2. Failover: DeepSeek ──
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (deepseekKey) {
        try {
            console.log("[Chat Consultor] Intentando DeepSeek...");
            const texto = await callDeepSeek(deepseekKey, systemPrompt, historial);
            if (texto) return procesarRespuesta(texto, turnoActual);
        } catch (err) {
            console.warn("[Chat Consultor] DeepSeek falló:", err instanceof Error ? err.message : err);
        }
    }

    // ── 3. Fallback ──
    console.log("[Chat Consultor] Usando respuesta de fallback manual");
    return {
        mensaje: "En este momento no puedo conectarme. Por favor, contáctanos directamente en WhatsApp y con gusto te asesoramos sobre este programa.",
        mensajeWhatsApp: null,
        esTurnoFinal: false,
    };
}

// ═══════════════════════════════════════════════
//  PROVEEDORES DE IA
// ═══════════════════════════════════════════════

async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string | null> {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: fullPrompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 512,
                },
            }),
        }
    );

    if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Gemini ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callDeepSeek(apiKey: string, systemPrompt: string, historial: MensajeChat[]): Promise<string | null> {
    const messages = [
        { role: "system", content: systemPrompt },
        ...historial.map((m) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages,
            temperature: 0.7,
            max_tokens: 512,
        }),
    });

    if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`DeepSeek ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
}

// ═══════════════════════════════════════════════
//  UTILIDADES
// ═══════════════════════════════════════════════

function buildSystemPrompt(
    programa: ContextoPrograma,
    orientador: ContextoOrientador | null,
    turnoActual: number
): string {
    const costoStr = programa.costo_usd === 0
        ? 'Beca Completa / Convenio Pro Bono'
        : '$' + programa.costo_usd + ' USD';

    let prompt = `Eres un consultor experto en posgrados de educación en Latinoamérica del Directorio de Posgrados. Tu misión es orientar al usuario sobre el programa que está explorando, responder sus dudas con precisión y llevarlo naturalmente a tomar acción. Tono: profesional, directo y humano. Nunca uses bullet points. Máximo 120 palabras por respuesta. No inventes datos de programas fuera del contexto provisto.

Programa actual: ${programa.nombre} — ${programa.universidad}, ${programa.pais}.
Nivel: ${programa.nivel}. Modalidad: ${programa.modalidad}.
Costo: ${costoStr}.
Requisito de grado: ${programa.requisito_grado || 'No especificado'}.`;

    if (orientador) {
        prompt += `\n\nEl usuario viene del Orientador Vocacional. Su perfil: Área: ${orientador.area}. Objetivo: ${orientador.objetivo}. Modalidad: ${orientador.modalidad}.`;
    }

    prompt += `

Nunca asumas que el país donde el usuario ejerce profesionalmente es el mismo país del programa académico, a menos que el usuario lo haya confirmado explícitamente en la conversación. El país del programa (${programa.pais}) es solo el país de la universidad, no el del usuario.

Si el usuario aún no ha indicado en qué país ejerce profesionalmente y en cualquier turno pregunta algo relacionado con escalafón docente, requisitos de convalidación o beneficios salariales, antes de responder con datos específicos acláraselo brevemente y pregunta: "Para darte una respuesta exacta necesito saber en qué país ejerces profesionalmente — los escalafones varían bastante según el país." No respondas con cifras de escalafón hasta tener esa respuesta.

Cuando el usuario pregunte por salarios o escalafón, usa ÚNICAMENTE estos rangos de referencia y siempre incluye el disclaimer:

Colombia (Decreto 1278): Maestría → incremento estimado 25-40% sobre grado base. Entidad: mineducacion.gov.co
Ecuador (Escalafón Magisterio Nacional): Maestría → incremento estimado 20-30%. Entidad: educacion.gob.ec
Perú (Ley 29944): Maestría → incremento estimado 15-25%. Entidad: minedu.gob.pe
Chile (Ley 20.903): Posgrado → bonificaciones adicionales, incremento estimado 20-35%. Entidad: mineduc.cl
México (USICAMM): Maestría → mejora en tabulador, incremento estimado 15-30%. Entidad: sep.gob.mx
Argentina: Varía por provincia, incremento estimado 20-35%. Entidad: Ministerio de Educación provincial correspondiente.
Venezuela, Cuba y demás países: Los sistemas salariales docentes en estos países tienen alta variabilidad. No proporciones cifras — indica al usuario que consulte directamente con el Ministerio de Educación de su país.

DISCLAIMER OBLIGATORIO en cada respuesta sobre escalafón: "Estos son rangos de referencia históricos. Para el valor exacto según tu municipio, nivel y entidad territorial, consulta directamente en [dominio oficial del país]."

Si el usuario pregunta sobre financiamiento del posgrado, no especules. Indícale que consulte la página oficial del programa en la universidad. No menciones becas, créditos ni convenios que no estén en el contexto del programa.

A partir del turno 4, orienta sutilmente hacia el servicio de redacción de tesis de CTL. Menciona que la tesis es el verdadero reto del posgrado y que el servicio cuesta $862 USD para Maestrías y $1,500 USD para Doctorados.`;

    if (turnoActual >= 6) {
        prompt += `

En el turno ${turnoActual} (turno final), después de tu respuesta normal incluye OBLIGATORIAMENTE al final este bloque con el mensaje personalizado para WhatsApp:
[WA_MSG]Hola, me envía el Consultor Experto del Directorio de Posgrados. Consulté sobre ${programa.nombre} en ${programa.universidad}, ${programa.pais}. [RESUMEN_1_FRASE]. Me interesa el servicio de redacción de tesis.[/WA_MSG]

Reemplaza [RESUMEN_1_FRASE] con una frase que resuma el tema principal de la conversación.`;
    }

    if (turnoActual === 1) {
        prompt += `

Al final de tu respuesta en este primer turno, sin importar el tema que haya preguntado el usuario, agrega un salto de línea y cierra obligatoriamente con exactamente este texto:
"💡 **Tip:** Para darte información precisa sobre escalafón docente y requisitos según tu situación, cuéntame ¿en qué país ejerces o piensas ejercer profesionalmente?"`;
    }

    return prompt;
}

function buildUserPrompt(historial: MensajeChat[]): string {
    const lines = historial.map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`);
    return lines.join("\n\n");
}

function procesarRespuesta(texto: string, turnoActual: number): RespuestaConsultor {
    const waMatch = texto.match(/\[WA_MSG\]([\s\S]*?)\[\/WA_MSG\]/);
    const mensajeWhatsApp = waMatch ? waMatch[1].trim() : null;
    const mensajeLimpio = texto.replace(/\[WA_MSG\][\s\S]*?\[\/WA_MSG\]/, "").trim();

    return {
        mensaje: mensajeLimpio,
        mensajeWhatsApp,
        esTurnoFinal: turnoActual >= 6,
    };
}