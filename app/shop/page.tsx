import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Reveal } from "@/components/storefront/Reveal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Explore the complete House of Polaris fragrance collection.",
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-background px-6 pb-28 pt-36 md:px-8 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="eyebrow">The collection</p>
          <h1 className="mt-5 font-serif text-6xl md:text-8xl">Three points of light.</h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
            Each composition begins with a place, a feeling, and a question left unanswered.
          </p>
        </Reveal>
        <div className="mt-16 border-b border-border pb-5 text-center text-[10px] uppercase tracking-[0.18em] text-primary">
          All fragrances · 30 mL Eau de Parfum
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-5">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </div>
  );
}
