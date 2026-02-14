import CategoryPageClient from "../../../src/components/CategoryPageClient";

export default function CategoryPage({ params }) {
  return <CategoryPageClient categoryId={params.categoryId} />;
}

