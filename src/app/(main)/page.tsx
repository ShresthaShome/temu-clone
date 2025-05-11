// import { getCurrentSession } from "@/actions/auth";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/sanity/lib/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  // const { user } = await getCurrentSession();

  const products = await getAllProducts();

  return (
    <section className="container mx-auto py-8">
      <ProductGrid products={products} />
    </section>
  );
}
