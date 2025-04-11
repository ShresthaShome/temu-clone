import { getCurrentSession } from "@/actions/auth";
import { getAllProducts } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export default async function Home() {
  const { user } = await getCurrentSession();

  const products = await getAllProducts();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div key={product._id} className="border p-4 rounded shadow-sm">
          <h2 className="font-bold text-lg">{product.title}</h2>
          <img
            src={urlFor(product.image as SanityImageSource).url()}
            alt={product.title || "Product Image"}
            className="w-full h-auto object-cover"
          />
          <p>{product.description}</p>
          <p className="text-sm text-gray-600">Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
}
