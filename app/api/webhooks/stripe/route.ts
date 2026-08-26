import { sendOrderConfirmation } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const formatAddress = (
  address: Stripe.Address | null | undefined,
  name?: string | null,
) => {
  if (!address) {
    return "";
  }

  return JSON.stringify({
    name: name ?? "",
    line1: address.line1 ?? "",
    line2: address.line2 ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    postalCode: address.postal_code ?? "",
    country: address.country ?? "",
  });
};

export async function POST(request: Request) {
  if (!stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET environment variable" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const payload = await request.text();
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeWebhookSecret,
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Checkout session missing orderId metadata" },
        { status: 400 },
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
        stripeSessionId: session.id,
      },
      data: {
        status: "PAID",
        customerEmail:
          session.customer_details?.email ?? session.customer_email ?? "",
        customerName: session.customer_details?.name ?? "",
        shippingAddress: formatAddress(
          session.collected_information?.shipping_details?.address,
          session.collected_information?.shipping_details?.name ??
          session.customer_details?.name,
        ),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await sendOrderConfirmation(order);
  }

  return NextResponse.json({ received: true });
}
