"use client";

import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-stores";
import { LucideOctagonX, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

export default function Cart() {
  const {
    close,
    isOpen,
    syncWithUser,
    setLoaded,
    getTotalItems,
    items,
    updadeQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore(
    useShallow((state) => ({
      close: state.close,
      isOpen: state.isOpen,
      syncWithUser: state.syncWithUser,
      setLoaded: state.setLoaded,
      getTotalItems: state.getTotalItems,
      items: state.items,
      updadeQuantity: state.updateQuantity,
      removeItem: state.removeItem,
      getTotalPrice: state.getTotalPrice,
    }))
  );

  const freeShippingAmmount = 50;

  useEffect(() => {
    const initCart = async () => {
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoaded(true);
    };

    initCart();
  }, []);

  const totalPrice = getTotalPrice();

  const remainingForFreeShipping = useMemo(() => {
    return Math.max(0, freeShippingAmmount - totalPrice);
  }, [totalPrice]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity backdrop-blur-sm"
          onClick={close}
        />
      )}
      <div
        className={`
        fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="bg-gray-200 px-2 py-1 rounded-full text-sm font-medium">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some items to your cart to get started.
                </p>
                <Link
                  href="/"
                  onClick={close}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {items.map((item) => (
                  <div
                    className="flex gap-4 hover:bg-gray-50 p-4"
                    key={`cart-item-${item.id}`}
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>

                      <div className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price)}
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <select
                          name=""
                          id=""
                          value={item.quantity}
                          onChange={(e) =>
                            updadeQuantity(
                              item.sanityProductId!,
                              parseInt(e.target.value)
                            )
                          }
                          className="border rounded-md px-2 py-1 text-sm bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option
                              key={`itm-${item.id}-qty-${num}`}
                              value={num}
                            >
                              {num}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeItem(item.sanityProductId!)}
                          className="text-red-500 text-sm hover:text-red-600"
                        >
                          <LucideOctagonX className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <div className="border-t">
              {remainingForFreeShipping > 0 ? (
                <div className="p-4 bg-blue-50 border-b">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <span>🚚</span>
                    <span className="font-medium">
                      Add {formatPrice(remainingForFreeShipping)} for FREE
                      shipping
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((totalPrice / freeShippingAmmount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border-b">
                  <div className="flex items-center gap-2 text-green-800">
                    <span>✨</span>
                    <span className="font-medium">
                      You have unlocked FREE shipping!
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">
                      {remainingForFreeShipping > 0
                        ? "Calculated at checkout"
                        : "FREE"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-lg">Total</span>
                    <span className="font-bold text-lg">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <button className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition-colors flex items-center justify-center cursor-pointer">
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>🔒</span>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>🔁</span>
                      <span>30-Day Returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>💳</span>
                      <span>All Major Payment Methods Accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
