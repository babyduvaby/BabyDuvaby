import CategoryPageClient from "../../../src/components/CategoryPageClient";
import { PayloadLivePreviewProvider } from "../../../src/components/PayloadLivePreviewProvider";
import { PayloadEditControls } from "../../../src/components/PayloadEditControls";

// Next.js 15: params is now a Promise
export default async function CategoryPage({ params }) {
  const { categoryId } = await params;
  return (
    <PayloadLivePreviewProvider>
      <CategoryPageClient categoryId={categoryId} />
      <PayloadEditControls collectionSlug="categories" documentId={categoryId} />
    </PayloadLivePreviewProvider>
  );
}
