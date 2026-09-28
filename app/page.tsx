import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FeaturedCarousel } from "@/components/storefront/FeaturedCarousel";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Reveal } from "@/components/storefront/Reveal";
import { primaryButtonClass, quietButtonClass } from "@/components/storefront/styles";
import { prisma } from "@/lib/prisma";
import { getProductVisual } from "@/lib/productVisuals";

export const metadata: Metadata = {
  title: "Fragrance Beyond the Familiar",
  description:
    "Discover three singular fragrances shaped by wild earth, distant stars, and the mystery between them.",
};

const productOrder = [
  "bear-hug",
  "cloak-and-dagger",
  "the-palace-in-the-meadow",
];

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { slug: { in: productOrder } },
  });
  const orderedProducts = productOrder.flatMap((slug) => {
    const product = products.find((item) => item.slug === slug);
    return product ? [product] : [];
  });
  const featuredProducts = orderedProducts.map((product) => {
    const visual = getProductVisual(product.slug);
    return {
      description: product.description,
      eyebrow: visual.eyebrow,
      id: product.id,
      imageAlt: visual.alt,
      name: product.name,
      scene: visual.scene,
      slug: product.slug,
    };
  });

  return (
    <div>
      <section id="top" className="image-vignette relative min-h-[92svh] overflow-hidden bg-ink">
        <Image
          fill
          priority
          alt=""
          aria-hidden="true"
          className="scale-110 object-cover opacity-35 blur-2xl"
          sizes="100vw"
          src="/images/collection-trio.png"
        />
        <Image
          fill
          priority
          alt="The House of Polaris fragrance collection in golden light"
          className="object-contain"
          sizes="100vw"
          src="/images/collection-trio.png"
        />
        <div className="absolute inset-0 bg-background/20" />
        <div className="relative z-10 flex min-h-[92svh] flex-col items-center justify-center px-6 pt-20 text-center">
          <p className="eyebrow mb-7">Fine fragrance · 30 mL</p>
          <h1 className="max-w-4xl font-serif text-6xl leading-[0.88] md:text-8xl lg:text-[8.5rem]">
            A stage for<br /><em>distant lights.</em>
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-foreground/70">
            Three olfactory stories, composed where the frontier meets the night sky.
          </p>
          <Link href="#collection" className={`${primaryButtonClass} mt-10`}>
            Discover the collection
          </Link>
          <ArrowDown className="absolute bottom-8 size-4 animate-bounce text-primary/70" />
        </div>
      </section>

      <section id="house" className="bg-background px-6 py-28 md:py-44">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">The house</p>
          <h2 className="mt-8 font-serif text-4xl leading-tight md:text-7xl">
            “We bottle the feeling of looking up from a dark, open plain.”
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-muted-foreground">
            House of Polaris creates intimate fragrances for those drawn to mystery, material, and memory. Every bottle is crowned with its own piece of volcanic stone.
          </p>
        </Reveal>
      </section>

      <section className="grid min-h-[75svh] md:grid-cols-2">
        <div className="relative min-h-[60svh] bg-ink">
          <Image fill alt="House of Polaris bottles arranged on carved wood" className="object-contain" sizes="(min-width: 768px) 50vw, 100vw" src="/images/collection-flatlay.png" />
        </div>
        <div className="flex items-center bg-ember px-7 py-20 md:px-16">
          <Reveal className="max-w-lg">
            <p className="eyebrow">Objects from elsewhere</p>
            <h2 className="mt-6 font-serif text-5xl leading-none md:text-7xl">
              Each stone,<br /><em>unchosen by chance.</em>
            </h2>
            <p className="mt-7 text-sm leading-7 text-foreground/70">
              Every cap is naturally formed volcanic rock. No two silhouettes repeat; each bottle arrives as its own small terrain.
            </p>
            <Link href="#collection" className={`${quietButtonClass} mt-9`}>Find yours</Link>
          </Reveal>
        </div>
      </section>

      <FeaturedCarousel products={featuredProducts} />

      <section id="collection" className="scroll-mt-20 bg-background px-6 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-14 flex items-end justify-between gap-5">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 className="mt-4 font-serif text-5xl md:text-7xl">Three points of light.</h2>
            </div>
          </Reveal>
          <div className="grid gap-12 md:grid-cols-3 md:gap-5">
            {orderedProducts.map((product, index) => (
              <Reveal key={product.id} className={index === 1 ? "md:mt-16" : ""}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
