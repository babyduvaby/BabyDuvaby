import "../src/index.css";
import Script from "next/script";
import ServiceWorkerRegistrar from "../src/components/ServiceWorkerRegistrar";

export const metadata = {
  metadataBase: new URL("https://baby-duvaby.vercel.app"),
  title: "Baby Duvaby | Ropita y accesorios tiernos para bebe",
  description:
    "Baby Duvaby: ropa y accesorios tiernos para bebe. Compra facil por WhatsApp con atencion rapida y envios a todo el Peru.",
  openGraph: {
    type: "website",
    siteName: "Baby Duvaby",
    locale: "es_PE",
    title: "Baby Duvaby | Ropita y accesorios tiernos para bebe",
    description: "Explora nuestro catalogo y pide por WhatsApp en minutos.",
    images: ["/logo-baby-duvaby.svg"]
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Baby Duvaby",
    statusBarStyle: "default"
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }]
  }
};

export const viewport = {
  themeColor: "#f7c3df"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Script id="babyduvaby-install-capture" strategy="beforeInteractive">
          {`
            (function () {
              var PROMPT_KEY = "__BABY_DUVABY_DEFERRED_PROMPT__";
              var READY_EVENT = "babyduvaby:beforeinstallprompt-ready";
              var INSTALLED_KEY = "baby_duvaby_app_installed_v1";

              window[PROMPT_KEY] = window[PROMPT_KEY] || null;

              window.addEventListener("beforeinstallprompt", function (event) {
                event.preventDefault();
                window[PROMPT_KEY] = event;
                window.dispatchEvent(new CustomEvent(READY_EVENT));
              });

              window.addEventListener("appinstalled", function () {
                window[PROMPT_KEY] = null;
                try {
                  localStorage.setItem(INSTALLED_KEY, "1");
                } catch (error) {}
              });
            })();
          `}
        </Script>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
