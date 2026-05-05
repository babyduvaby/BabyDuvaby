import HomePageClient from "../src/components/HomePageClient";
import { PayloadLivePreviewProvider } from "../src/components/PayloadLivePreviewProvider";
import { PayloadEditControls } from "../src/components/PayloadEditControls";

export default function Page() {
  return (
    <PayloadLivePreviewProvider>
      <HomePageClient />
      {/* Boton de edicion magica: solo visible para admins autenticados en Payload CMS */}
      <PayloadEditControls collectionSlug="pages" />
    </PayloadLivePreviewProvider>
  );
}
