import HomePageClient from "../../src/components/HomePageClient";
import { PayloadLivePreviewProvider } from "../../src/components/PayloadLivePreviewProvider";
import { PayloadEditControls } from "../../src/components/PayloadEditControls";

export default function HomePage() {
  return (
    <PayloadLivePreviewProvider>
      <HomePageClient />
      <PayloadEditControls collectionSlug="pages" />
    </PayloadLivePreviewProvider>
  );
}

