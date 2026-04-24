import "../../src/index.css";
import Script from "next/script";
import AdminServiceWorkerRegistrar from "../../src/components/AdminServiceWorkerRegistrar";

export const metadata = {
  metadataBase: new URL("https://baby-duvaby.vercel.app"),
  title: "Baby Duvaby Admin | Panel de Administracion",
  description:
    "Panel de administracion de Baby Duvaby. Gestiona productos, configuracion de la tienda y analiticas de WhatsApp.",
  manifest: "/manifest.admin.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Admin BD",
    statusBarStyle: "default",
    startupImage: [
      "/icons/admin-icon-512.png"
    ]
  },
  icons: {
    icon: [
      { url: "/icons/admin-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/admin-icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/admin-icon-192.png", sizes: "192x192", type: "image/png" }
    ]
  },
  other: {
    "mobile-web-app-capable": "yes"
  }
};

export const viewport = {
  themeColor: "#5f93d1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminServiceWorkerRegistrar />
      {children}
    </>
  );
}
