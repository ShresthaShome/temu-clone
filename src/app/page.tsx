// import { getCurrentSession } from "@/actions/auth";
import { wheelOfFortuneSetup } from "@/actions/wheel-of-fortune-actions";
import ProductGrid from "@/components/product/ProductGrid";
import SalesCampaignBanner from "@/components/SalesCampaignBanner";
import WheelOfFortune from "@/components/WheelOfFortune";
import { getAllProducts } from "@/sanity/lib/client";

export default async function Home() {
  // const { user } = await getCurrentSession();

  const products = await getAllProducts();

  const { getRandomProducts, winningIndex } = await wheelOfFortuneSetup();

  return (
    <main>
      <SalesCampaignBanner />
      <WheelOfFortune
        products={getRandomProducts}
        winningIndex={winningIndex}
      />

      <section className="container mx-auto py-8">
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
