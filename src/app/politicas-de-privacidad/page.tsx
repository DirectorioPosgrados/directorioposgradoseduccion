// Archivo: src/app/politicas-de-privacidad/page.tsx
// Página estática de Política de Privacidad. Describe qué datos se recolectan,
// las herramientas de terceros utilizadas (GA4, Clarity, Meta Pixel condicional),
// y los derechos del usuario sobre su información personal.

import { Header } from "@/components/layout/Header";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function PoliticasDePrivacidadPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-bg px-10 py-16 max-sm:px-5 max-sm:py-10">
                <div className="max-w-[800px] mx-auto text-white">
                    <h1 className="font-sans font-bold text-3xl mb-2">Política de Privacidad</h1>
                    <p className="text-white/50 text-sm mb-8">Última actualización: julio de 2026</p>

                    <div className="space-y-6 text-white/80 text-sm leading-relaxed">
                        <section>
                            <h2 className="text-yellow font-bold text-lg mb-2">1. Qué datos recolectamos</h2>
                            <p>
                                Cuando te registras en nuestro directorio, recolectamos: nombre, apellido, teléfono,
                                correo electrónico, y de forma opcional, tu país, nivel de posgrado de interés y
                                área de interés académico.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-yellow font-bold text-lg mb-2">2. Herramientas de terceros que usamos</h2>
                            <p>
                                Utilizamos Google Analytics 4 y Microsoft Clarity, exclusivamente con fines
                                analíticos, para entender cómo se usa el sitio y mejorar la experiencia de
                                navegación. No vendemos ni compartimos tu información con terceros con fines
                                publicitarios.
                            </p>
                            {META_PIXEL_ID && (
                                <p className="mt-3">
                                    Adicionalmente, utilizamos Meta Pixel para medir la efectividad de nuestras
                                    campañas publicitarias en redes sociales y ofrecerte contenido más relevante.
                                </p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-yellow font-bold text-lg mb-2">3. Uso de la información</h2>
                            <p>
                                Usamos tu información de contacto para comunicarnos contigo sobre programas de
                                posgrado de tu interés y los servicios de Comunidad Tesista de Latinoamérica.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-yellow font-bold text-lg mb-2">4. Tus derechos</h2>
                            <p>
                                Puedes solicitar acceso, corrección o eliminación de tus datos personales en
                                cualquier momento, contactándonos directamente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-yellow font-bold text-lg mb-2">5. Cambios a esta política</h2>
                            <p>
                                Esta política puede actualizarse periódicamente. La fecha de la última
                                actualización siempre aparece al inicio de esta página.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <footer className="bg-black text-center px-10 py-7 text-[13px]">
                <p className="text-white/50">
                    ©2026 Desarrollado por{" "}
                    <strong className="text-yellow">Jercol Technologies</strong>
                </p>
            </footer>
        </>
    );
}