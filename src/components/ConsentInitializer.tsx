// Archivo: src/components/ConsentInitializer.tsx
// Componente que se ejecuta en cada carga de página para restaurar el consentimiento
// de cookies si el usuario ya lo había otorgado en una visita anterior.
// Si el consentimiento fue "granted", actualiza el Consent Mode de GTM y activa
// Microsoft Clarity y Meta Pixel (si sus respectivos IDs están configurados).

"use client";

import { useEffect } from "react";
import { activarClarity, activarMetaPixel } from "@/lib/tracking";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

export default function ConsentInitializer() {
    useEffect(() => {
        const consentimiento = localStorage.getItem("ctl_cookie_consent");
        if (consentimiento !== "granted") return;

        window.gtag?.("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
        });

        activarClarity();
        activarMetaPixel();
    }, []);

    return null;
}