import type { Metadata } from "next";
import { CartClient } from "@/components/storefront/CartClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your selected House of Polaris fragrances.",
};

export default async function CartPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      imageUrl: true,
      name: true,
      price: true,
      slug: true,
      stock: true,
    },
  });

  return (
    <div className="min-h-screen px-6 pb-28 pt-36 md:px-8 md:pt-44">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Your selection</p>
        <h1 className="mt-4 font-serif text-6xl md:text-8xl">Cart</h1>
        <div className="mt-14">
          <CartClient products={products} />
        </div>
      </div>
    </div>
  );
}
