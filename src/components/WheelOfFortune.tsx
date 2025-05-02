"use client";

import { addWinningItemToCart } from "@/actions/cart-actions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { useCartStore } from "@/stores/cart-stores";
import { Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

/**  @color */
const COLORS = [
  ["#dc2626", "#ef4444"], // red gradient (deeper)
  ["#ea580c", "#f97316"], // orange gradient (deeper)
  ["#eab308", "#facc15"], // yellow gradient (deeper)
  ["#65a30d", "#84cc16"], // lime gradient (deeper)
  ["#059669", "#10b981"], // emerald gradient (deeper)
  ["#0891b2", "#06b6d4"], // cyan gradient (deeper)
  ["#2563eb", "#3b82f6"], // blue gradient (deeper)
  ["#4f46e5", "#6366f1"], // indigo gradient (deeper)
  ["#9333ea", "#a855f7"], // purple gradient (deeper)
  ["#db2777", "#ec4899"], // pink gradient (deeper)
] as const;

const getSliceStyle = (length: number, index: number): CSSProperties => {
  const degrees = 360 / length;
  const rotate = degrees * index;

  const angle = (2 * Math.PI) / length;
  const [r, startAngle, endAngle, numPoints] = [100, -angle / 2, angle / 2, 20];
  const points = [];
  points.push("50% 50%");

  for (let i = 0; i <= numPoints; i++) {
    const angle = startAngle + (i * (endAngle - startAngle)) / numPoints;
    const x = r * Math.cos(angle) + 50;
    const y = r * Math.sin(angle) + 50;
    points.push(`${x}% ${y}%`);
  }

  const [colorStart, colorEnd] = COLORS[index % COLORS.length];

  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    transformOrigin: "50% 50%",
    transform: `rotate(${rotate}deg)`,
    background: `
      linear-gradient(115deg, ${colorStart} 0%, ${colorEnd} 100%),
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.2) 100%)
    `,
    backgroundBlendMode: "overlay",
    clipPath: `polygon(${points.join(",")})`,
  };
};

const getTextStyle: CSSProperties = {
  position: "absolute",
  width: "200px",
  height: "80px",
  wordWrap: "break-word",
  left: `calc(65%)`,
  top: `calc(45%)`,
  color: "white",
  fontSize: "13px",
  fontWeight: "bold",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  whiteSpace: "wrap",
  display: "flex",
  flexDirection: "column",
};

const PriceTag = ({ price }: { price: number }) => (
  <div className="flex items-center">
    <span className="text-white text-base font-extrabold drop-shadow-lg [text-shadow:_-2px_-2px_0_#22c55e,_2px_-2px_0_#22c55e,-2px_2px_0_#22c55e,_2px_2px_0_#22c55e]">
      ${price.toFixed(2)}
    </span>
  </div>
);

