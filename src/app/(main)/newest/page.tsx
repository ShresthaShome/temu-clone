import ProductGrid from "@/components/product/ProductGrid";
import { getNewestProducts } from "@/sanity/lib/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newest Deals",
};

export default async function Newest() {
  const products = await getNewestProducts();

  return (
    <div>
      <div className="bg-red-50 p-4">
        <div className="container mx-auto text-center">
          <h1 className="text-xl md:text-3xl font-bold text-red-600 mb-2">
            New Arrivals
          </h1>

          <p className="text-red-500 text-sm md:text-base animate-pulse capitalize">
            ⚡️ Flash sale ending soon! ⏰ Limited time only
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
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
