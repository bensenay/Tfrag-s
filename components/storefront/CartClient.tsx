"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { formatCad } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import {
  primaryButtonClass,
  quietButtonClass,
} from "@/components/storefront/styles";

type CartProduct = {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  slug: string;
  stock: number;
};

type CheckoutAttempt = {
  key: string;
  signature: string;
};

export function CartClient({ products }: { products: CartProduct[] }) {
  const lines = useCartStore((state) => state.lines);
  const change = useCartStore((state) => state.change);
  const remove = useCartStore((state) => state.remove);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const checkoutAttempt = useRef<CheckoutAttempt | null>(null);
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const rows = lines.flatMap((line) => {
    const product = productsById.get(line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const subtotal = rows.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0,
  );

  const startCheckout = async () => {
    const cart = rows.map(({ productId, quantity }) => ({ productId, quantity }));
    const signature = JSON.stringify(
      [...cart].sort((a, b) => a.productId.localeCompare(b.productId)),
    );

    if (!checkoutAttempt.current || checkoutAttempt.current.signature !== signature) {
      checkoutAttempt.current = {
        key: crypto.randomUUID(),
        signature,
      };
    }

    setCheckoutError(null);
    setCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": checkoutAttempt.current.key,
        },
        body: JSON.stringify({ cart }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; url?: string }
        | null;

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error ?? "Checkout could not be started");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Checkout could not be started",
      );
      setCheckingOut(false);
    }
  };

  if (!rows.length) {
    return (
      <div className="border-y border-border py-20 text-center">
        <p className="font-serif text-4xl">Your night is still open.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Choose a fragrance to begin.
        </p>
        <Link href="/shop" className={`${quietButtonClass} mt-8`}>
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-border border-y border-border">
        {rows.map(({ product, productId, quantity }) => (
          <div
            key={productId}
            className="grid grid-cols-[92px_1fr] gap-5 py-6 md:grid-cols-[132px_1fr_auto] md:items-center"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-card">
              <Image fill alt="" className="object-cover" sizes="132px" src={product.imageUrl} />
            </div>
            <div>
              <Link href={`/shop/${product.slug}`} className="font-serif text-2xl">
                {product.name}
              </Link>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                30 mL Eau de Parfum
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button type="button" className="p-2" onClick={() => change(productId, -1)} aria-label={`Decrease ${product.name}`}>
                  <Minus className="size-4" />
                </button>
                <span className="w-5 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  className="p-2 disabled:opacity-30"
                  disabled={quantity >= product.stock}
                  onClick={() => change(productId, 1)}
                  aria-label={`Increase ${product.name}`}
                >
                  <Plus className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(productId)}
                  className="ml-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="col-start-2 text-primary md:col-start-auto">
              {formatCad(product.price * quantity)} CAD
            </p>
          </div>
        ))}
      </div>

      <div className="ml-auto mt-10 max-w-md">
        <div className="flex justify-between border-b border-border pb-5">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="font-serif text-2xl">{formatCad(subtotal)} CAD</span>
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          Shipping and taxes are calculated at checkout.
        </p>
        {checkoutError ? (
          <p role="alert" className="mt-4 text-sm text-red-300">{checkoutError}</p>
        ) : null}
        <button
          type="button"
          className={`${primaryButtonClass} mt-7 w-full`}
          disabled={checkingOut}
          onClick={startCheckout}
        >
          {checkingOut ? "Opening secure checkout…" : "Continue to checkout"}
        </button>
      </div>
    </>
  );
}
