"use client";

import { useCartStore } from "@/stores/cart-stores";
import { User } from "@prisma/client";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function AnalyticsTracker({
  user,
}: {
  user: Partial<User> | null;
}) {
  const { cartId } = useCartStore(
    useShallow((state) => ({
      cartId: state.cartId,
    }))
  );

  useEffect(() => {
    if (!cartId || user) return;

    try {
      const anyWindow = window as any;

      if (anyWindow.umami) {
        anyWindow.umami.identify({
          cartId,
        });
      }
    } catch (e) {
      console.error("Umami cart identify error", e);
    }
  }, [cartId]);

  useEffect(() => {
    if (!user) return;

    try {
      const anyWindow = window as any;

      if (anyWindow.umami) {
        anyWindow.umami.identify({
          email: user.email,
        });
      }
    } catch (e) {
      console.error("Umami user identify error", e);
    }
  }, [user]);

  return <></>;
}
