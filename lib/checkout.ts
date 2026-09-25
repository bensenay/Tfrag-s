import { z } from "zod";

export const MAX_LINE_ITEMS = 100;
export const MAX_QUANTITY = 99;

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

const checkoutKeySchema = z
  .string()
  .trim()
  .min(8)
  .max(200)
  .regex(
    /^[A-Za-z0-9._:-]+$/,
    "Idempotency-Key contains unsupported characters",
  );

export type NormalizedCartItem = {
  productId: string;
  quantity: number;
};

export const parseCheckoutKey = (value: string | null) =>
  checkoutKeySchema.safeParse(value);

export const normalizeCart = (cart: unknown) => {
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
    data: [...quantitiesByProductId.entries()]
      .map(([productId, quantity]) => ({ productId, quantity }))
      .sort((a, b) => a.productId.localeCompare(b.productId)),
  };
};

export const cartsMatch = (
  requested: NormalizedCartItem[],
  existing: NormalizedCartItem[],
) => {
  if (requested.length !== existing.length) {
    return false;
  }

  const existingByProductId = new Map(
    existing.map((item) => [item.productId, item.quantity]),
  );

  return requested.every(
    (item) => existingByProductId.get(item.productId) === item.quantity,
  );
};
