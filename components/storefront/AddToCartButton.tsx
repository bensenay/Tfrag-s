"use client";

import { useState } from "react";
import { formatCad } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { primaryButtonClass } from "@/components/storefront/styles";

export function AddToCartButton({
  productId,
  price,
  stock,
}: {
  productId: string;
  price: number;
  stock: number;
}) {
  const add = useCartStore((state) => state.add);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={`${primaryButtonClass} mt-9 w-full sm:w-auto`}
      disabled={stock === 0}
      onClick={() => {
        add(productId);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      {stock === 0
        ? "Currently unavailable"
        : added
          ? "Added to cart"
          : `Add to cart — ${formatCad(price)} CAD`}
    </button>
  );
}
