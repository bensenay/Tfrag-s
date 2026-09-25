import { cartsMatch, normalizeCart, parseCheckoutKey } from "@/lib/checkout";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { storeCurrency } from "@/lib/storeConfig";
import { hasStripeSecretKey, stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const getAbsoluteImageUrl = (imageUrl: string, origin: string) => {
  try {
    return new URL(imageUrl, origin).toString();
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit({
    namespace: "checkout",
    request,
  });

  if (!rateLimit.success) {
    return rateLimit.response;
  }

  if (!hasStripeSecretKey) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable" },
      { status: 500, headers: rateLimit.headers },
    );
  }

  const checkoutKey = parseCheckoutKey(request.headers.get("idempotency-key"));

  if (!checkoutKey.success) {
    return NextResponse.json(
      {
        error: "A valid Idempotency-Key header is required",
        details: formatZodError(checkoutKey.error),
      },
      { status: 400, headers: rateLimit.headers },
    );
  }

  const body = await request.json().catch(() => null);
  const cart = normalizeCart(body);

  if (!cart.success) {
    return NextResponse.json(
      { error: "Invalid cart input", details: formatZodError(cart.error) },
      { status: 400, headers: rateLimit.headers },
    );
  }

  const productIds = cart.data.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    orderBy: { id: "asc" },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Cart contains an unknown product" },
      { status: 400, headers: rateLimit.headers },
    );
  }

  const quantityByProductId = new Map(
    cart.data.map((item) => [item.productId, item.quantity]),
  );

  const invalidStockProduct = products.find((product) => {
    const quantity = quantityByProductId.get(product.id) ?? 0;

    return quantity > product.stock;
  });

  if (invalidStockProduct) {
    return NextResponse.json(
      { error: `${invalidStockProduct.name} does not have enough stock` },
      { status: 400, headers: rateLimit.headers },
    );
  }

  const invalidPriceProduct = products.find((product) => product.price <= 0);

  if (invalidPriceProduct) {
    return NextResponse.json(
      { error: `${invalidPriceProduct.name} has an invalid price` },
      { status: 400, headers: rateLimit.headers },
    );
  }

  const orderItems = products.map((product) => {
    const quantity = quantityByProductId.get(product.id) ?? 0;
    return {
      product,
      quantity,
      lineTotal: product.price * quantity,
    };
  });

  const totalAmount = orderItems.reduce((total, item) => total + item.lineTotal, 0);

  if (totalAmount <= 0) {
    return NextResponse.json(
      { error: "Cart total must be greater than zero" },
      { status: 400, headers: rateLimit.headers },
    );
  }

  let order = await prisma.order.findUnique({
    where: { checkoutKey: checkoutKey.data },
    include: { items: true },
  });

  if (order) {
    const existingCart = order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (!cartsMatch(cart.data, existingCart)) {
      return NextResponse.json(
        { error: "Idempotency-Key was already used for a different cart" },
        { status: 409, headers: rateLimit.headers },
      );
    }

    if (order.stripeCheckoutUrl) {
      return NextResponse.json(
        { url: order.stripeCheckoutUrl },
        { headers: rateLimit.headers },
      );
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "This checkout attempt is no longer pending" },
        { status: 409, headers: rateLimit.headers },
      );
    }
  } else {
    try {
      order = await prisma.order.create({
        data: {
          checkoutKey: checkoutKey.data,
          customerEmail: "",
          customerName: "",
          shippingAddress: "",
          totalAmount,
          status: "PENDING",
          items: {
            create: orderItems.map(({ product, quantity }) => ({
              productId: product.id,
              quantity,
              price: product.price,
            })),
          },
        },
        include: { items: true },
      });
    } catch (error) {
      if (
        typeof error !== "object" ||
        error === null ||
        !("code" in error) ||
        error.code !== "P2002"
      ) {
        throw error;
      }

      order = await prisma.order.findUnique({
        where: { checkoutKey: checkoutKey.data },
        include: { items: true },
      });

      if (!order) {
        throw error;
      }

      const existingCart = order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      if (!cartsMatch(cart.data, existingCart)) {
        return NextResponse.json(
          { error: "Idempotency-Key was already used for a different cart" },
          { status: 409, headers: rateLimit.headers },
        );
      }
    }
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: orderItems.map(({ product, quantity }) => {
          const imageUrl = getAbsoluteImageUrl(product.imageUrl, origin);

          return {
            quantity,
            price_data: {
              currency: storeCurrency,
              unit_amount: product.price,
              product_data: {
                name: product.name,
                description: product.description,
                images: imageUrl ? [imageUrl] : undefined,
                metadata: {
                  productId: product.id,
                },
              },
            },
          };
        }),
        shipping_address_collection: {
          allowed_countries: ["CA", "US"],
        },
        success_url: `${origin}/shop?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?checkout=cancelled`,
        client_reference_id: order.id,
        metadata: {
          orderId: order.id,
        },
      },
      {
        idempotencyKey: `checkout-${checkoutKey.data}`,
      },
    );

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        stripeSessionId: session.id,
        stripeCheckoutUrl: session.url,
      },
    });

    return NextResponse.json(
      { url: session.url },
      { headers: rateLimit.headers },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session",
      },
      { status: 502, headers: rateLimit.headers },
    );
  }
}
