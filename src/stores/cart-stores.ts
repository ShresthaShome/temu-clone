import {
  getOrCreateCart,
  syncedCartWithUser,
  updateCartItem,
} from "@/actions/cart-actions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  sanityProductId?: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

type CartStore = {
  items: CartItem[];
  isLoaded: boolean;
  isOpen: boolean;
  cartId: string | null;
  setStore: (store: Partial<CartStore>) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string, title: string) => Promise<void>;
  updateQuantity: (
    id: string,
    quantity: number,
    title: string
  ) => Promise<void>;
  clearCart: () => void;
  open: () => void;
  close: () => void;
  setLoaded: (loaded: boolean) => void;
  syncWithUser: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoaded: false,
      cartId: null,

      setStore: (store) => set(store),

      addItem: async (item) => {
        const { cartId, items } = get();

        if (!cartId) return;

        const isExistingItem = items.find(
          (i) => i.sanityProductId === item.id && i.title === item.title
        );

        const updatedCart = await updateCartItem(cartId, item.id, {
          title: item.title,
          price: item.price,
          quantity: isExistingItem
            ? isExistingItem.quantity + 1
            : item.quantity,
          image: item.image,
        });

        set((state) => {
          const existingItem = state.items.find(
            (i) => i.id === item.id && i.title === item.title
          );
          if (existingItem) {
            return {
              ...state,
              cartId: updatedCart.id,
              items: state.items.map((i) =>
                i.id === item.id && i.title === item.title
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            ...state,
            cartId: updatedCart.id,
            items: updatedCart.items,
          };
        });
      },

      removeItem: async (id, title) => {
        const { cartId } = get();

        if (!cartId) return;

        const updatedCart = await updateCartItem(cartId, id, {
          quantity: 0,
          title,
        });

        set((state) => {
          return {
            ...state,
            cartId: updatedCart.id,
            items: state.items.filter(
              (item) => item.sanityProductId !== id && item.title !== title
            ),
          };
        });
      },

      updateQuantity: async (id, quantity, title) => {
        const { cartId } = get();

        if (!cartId) return;

        const updatedCart = await updateCartItem(cartId, id, {
          quantity,
          title,
        });

        set((state) => {
          return {
            ...state,
            cartId: updatedCart.id,
            items: state.items.map((item) =>
              item.sanityProductId === id && item.title === title
                ? { ...item, quantity }
                : item
            ),
          };
        });
      },

      syncWithUser: async () => {
        const { cartId } = get();

        if (!cartId) {
          const cart = await getOrCreateCart();

          set((state) => {
            return {
              ...state,
              cartId: cart.id,
              items: cart.items,
            };
          });
        }

        const syncedCart = await syncedCartWithUser(cartId);
        if (syncedCart)
          set((state) => ({
            ...state,
            cartId: syncedCart.id,
            items: syncedCart.items,
          }));
      },

      clearCart: () => {
        set((state) => ({ ...state, items: [] }));
      },

      open: () => {
        set((state) => ({ ...state, isOpen: true }));
      },

      close: () => {
        set((state) => ({ ...state, isOpen: false }));
      },

      setLoaded: (loaded) => {
        set((state) => ({ ...state, isLoaded: loaded }));
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    }
  )
);
