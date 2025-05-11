import ProductGrid from "@/components/product/ProductGrid";
import SalesCampaignBanner from "@/components/SalesCampaignBanner";
import { Product, ProductCategory } from "@/sanity.types";
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
} from "@/sanity/lib/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) return { title: "Category Error" };

  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return { title: `${category.title || slug} Products` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, products]: [ProductCategory, Product[]] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
  ]);

  return (
    <div>
      <SalesCampaignBanner />

      <div className="bg-red-50 p-4">
        <div className="container mx-auto text-center">
          <h1 className="text-xl md:text-3xl font-bold text-red-600 mb-2">
            {category?.title ? (
              <>
                {category.title}
                <span className="uppercase"> - Up to 90% off! 🔥</span>
              </>
            ) : (
              <>&#10077;{slug}&#10078;</>
            )}
          </h1>

          <p className="text-red-500 text-sm md:text-base animate-pulse capitalize">
            ⚡️ Flash sale ending soon! ⏰ Limited time only
          </p>

          {category?.description && (
            <p className="text-gray-600 text-xs mt-2">{category.description}</p>
          )}
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
              😔 Sorry! No Deal Available for &#10077;{slug}&#10078;
            </p>
          )}
        </div>

        <ProductGrid products={products} />
      </section>
    </div>
  );
}
