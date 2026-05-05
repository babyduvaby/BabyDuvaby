import CategoryPageClient from "../../../src/components/CategoryPageClient";

// Next.js 15: params is now a Promise
export default async function CategoryPage({ params }) {
  const { categoryId } = await params;
  return <CategoryPageClient categoryId={categoryId} />;
}
