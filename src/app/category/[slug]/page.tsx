import ProductGrid from "@/components/product/ProductGrid";
import SalesCampaignBanner from "@/components/SalesCampaignBanner";
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
} from "@/sanity/lib/client";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
  ]);

  if (!category) return <h1>Error</h1>;

  return (
    <div>
      <SalesCampaignBanner />

      <div className="bg-red-50 p-4">
        <div className="container mx-auto text-center">
          <h1 className="text-xl md:text-3xl font-bold text-red-600 mb-2">
            {category.title} -{" "}
            <span className="uppercase">Up to 90% off! 🔥</span>
          </h1>

          <p className="text-red-500 text-sm md:text-base animate-pulse capitalize">
            ⚡️ Flash sale ending soon! ⏰ Limited time only
          </p>

          <p className="text-gray-600 text-xs mt-2">{category.description}</p>
        </div>
      </div>

      <div className="bg-yellow-50 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">🚚</span>
              Free Shipping
            </div>

            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⭐</span>
              Top Rated
            </div>

            <div className="flex items-center gap-2">
              <span className="text-yellow-600">💰</span>
              Best Prices
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 capitalize">
            🎊 {products.length} Amazing deals available now!
          </p>
        </div>

        <ProductGrid products={products} />
      </section>
    </div>
  );
}
