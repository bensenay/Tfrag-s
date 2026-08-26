import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { hasStripeSecretKey, stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const MAX_LINE_ITEMS = 100;
const MAX_QUANTITY = 99;
const CURRENCY = "usd";

const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

const checkoutBodySchema = z.union([
  z.array(cartItemSchema).min(1).max(MAX_LINE_ITEMS),
  z.object({
    cart: z.array(cartItemSchema).min(1).max(MAX_LINE_ITEMS),
  }),
]);

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const normalizeCart = (cart: unknown) => {
  const parsed = checkoutBodySchema.safeParse(cart);

  if (!parsed.success) {
    return parsed;
  }

  const items = Array.isArray(parsed.data) ? parsed.data : parsed.data.cart;
  const quantitiesByProductId = new Map<string, number>();

  for (const { productId, quantity } of items) {
    const nextQuantity =
      (quantitiesByProductId.get(productId) ?? 0) + quantity;

    if (nextQuantity > MAX_QUANTITY) {
      return {
        success: false as const,
        error: new z.ZodError([
          {
            code: "custom",
            input: quantity,
            message: `A single product quantity cannot be greater than ${MAX_QUANTITY}`,
            path: ["cart", productId, "quantity"],
          },
        ]),
      };
    }

    quantitiesByProductId.set(productId, nextQuantity);
  }

  return {
    success: true as const,
    data: [...quantitiesByProductId.entries()].map(([productId, quantity]) => ({
      productId,
      quantity,
    })),
  };
};

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
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const cart = normalizeCart(body);

  if (!cart.success) {
    return NextResponse.json(
      { error: "Invalid cart input", details: formatZodError(cart.error) },
      { status: 400 },
    );
  }

  const productIds = cart.data.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Cart contains an unknown product" },
      { status: 400 },
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
      { status: 400 },
    );
  }

  const invalidPriceProduct = products.find((product) => product.price <= 0);

  if (invalidPriceProduct) {
    return NextResponse.json(
      { error: `${invalidPriceProduct.name} has an invalid price` },
      { status: 400 },
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
      { status: 400 },
    );
  }

  const order = await prisma.order.create({
    data: {
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
  });

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: orderItems.map(({ product, quantity }) => {
        const imageUrl = getAbsoluteImageUrl(product.imageUrl, origin);

        return {
          quantity,
          price_data: {
            currency: CURRENCY,
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
    });

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session",
      },
      { status: 500 },
    );
  }
}
