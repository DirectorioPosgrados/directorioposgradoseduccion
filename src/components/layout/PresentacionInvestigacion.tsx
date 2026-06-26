// Archivo: src/components/layout/PresentacionInvestigacion.tsx
// Bloque de presentación de la investigación del Directorio 2026.
// Texto extraído de la introducción general del documento Word del cliente.

export function PresentacionInvestigacion() {
    return (
        <section className="bg-gray-bg px-10 py-12 max-sm:px-5 max-sm:py-8">
            <div className="max-w-[900px] mx-auto text-white/80 text-base leading-relaxed space-y-5">
                <p>
                    Sabemos perfectamente por qué estás aquí. Como profesional de la educación, tu objetivo no es solo coleccionar diplomas; buscas ascender en el escalafón docente, mejorar tus ingresos salariales y asegurar tu estabilidad laboral. Pero lograrlo mientras lidias con la carga de planificar clases, calificar y atender a la comunidad educativa parece una misión imposible, especialmente cuando buscar el posgrado adecuado es tan frustrante.
                </p>

                <p>
                    ¿Te preocupa endeudarse por años? ¿Temes elegir un programa que tu Ministerio de Educación no convalide? ¿O te preocupa la idea de quedarte estancado tres años redactando una tesis que retrase tu aumento de sueldo?
                </p>

                <p>
                    Para resolver estas dudas, hemos creado la radiografía más exhaustiva de la oferta de posgrados en educación en América Latina. Auditamos <strong className="text-yellow font-semibold">357 programas activos</strong> (maestrías y doctorados) en <strong className="text-yellow font-semibold">18 países</strong> para entregarte la información que las universidades suelen ocultar. Hemos identificado los costos reales, las duraciones exactas y los métodos de graduación de cada institución.
                </p>

                <p className="border-l-2 border-yellow pl-4 italic text-white/60">
                    ¿Sabías que puedes cursar una maestría o un doctorado 100% virtual, totalmente oficial y convalidable en tu país, pagando hasta un <strong className="text-yellow font-semibold not-italic">80% menos</strong> si miras hacia otras naciones de la región? ¿O que existen programas exprés de <strong className="text-yellow font-semibold not-italic">12 meses</strong> donde te gradúas con un proyecto aplicado al aula en lugar de una interminable tesis teórica?
                </p>

                <p className="text-white/90 font-semibold">
                    Tu próximo ascenso salarial está a un clic de distancia. Explora la lista de países a continuación y descubre el posgrado que se ajuste a tu presupuesto, tus horarios y tu proyección profesional.
                </p>
            </div>
        </section>
    );
}