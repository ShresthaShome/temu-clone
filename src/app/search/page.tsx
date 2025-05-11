import ProductGrid from "@/components/product/ProductGrid";
import SalesCampaignBanner from "@/components/SalesCampaignBanner";
import { searchProducts } from "@/sanity/lib/client";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  if (!query) return { title: "Error - No Search Query" };

  const product = await searchProducts(query);
  if (!product) return { title: "No Product Found" };

  return { title: `Searched for "${query}"` };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;

  const products = await searchProducts(query);

  //   if (!products) return <h1>Error</h1>;

  return (
    <div>
      <SalesCampaignBanner />

      <div className="bg-red-50 p-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-2 ">
            Search Results for &#10077;{query}&#10078;
            {products.length > 0 && (
              <span className="uppercase"> - Up to 90% off! 🔥</span>
            )}
          </h1>

          <p className="text-red-500 text-sm md:text-base animate-pulse capitalize">
            ⚡️ Flash sale ending soon! ⏰ Limited time only
          </p>

          <p className="text-gray-600 text-xs mt-2">
            Discover amazing deals matching your search
          </p>
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
          {products.length > 0 ? (
            <p className="text-sm text-gray-500 capitalize">
              🎊 {products.length} Amazing deal
              {products.length === 1 ? "" : "s"} available now!
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              😔 Sorry! No Deal Available for &#10077;{query}&#10078;
            </p>
          )}
        </div>

        <ProductGrid products={products} />
      </section>
    </div>
  );
}