const WinningItem = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const router = useRouter();

  const {
    setStore,
    open: openCart,
    cartId,
  } = useCartStore(
    useShallow((state) => ({
      setStore: state.setStore,
      open: state.open,
      cartId: state.cartId,
    }))
  );
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const addToCart = async () => {
    if (!cartId) return;
    setIsAdding(true);

    const updatedCart = await addWinningItemToCart(cartId, product);
    localStorage.setItem("has-played-wheel", "true");
    setStore(updatedCart);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
    openCart();
    onClose();
    setIsAdding(false);
  };

  return (
    <div className="text-center animate-[slide-up_0.5s_ease-out]">
      <div
        className={`
        p-8 rounded-xl bg-white shadow-xl backdrop-blur-lg opacity-90
        border border-white/20 transform transition-all duration-500
        hover:shadow-emerald-500/20 hover:scale-[1.01]
      `}
      >
        <div className="relative p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 animate-pulse rounded-lg" />
          <h3
            className={`
              text-2xl font-bold text-emerald-600 p-4 mb-8
              animate-[pulse_2s_ease-in-out_infinite]
              [text-shadow:_0_1px_2px_rgba(0_0_0_/_10%)]
            `}
          >
            🥳 Congratulations 🥳
          </h3>

          <div className="flex flex-col items-center gap-6">
            {product.image && (
              <div className="relative group">
                <div
                  className={`
                    absolute -inset-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500
                    rounded-2xl opacity-75 blur-lg animate-pulse group-hover:opacity-100 transition-opacity duration-500
                  `}
                />

                <div className="relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-2xl">
                  <div className="absolute -top-3 -right-3 bg-red-600 text-white px-4 py-1 rounded-full font-black text-lg shadow-lg z-10 uppercase">
                    free!
                  </div>

                  <div className="relative rounded-lg overflow-hidden border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <Image
                      src={urlFor(product.image).width(256).url()}
                      alt={product.title || "Winning Product"}
                      className="object-cover transform transition-all duration-500 hover:scale-105"
                      width={256}
                      height={256}
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />

                    <div className="absolute bottom-2 left-2 bg-yellow-500/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                      Limited Time Only!
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center space-y-2">
              <h4 className="text-xl font-bold text-gray-800">You won!</h4>
              <p className="text-lg text-emerald-600 font-semibold">
                {product.title}
              </p>
              {product.description && (
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={addToCart}
          disabled={isAdding}
          className={`
            mt-6 w-full py-4 px-8 rounded-full font-bold transition-all cursor-pointer
            duration-300 transform flex items-center justify-center gap-2
            hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
          `}
        >
          {isAdding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Adding to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" /> Claim Your Prize!
            </>
          )}
        </button>
      </div>
    </div>
  );
};

type WheelOfFortuneProps = {
  products: Product[];
  winningIndex: number;
};

export default function WheelOfFortune({
  products,
  winningIndex,
}: WheelOfFortuneProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [showWinningItem, setShowWinningItem] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  const [wheelStyle, setWheelStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const hasPlayed = localStorage.getItem("has-played-wheel");

    if (!hasPlayed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  });

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
    setHasSpun(true);
    setShowWinningItem(false);

    setWheelStyle({ animation: "none" });

    requestAnimationFrame(() => {
      const numberOfSpins = 11;
      const degreesPerProduct = 360 / products.length;
      const randomOffset = (Math.random() * 0.6 + 0.2) * degreesPerProduct;
      const degrees =
        numberOfSpins * 360 +
        winningIndex * degreesPerProduct +
        randomOffset -
        degreesPerProduct / 2;

      setWheelStyle({
        transform: `rotate(-${degrees}deg)`,
        transition: "transform 5s cubic-bezier(0.17, 0.67, 0.08, 0.99)",
        animation: "none",
      });

      setTimeout(() => {
        setIsSpinning(false);
        setTimeout(() => setShowWinningItem(true), 500);
      }, 5000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle>
          <div className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse" />

            <h2 className="text-2xl font-bold mb-2 animate-bounce">
              Spin 🎡 & Win! 🎁
            </h2>

            <p className="text-muted-foreground mb-4 relative animate-pulse">
              Try your luck! Spin the wheel for a chance to win amazing prizes!
            </p>

            <div className="absolute -left-20 top-1/4 h-15 w-40 overflow-hidden bg-white/20 animate-[shine_4s_infinite]" />
          </div>
        </DialogTitle>

        <div className="flex flex-col items-center justify-center p-8 gap-4 bg-gray-50">
          <div
            className={`
                relative w-[350px] h-[350px] md:w-[600px] md:h-[600px] transition-all duration-1000 ease-in-out transform
                ${showWinningItem ? "scale-0 opacity-0 rotate-180" : "scale-100 opacity-100"}`}
          >
            {/* Red Pointer  */}
            <div
              className={`
                absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 w-0 h-0
                border-t-[20px] border-t-transparent
                border-r-[40px] border-r-pink-900
                border-b-[20px] border-b-transparent
                z-10
              `}
            ></div>

            {/* Wheel */}
            <div
              className={`
                absolute inset-0 rounded-full overflow-hidden border-8 border-gray-200
                shadow-[0_0_20px_rgba(0,0,0,0.2)]
                ${!isSpinning && !hasSpun && "animate-[float_3s_ease-in-out_infinite]"}
              `}
              style={{
                ...wheelStyle,
                animation:
                  !isSpinning && !hasSpun
                    ? "spin 30s linear infinite"
                    : undefined,
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product._id}
                  style={getSliceStyle(products.length, index)}
                  className="absolute inset-0"
                >
                  <div className="truncate px-2" style={getTextStyle}>
                    <span className="truncate">{product.title}</span>
                    <PriceTag price={product.price || 0} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`
              absolute inset-0 flex items-center justify-center p-8
              transition-all duration-1000 ease-in-out transform
              ${showWinningItem ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-full"}
            `}
          >
            {hasSpun && !isSpinning && (
              <WinningItem
                product={products[winningIndex]}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning || hasSpun}
            className={`relative px-8 py-4 rounded-full font-bold text-white text-lg transition-all
              bg-gradient-to-r from-red-500 via-yellow-500 to-red-500
              bg-[length:200%_100%] animate-[gradientX_2s_linear_infinite]
              border-4 border-yellow-300 uppercase
              shadow-[0_0_20px_rgba(234,179,8,0.5)]
              hover:shadow-[0_0_30px_rgba(234,179,8,0.8)]
              hover:scale-105 cursor-pointer disabled:text-yellow-300
              disabled:opacity-50 disabled:cursor-not-allowed
              ${showWinningItem ? "scale-0 opacity-0 -translate-y-full" : ""}
              before:absolute before:inset-0 before:bg-white/20
            before:animate-[pulse_1s_ease-in-out_infinite]`}
          >
            {isSpinning ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Spinning...
              </span>
            ) : hasSpun ? (
              "🎊 Congratulations! 🎊"
            ) : (
              <>
                <span className="animate-[pulse_1s_ease-in-out_infinite]">
                  🎁
                </span>
                {" Spin Now! "}
                <span className="animate-[pulse_1s_ease-in-out_infinite]">
                  🎁
                </span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
