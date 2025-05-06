import prisma from "@/lib/prisma";
import { umamiTrackCheckoutSuccessEvent } from "@/lib/umami";
import { createClient } from "next-sanity";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return;

  const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });

  try {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("Event couldn't be constructed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const cartId = session.metadata?.cartId;
        const userId = session.metadata?.userId;

        if (!cartId) throw new Error("Missing cart ID in session methadata");

        const cart = await prisma.cart.findUnique({
          where: {
            id: cartId,
          },
          include: {
            items: true,
          },
        });

        if (!cart) throw new Error("Cart not found");

        const order = await sanityClient.create({
          _type: "order",
          orderNumber: session.id.slice(-8).toUpperCase(),
          orderDate: new Date().toISOString(),
          customerId: userId !== "-" ? userId : undefined,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          stripeCustomerId:
            typeof session.customer === "object"
              ? session.customer?.id || ""
              : session.customer,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          totalPrice: Number(session.amount_total) / 100,
          shippingAddress: {
            _type: "shippingAddress",
            name: session.customer_details?.name,
            line1: session.customer_details?.address?.line1,
            line2: session.customer_details?.address?.line2,
            city: session.customer_details?.address?.city,
            state: session.customer_details?.address?.state,
            postalCode: session.customer_details?.address?.postal_code,
            country: session.customer_details?.address?.country,
          },
          orderItems: cart.items.map((item) => ({
            _type: "orderItem",
            _key: item.id,
            product: {
              _type: "reference",
              _ref: item.sanityProductId,
            },
            quantity: item.quantity,
            price: item.price,
          })),
          status: "processing",
        });

        try {
          umamiTrackCheckoutSuccessEvent({
            cartId,
            email: order.customerEmail || "-",
            orderId: order.orderNumber,
            orderTotal: order.totalPrice,
            orderCurrency: "USD",
          });
        } catch (e) {
          console.error("Umami tracking error", e);
        }

        await prisma.cart.delete({
          where: {
            id: cartId,
          },
        });
        break;
      }

      default: {
        console.error("Unhandled event type:", event.type);
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Something went wrong", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
