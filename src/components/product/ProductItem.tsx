import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          HOT!
        </span>
      </div>

      <div className="relative h-48 w-full">
        {product.image && (
          <Image
            src={urlFor(product.image).width(256).url()}
            alt={product.title || "Product Image"}
            fill
            className="object-contain p-2"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium line-clamp-2 h-10 mb-1">
          {product.title}
        </h3>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 pl-3">
            <span className="text-lg font-bold text-orange-400">
              ${(product.price || 0).toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${((product.price || 0) * 5).toFixed(2)}
            </span>
          </div>

          <div className="text-sm text-green-500 font-semibold mb-2 pl-2 line-clamp-1">
            🔥{" "}
            {100 +
              Math.abs(
                (product._id + new Date().toLocaleDateString())
                  .split("")
                  .reduce((a, b) => a + b.charCodeAt(0), 0) % 500
              )}
            + sold in last 24h
          </div>

          <button className="uppercase w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all cursor-pointer">
            Grab it Now!
          </button>

          <div className="text-xs text-red-500 text-center mt-1 animate-pulse">
            ⚡️ Limited time offer!
          </div>
        </div>
      </div>
    </div>
  );
}
