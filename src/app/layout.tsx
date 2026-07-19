// Archivo: src/app/layout.tsx
// Layout raíz de la aplicación. Configura la fuente Roboto Condensed vía next/font,
// inicializa el Consent Mode v2 de Google (denegado por defecto), y carga condicionalmente
// Google Tag Manager si NEXT_PUBLIC_GTM_ID está definido.

import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import Script from "next/script";
import ConsentInitializer from "@/components/ConsentInitializer";
import "./globals.css";

export const dynamic = "force-dynamic";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Comunidad Tesista de Latinoamérica — Directorio de Posgrados",
  description:
    "Compara programas de posgrado, costos de matrícula y calidad de vida en más de 30 países. Decisiones inteligentes, futuro brillante.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning className={robotoCondensed.variable}>
      <body>
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
            window.gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
          `}
        </Script>
        <ConsentInitializer />
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
