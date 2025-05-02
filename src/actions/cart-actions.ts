"use server";

import { getCurrentSession } from "@/actions/auth";
import prisma from "@/lib/prisma";
import { type Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { revalidatePath } from "next/cache";

export const createCart = async () => {
  const { user } = await getCurrentSession();

  const cart = await prisma.cart.create({
    data: {
      id: crypto.randomUUID(),
      user: user ? { connect: { id: user.id } } : undefined,
      items: {
        create: [],
      },
    },
    include: {
      items: true,
    },
  });

  return cart;
};

export const getOrCreateCart = async (cartId?: string | null) => {
  const { user } = await getCurrentSession();

  if (user) {
    const userCart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (userCart) {
      return userCart;
    }
  }

  if (!cartId) {
    return createCart();
  }

  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      items: true,
    },
  });

  if (!cart) return createCart();

  return cart;
};

export const updateCartItem = async (
  cartId: string,
  sanityProductId: string,
  data: {
    title?: string;
    price?: number;
    quantity?: number;
    image?: string;
  }
) => {
  const cart = await getOrCreateCart(cartId);

  const existingItem = cart.items.find(
    (item) =>
      item.sanityProductId === sanityProductId && item.title === data.title
  );

  if (existingItem) {
    if (data.quantity === 0) {
      await prisma.cartLineItem.delete({
        where: {
          id: existingItem.id,
        },
      });
    } else if (data.quantity && data.quantity > 0) {
      if (
        existingItem?.title.startsWith("🎁") &&
        existingItem.title.endsWith("(Won)")
      ) {
        return cart;
      }

      await prisma.cartLineItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: data.quantity,
        },
      });
    }
  } else if (data.quantity && data.quantity > 0) {
    await prisma.cartLineItem.create({
      data: {
        id: crypto.randomUUID(),
        cartId: cart.id,
        sanityProductId,
        title: data.title || "",
        price: data.price || 0,
        quantity: data.quantity,
        image: data.image || "",
      },
    });
  }

  revalidatePath("/");
  return getOrCreateCart(cartId);
};

export const syncedCartWithUser = async (cartId: string | null) => {
  const { user } = await getCurrentSession();

  if (!user) return null;

  const existingUserCart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      items: true,
    },
  });

  const existingAnonymousCart = cartId
    ? await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
        include: {
          items: true,
        },
      })
    : null;

  if (!cartId && existingUserCart) return existingUserCart;

  if (!cartId) return createCart();

  if (!existingAnonymousCart || !existingUserCart) return createCart();

  if (existingAnonymousCart && existingUserCart.id === cartId)
    return existingUserCart;

  if (!existingUserCart) {
    const newCart = await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        items: true,
      },
    });

    return newCart;
  }

  if (!existingAnonymousCart) return existingUserCart;

  for (const item of existingAnonymousCart.items) {
    const existingItem = existingUserCart.items.find(
      (i) => i.sanityProductId === item.sanityProductId
    );

    if (existingItem) {
      await prisma.cartLineItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: item.quantity + existingItem.quantity,
        },
      });
    } else {
      await prisma.cartLineItem.create({
        data: {
          id: crypto.randomUUID(),
          cartId: existingUserCart.id,
          sanityProductId: item.sanityProductId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        },
      });
    }
  }

  await prisma.cart.delete({
    where: {
      id: existingAnonymousCart.id,
    },
  });

  revalidatePath("/");
  return getOrCreateCart(existingUserCart.id);
};

export const addWinningItemToCart = async (
  cartId: string,
  product: Product
) => {
  const cart = await getOrCreateCart(cartId);

  const existingItem = cart.items.find(
    (item) =>
      item.sanityProductId === product._id &&
      item.title === `🎁 ${product.title} (Won)`
  );

  if (!existingItem) {
    const updatedCart = await updateCartItem(cart.id, product._id, {
      title: `🎁 ${product.title} (Won)`,
      price: 0,
      quantity: 1,
      image: product.image ? urlFor(product.image).url() : "",
    });
    return updatedCart;
  } else return cart;
};
