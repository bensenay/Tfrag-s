import { describe, expect, it } from "vitest";
import { cartsMatch, normalizeCart, parseCheckoutKey } from "@/lib/checkout";
import { storeCurrency } from "@/lib/storeConfig";

describe("checkout input", () => {
  it("charges in Canadian dollars", () => {
    expect(storeCurrency).toBe("cad");
  });

  it("combines duplicate products and sorts them deterministically", () => {
    const result = normalizeCart([
      { productId: "product-b", quantity: 1 },
      { productId: "product-a", quantity: 2 },
      { productId: "product-b", quantity: 3 },
    ]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual([
        { productId: "product-a", quantity: 2 },
        { productId: "product-b", quantity: 4 },
      ]);
    }
  });

  it("rejects a combined quantity above the limit", () => {
    const result = normalizeCart([
      { productId: "product-a", quantity: 60 },
      { productId: "product-a", quantity: 40 },
    ]);

    expect(result.success).toBe(false);
  });

  it("requires a reusable, Stripe-safe checkout key", () => {
    expect(parseCheckoutKey("checkout_1234").success).toBe(true);
    expect(parseCheckoutKey(null).success).toBe(false);
    expect(parseCheckoutKey("bad key").success).toBe(false);
  });

  it("detects attempts to reuse a checkout key for another cart", () => {
    expect(
      cartsMatch(
        [{ productId: "product-a", quantity: 1 }],
        [{ productId: "product-a", quantity: 1 }],
      ),
    ).toBe(true);
    expect(
      cartsMatch(
        [{ productId: "product-a", quantity: 1 }],
        [{ productId: "product-a", quantity: 2 }],
      ),
    ).toBe(false);
  });
});
