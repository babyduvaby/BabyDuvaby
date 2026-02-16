import "../src/index.css";
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
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
