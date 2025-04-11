import { getCurrentSession } from "@/actions/auth";
import ProductGrid from "@/components/product/ProductGrid";
import SalesCampaignBanner from "@/components/SalesCampaignBanner";
import { getAllProducts } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export default async function Home() {
  // const { user } = await getCurrentSession();

  const products = await getAllProducts();

  return (
    <main>
      <SalesCampaignBanner />

      <section className="container mx-auto py-8">
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
