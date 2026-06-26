// Archivo: src/lib/constants/insightsMexico.ts
// Insights de Oro por nivel académico para todos los países — Extraídos del documento Word.
// Formato: negritas con emojis del documento original para aspecto premium y scannable.

export interface InsightItem {
    titulo: string;
    contenido: string;
}

export interface InsightsNivel {
    maestria: InsightItem[];
    doctorado: InsightItem[];
}

export const INSIGHTS_POR_PAIS: Record<string, InsightsNivel> = {
    México: {
        maestria: [
            { titulo: "🏆 Contraste de costos (18,500x)", contenido: "El CINVESTAV ofrece la maestría más barata ($1 USD) frente a la Universidad Panamericana ($18,738 USD). Otras opciones económicas son la UPN ($170 USD) y la UAEM ($226 USD)." },
            { titulo: "⚡ Titulación exprés (16 meses)", contenido: "La Maestría en Innovación Educativa de la Universidad Cuauhtémoc es la más rápida y económica ($2,267 USD). UNIR México le sigue con 18 meses." },
            { titulo: "📝 Tesis obligatoria (83.3%)", contenido: "20 de 24 maestrías la exigen. Solo Iberoamericana, Tec de Monterrey, Valle y La Salle permiten titularse con Proyecto (16.7%), mientras que la UPN ofrece el Artículo académico como ruta práctica." },
        ],
        doctorado: [
            { titulo: "🏆 Doctorados de élite por $1 USD", contenido: "El CINVESTAV y la UNAM ofrecen los programas más prestigiosos y accesibles del país por solo $1 USD. Esto contrasta con el Doctorado en Educación de la Universidad de Guadalajara, el más costoso con un valor de $8,540 USD." },
            { titulo: "⚡ Doctorado en 2 años", contenido: "Las opciones más rápidas en México son los doctorados en Educación de Universidad Santander, UBC y UTEL (24 meses). Al durar la mitad que un programa tradicional (48 meses), son la ruta ideal para una aceleración profesional inmediata." },
            { titulo: "📝 Tesis obligatoria en el 83.3%", contenido: "15 de 18 doctorados la exigen. Solo UNAM, Santander y La Salle permiten proyectos alternativos. La Universidad de Baja California destaca al ofrecer el Artículo académico como opción estratégica para investigadores activos." },
        ],
    },
    Honduras: {
        maestria: [
            { titulo: "💰 Precio único y estandarizado", contenido: "Todas las maestrías en Honduras tienen exactamente el mismo precio: $1,217 USD. La UPNFM es el único proveedor de maestrías en educación del país." },
            { titulo: "🏛️ Monopolio académico de la UPNFM", contenido: "El 100% de las maestrías son ofrecidas por una sola institución, la referencia obligada para quien busca formarse en educación en el país centroamericano." },
            { titulo: "📝 Tesis obligatoria sin excepciones", contenido: "El 100% de los programas exigen tesis como único requisito de grado. No existen alternativas flexibles como artículo o proyecto." },
        ],
        doctorado: [
            { titulo: "🏆 Rango de precios muy competitivo", contenido: "Doctorados desde $2,500 USD (UNAH) hasta $4,377 USD (UPNFM). Honduras ofrece los doctorados en educación más baratos de Centroamérica." },
            { titulo: "⚡ Doctor en solo 2 años", contenido: "El Doctorado en Ciencias de la Educación de la UNAH tiene una duración récord de 24 meses, uno de los más veloces de toda Latinoamérica." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todos los doctorados exigen tesis como único requisito de grado. No hay alternativas de proyecto o artículo disponibles en el país." },
        ],
    },
    "El Salvador": {
        maestria: [
            { titulo: "💰 Rango de precios compacto y accesible", contenido: "Maestría más económica: UES ($3,034 USD). Más costosa: Don Bosco ($5,320 USD). Diferencia de apenas $2,286 USD." },
            { titulo: "🌐 Dominio absoluto de la modalidad Híbrida (83%)", contenido: "5 de 6 maestrías son híbridas y solo 1 es completamente virtual. No existe ninguna maestría 100% presencial." },
            { titulo: "📝 Única alternativa sin tesis", contenido: "La Maestría en Educación Virtual de la Universidad Francisco Gavidia es la única que permite titularse mediante Proyecto ($3,300 USD, 100% virtual)." },
        ],
        doctorado: [
            { titulo: "🏛️ Monopolio doctoral de la universidad pública", contenido: "El Salvador cuenta con un único doctorado en educación, ofrecido exclusivamente por la UES." },
            { titulo: "💵 Precio premium para la región", contenido: "$8,203 USD, significativamente más caro que Honduras ($2,500-$4,377 USD) pero competitivo con México." },
            { titulo: "⏳ Formato tradicional de 4 años", contenido: "48 meses sin opciones aceleradas. Para titulación doctoral más rápida, considerar opciones internacionales." },
        ],
    },
    Nicaragua: {
        maestria: [
            { titulo: "💰 Brecha de precios significativa", contenido: "Desde $890 USD (UNAN-Managua) hasta $6,000 USD (URACCAN). Diferencia de casi 7x entre la más barata y la más cara." },
            { titulo: "🌐 Diversidad de modalidades", contenido: "60% híbridas, 20% virtual, 20% presencial. Flexibilidad para distintos perfiles de estudiantes." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todas las maestrías exigen tesis, sin alternativas de proyecto o artículo." },
        ],
        doctorado: [
            { titulo: "💵 Rango de precios competitivo", contenido: "Desde $4,150 USD (Universidad Americana) hasta $6,000 USD (URACCAN). Doctorados accesibles en la región." },
            { titulo: "⚡ Opción acelerada", contenido: "El Doctorado en Educación Intercultural de URACCAN dura 36 meses, 1 año menos que el doctorado tradicional de 48 meses." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Ambos doctorados requieren tesis como único requisito de titulación." },
        ],
    },
    "Costa Rica": {
        maestria: [
            { titulo: "💰 Brecha de precios extrema", contenido: "Desde $95 USD (UCR) hasta $7,433 USD (Hispanoamericana). Diferencia de casi 80x, democratizando el acceso a todos los perfiles." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestría en Administración Educativa de la Universidad Americana: solo 16 meses. Varias opciones de 17-18 meses." },
            { titulo: "📝 Alternativas a la tesis", contenido: "26.7% de las maestrías permiten titularse mediante proyecto. Universidad Latina, UNA y UNED lideran esta flexibilidad." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado público casi gratuito", contenido: "UCR: $132 USD (virtual, 48 meses). Más caro: Universidad Católica de Costa Rica ($15,941 USD). Diferencia de más de 120x." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorado en Ciencias de la Educación de la Universidad Católica de Costa Rica: 28 meses, la vía más rápida." },
            { titulo: "📝 Alternativas a la tesis", contenido: "28.6% de los doctorados permiten titularse mediante artículo. Destacan Universidad Internacional San Isidro Labrador y Universidad Católica." },
        ],
    },
    Panamá: {
        maestria: [
            { titulo: "💰 Rango de precios muy accesible", contenido: "Desde $1,140 USD (Universidad de Panamá) hasta $3,623 USD (UTP). Uno de los países con maestrías más homogéneas en precio." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestrías de la Universidad Latina de Panamá: 14 meses. Ruta más rápida para ascenso docente." },
            { titulo: "📝 Alternativas a la tesis", contenido: "18% permite titularse mediante proyecto o artículo: UIP (Proyecto) y UTP (Artículo)." },
        ],
        doctorado: [
            { titulo: "💵 Doctorados públicos ultra accesibles", contenido: "Universidad de Panamá: $1,120 USD (presencial, 36 meses). Más caro: Universidad del Istmo ($4,600 USD virtual)." },
            { titulo: "⚡ Duración estándar y flexibilidad virtual", contenido: "Todos los doctorados duran 36 meses. Solo uno es completamente virtual (Universidad del Istmo)." },
            { titulo: "📝 Alternativas a la tesis", contenido: "33% permite titularse mediante artículo además de tesis (Universidad de Panamá)." },
        ],
    },
    "República Dominicana": {
        maestria: [
            { titulo: "💰 Brecha de precios notable", contenido: "Desde $1,012 USD (UTESA) hasta $11,165 USD (UAPA). Diferencia de más de 11x." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestrías de UTESA: solo 16 meses. Ideales para avanzar rápidamente." },
            { titulo: "📝 Alternativas a la tesis", contenido: "Solo 7.1% permite titularse mediante proyecto (Universidad Iberoamericana). El resto exige tesis." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado de élite y accesible", contenido: "Desde $2,650 USD (UFHEC) hasta $16,514 USD (UASD). Diferencia de más de 6x." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorado en Ciencias de la Educación de UFHEC: 28 meses, la vía más rápida." },
            { titulo: "📝 Alternativas a la tesis", contenido: "40% permite titularse mediante proyecto o artículo: Instituto Pedro Poveda (Proyecto) y UFHEC (Artículo)." },
        ],
    },
    Cuba: {
        maestria: [
            { titulo: "💰 Educación pública sin precios publicados", contenido: "Ninguna maestría reporta precio, sugiriendo subsidio estatal o gratuidad para nacionales. Ventaja competitiva regional." },
            { titulo: "⏳ Duración homogénea", contenido: "Todas las maestrías tienen duración estándar de 24 meses, facilitando la planificación académica." },
            { titulo: "📝 Tesis como requisito predominante", contenido: "Práctica común que todas las maestrías exijan tesis. No se reportan alternativas como proyecto o artículo." },
        ],
        doctorado: [
            { titulo: "💵 Educación doctoral sin costo publicado", contenido: "Refuerza la política de gratuidad o subsidio estatal en la educación superior cubana." },
            { titulo: "⏳ Duración uniforme", contenido: "Todos los doctorados tienen duración de 48 meses, siguiendo el estándar internacional." },
            { titulo: "📝 Tesis como requisito universal", contenido: "La tesis es el requisito de titulación predominante. No se reportan alternativas como proyecto o artículo." },
        ],
    },
    "Puerto Rico": {
        maestria: [
            { titulo: "💰 Brecha de precios considerable", contenido: "Desde $1,250 USD (UPR) hasta $8,500 USD (Interamericana). Diferencia de casi 7x." },
            { titulo: "⚡ Titulación exprés", contenido: "National University College: 12 meses con opción de titulación por proyecto. Ideal para avanzar rápidamente." },
            { titulo: "📝 Flexibilidad en requisitos de grado", contenido: "27% permite titularse mediante proyecto o artículo. Destacan Carlos Albizu University (Artículo, Tesis, Proyecto)." },
        ],
        doctorado: [
            { titulo: "💵 Rango de precios competitivo", contenido: "Desde $3,580 USD (Ana G. Méndez) hasta $5,553 USD (UPR). Doctorados accesibles y homogéneos en precio." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorados de la Universidad Ana G. Méndez: 36 meses, tanto virtual como presencial." },
            { titulo: "📝 Alternativas a la tesis", contenido: "75% de los doctorados permite titularse mediante proyecto. Puerto Rico rompe el cuello de botella de la tesis obligatoria." },
        ],
    },
    Venezuela: {
        maestria: [
            { titulo: "💰 Brecha de precios muy baja", contenido: "Desde $320 USD (UPEL) hasta $3,250 USD (URBE). Venezuela tiene las maestrías más accesibles de la región." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestría en Educación (Psicopedagogía) de la Universidad Rafael Urdaneta: 18 meses." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todas las maestrías exigen tesis, sin alternativas de proyecto o artículo." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado público ultra accesible", contenido: "UCV: $600 USD. Más caro: Universidad Fermín Toro ($2,955 USD). Venezuela tiene los doctorados más accesibles de la región." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorados más rápidos: UCAB y Universidad del Zulia (36 meses)." },
            { titulo: "📝 Alternativas a la tesis", contenido: "28.6% permite titularse mediante artículo: Universidad Fermín Toro y URBE." },
        ],
    },
    Colombia: {
        maestria: [
            { titulo: "💰 Brecha de precios extrema", contenido: "Desde $1,593 USD (La Salle) hasta $26,542 USD (Córdoba). Diferencia de más de 16x." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestría en Pedagogía de la Universidad Santo Tomás: solo 12 meses. Varias opciones de 18 meses." },
            { titulo: "📝 Alternativas a la tesis", contenido: "10.7% permite titularse mediante proyecto o artículo: La Salle (Proyecto) y Uninorte (Artículo, Tesis)." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado público más accesible", contenido: "Universidad de La Salle: $3,985 USD. Más caro: Pontificia Universidad Javeriana ($45,896 USD). Diferencia de más de 11x." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorados más rápidos: UdeA, Unisimón, Católica de Manizales y UTP (36 meses)." },
            { titulo: "📝 Alternativas a la tesis", contenido: "41% permite titularse mediante artículo: UPTC, UdeA, UPN, Univalle y Uniandes. Priorizan visibilidad internacional." },
        ],
    },
    Ecuador: {
        maestria: [
            { titulo: "💰 Rango de precios compacto", contenido: "Desde $2,320 USD (UTPL) hasta $5,500 USD (Universidad del Azuay). Diferencia de solo 2.4x." },
            { titulo: "⚡ Titulación exprés", contenido: "La mayoría de las maestrías duran 12 meses. Ecuador permite obtener el grado en solo 1 año." },
            { titulo: "📝 Alternativas a la tesis", contenido: "15.8% permite titularse mediante artículo: Universidad Técnica de Machala y ULEAM." },
        ],
        doctorado: [
            { titulo: "💵 Rango de precios competitivo", contenido: "Desde $7,890 USD (UTEG) hasta $10,772 USD (UNAE). Diferencia de solo 1.4x, doctorados homogéneos en precio." },
            { titulo: "⏳ Duración estándar", contenido: "Todos los doctorados duran 48 meses, siguiendo el estándar internacional." },
            { titulo: "📝 Alternativas a la tesis", contenido: "25% permite titularse mediante artículo: Universidad Nacional de Educación." },
        ],
    },
    Perú: {
        maestria: [
            { titulo: "💰 Brecha de precios muy amplia", contenido: "Desde $285 USD (UNE) hasta $12,058 USD (PUCP). Diferencia de más de 42x." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestrías más rápidas: UCV, Científica del Sur, San Martín de Porres, USIL y Cayetano Heredia (12-13 meses)." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todas las maestrías exigen tesis, sin alternativas de proyecto o artículo." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado público ultra accesible", contenido: "UNE: $2,047 USD. Más caro: PUCP ($10,280 USD). Doctorados accesibles y homogéneos." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorado en Ciencias de la Educación de la UNE: 24 meses. El resto dura 36 meses." },
            { titulo: "📝 Alternativas a la tesis", contenido: "22% permite titularse mediante artículo: USIL y PUCP priorizando visibilidad internacional." },
        ],
    },
    Bolivia: {
        maestria: [
            { titulo: "💰 Rango de precios muy accesible", contenido: "Desde $607 USD (UCB) hasta $3,300 USD (UASB). Uno de los países con maestrías más accesibles de la región." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestrías más rápidas: UASB y UCB (18 meses). El resto dura 24 meses." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todas las maestrías exigen tesis, sin alternativas de proyecto o artículo." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado público ultra accesible", contenido: "UPEA: $2,210 USD. Más caro: FUNIBER Bolivia ($6,230 USD). Diferencia de solo 2.8x." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorado en Educación Superior de la UPEA: 18 meses, rompiendo esquemas tradicionales." },
            { titulo: "📝 Alternativas a la tesis", contenido: "25% permite titularse mediante proyecto: UPEA. Rareza estratégica para líderes educativos enfocados en la práctica." },
        ],
    },
    Chile: {
        maestria: [
            { titulo: "💰 Brecha de precios considerable", contenido: "Desde $1,538 USD (UDD) hasta $12,760 USD (UdeC). Diferencia de más de 8x." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestría en Educación Inclusiva de la UDD: solo 14 meses. La mayoría dura 18-24 meses." },
            { titulo: "📝 Alternativas a la tesis", contenido: "55% permite titularse mediante proyecto. Chile es líder en modernización de requisitos de grado." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado de élite y récord de precio", contenido: "Desde $4,655 USD (UCSC) hasta $104,049 USD (UNAB). Chile tiene el doctorado más caro de toda Latinoamérica." },
            { titulo: "⚡ Opción acelerada", contenido: "Doctorado en Educación y Sociedad de la UNAB: 28 meses. El resto dura 36-48 meses." },
            { titulo: "📝 Alternativas a la tesis", contenido: "22% permite titularse mediante artículo: PUC y PUCV priorizando el impacto y la visibilidad internacional." },
        ],
    },
    Uruguay: {
        maestria: [
            { titulo: "💰 Brecha de precios extrema", contenido: "Desde $1 USD (Udelar, prácticamente gratuita) hasta $9,600 USD (FLACSO). Diferencia de más de 9,500x." },
            { titulo: "⚡ Duración homogénea", contenido: "Todas las maestrías duran 24 meses, facilitando la planificación académica." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todas las maestrías exigen tesis, sin alternativas de proyecto o artículo." },
        ],
        doctorado: [
            { titulo: "💵 Rango de precios compacto", contenido: "Desde $3,900 USD (CLAEH) hasta $5,240 USD (ORT). Diferencia de solo 1.3x, doctorados muy homogéneos." },
            { titulo: "⚡ Duración estándar", contenido: "Todos los doctorados duran 36 meses (3 años)." },
            { titulo: "📝 Alternativas a la tesis", contenido: "67% permite titularse mediante artículo: Universidad ORT y Universidad de la Empresa." },
        ],
    },
    Paraguay: {
        maestria: [
            { titulo: "💰 Rango de precios muy accesible", contenido: "Desde $870 USD (INAES) hasta $3,210 USD (Universidad Católica). Diferencia de $2,340 USD." },
            { titulo: "⚡ La ruta express de 14 meses", contenido: "Universidad Americana: maestrías más rápidas del país (14 meses), 100% virtuales a $1,300 USD." },
            { titulo: "📝 Requisitos de titulación", contenido: "91% exige Tesis. Solo UNA permite Proyecto y la Universidad Autónoma de Asunción combina Tesis + Artículo." },
        ],
        doctorado: [
            { titulo: "🎯 Doctorado récord en costo", contenido: "INAES: $870 USD por un doctorado completo virtual de 24 meses. La opción más disruptiva del mercado latinoamericano." },
            { titulo: "⏱️ Tiempo de titulación", contenido: "INAES e Iberoamericana: 24 meses. Universidad Americana: apenas 18 meses. La mayoría mantiene 36 meses." },
            { titulo: "🔒 Barrera de la tesis", contenido: "100% de los doctorados exigen Tesis obligatoria. Universidad Nihon Gakko eleva la exigencia a Tesis + Artículo científico." },
        ],
    },
    Argentina: {
        maestria: [
            { titulo: "💰 Brecha de precios muy baja", contenido: "Desde $1 USD (UNIPE, prácticamente gratuita) hasta $8,000 USD (Di Tella). La mayoría pública por debajo de $2,000 USD." },
            { titulo: "⚡ Titulación exprés", contenido: "Maestrías más rápidas: UNLP (15 meses). El resto dura 24 meses, salvo UNC (36 meses)." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todas las maestrías exigen tesis, sin alternativas de proyecto o artículo." },
        ],
        doctorado: [
            { titulo: "💵 Doctorado público ultra accesible", contenido: "Universidad del Salvador: $931 USD. Más caro: Universidad de San Andrés ($28,453 USD). Diferencia de 30x." },
            { titulo: "⏳ Duración estándar", contenido: "Todos los doctorados duran 48 meses, siguiendo el estándar internacional." },
            { titulo: "📝 Tesis obligatoria en el 100%", contenido: "Todos los doctorados exigen tesis, sin alternativas de proyecto o artículo." },
        ],
    },
};