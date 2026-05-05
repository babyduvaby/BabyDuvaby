import HomePageClient from "../src/components/HomePageClient";
import { PayloadLivePreviewProvider } from "../src/components/PayloadLivePreviewProvider";

export default function Page() {
  return (
    <PayloadLivePreviewProvider>
      <HomePageClient />
    </PayloadLivePreviewProvider>
  );
}
