// Archivo: src/lib/tracking.ts
// Utilidad centralizada para disparar eventos personalizados hacia el dataLayer de GTM.
// El dataLayer se inicializa como array vacío si aún no existe, para que los eventos
// disparados antes de que GTM termine de cargar queden en cola y no se pierdan.

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

export function trackEvent(nombre: string, datos: Record<string, unknown> = {}): void {
    if (typeof window === "undefined") return; // nunca correr en el servidor

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: nombre,
        ...datos,
    });
}

export function activarClarity(): void {
    if (typeof window === "undefined") return;
    const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
    if (!CLARITY_ID) return;
    if ((window as unknown as { clarity?: unknown }).clarity) return; // ya cargado, no duplicar

    const script = document.createElement("script");
    script.innerHTML = `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
    `;
    document.head.appendChild(script);
}

export function activarMetaPixel(): void {
    if (typeof window === "undefined") return;
    const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (!META_PIXEL_ID) return;
    if ((window as unknown as { fbq?: unknown }).fbq) return; // ya cargado, no duplicar

    const script = document.createElement("script");
    script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
}
