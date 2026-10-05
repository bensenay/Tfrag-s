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
    <div className="min-w-0 max-w-full overflow-x-clip">
      <section id="top" className="image-vignette relative min-h-[92svh] overflow-hidden bg-ink">
        <Image
          fill
          priority
          unoptimized
          alt="The House of Polaris fragrance collection in golden light"
          className="object-cover object-center"
          sizes="100vw"
          src="/images/collection-trio-wide.png"
        />
        <div className="absolute inset-0 bg-background/20" />
        <div className="relative z-10 flex min-h-[92svh] flex-col items-center justify-center px-6 pt-28 text-center md:pt-32">
          <h1 className="max-w-4xl font-serif text-5xl leading-[0.9] sm:text-6xl md:text-7xl lg:text-[7.5rem]">
            A stage for<br /><em>distant lights.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-foreground/80 md:text-lg md:leading-8">
            Handmade perfume, for enthusiasts from an enthusiast. Indulge in three unique scents that are <em>out of this world.</em>
          </p>
          <Link href="#collection" className={`${primaryButtonClass} mt-10`}>
            Discover the collection
          </Link>
          <ArrowDown className="absolute bottom-8 size-4 animate-bounce text-primary/70" />
        </div>
      </section>

      <section id="house" className="bg-background px-6 py-28 md:py-44">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary md:text-sm">The house</p>
          <h2 className="mt-8 font-serif text-4xl leading-tight md:text-7xl">
            “All I want to do is share my passion with the world.”
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
            Who am I? I am the new kid on the block, a one-man operation here to compete with the great houses and perfumeries that I have spent so many years basking myself in their creations. Only my goal is not to compete, but to share. To share all that I’ve learnt, through my university studies in physiology of the human body, through my personal journey sniffing everything I could get my hands on, through my countless hours testing my own formulations in my basement. And what I’ve come up with is a brand that I am proud of. Three scents. Uniquely my own. An amalgamation of my life story, each familiar, but completely new. I truly hope you can enjoy them as much as I have.
          </p>
          <p className="mt-5 font-serif text-2xl italic text-primary">— Thomas</p>
        </Reveal>
      </section>

      <section className="grid min-h-[75svh] md:grid-cols-2">
        <div className="relative min-h-[60svh] overflow-hidden bg-ink">
          <Image fill unoptimized alt="House of Polaris bottles arranged on carved wood" className="object-cover object-center" sizes="(min-width: 768px) 50vw, 100vw" src="/images/collection-flatlay-wide.png" />
        </div>
        <div className="flex items-center bg-ember px-7 py-20 md:px-16">
          <Reveal className="max-w-lg">
            <p className="eyebrow">Handmade perfume, from A to Z.</p>
            <h2 className="mt-6 font-serif text-4xl leading-none sm:text-5xl md:text-7xl">
              No two bottles<br /><em>will ever be the same.</em>
            </h2>
            <p className="mt-7 text-sm leading-7 text-foreground/70">
              The juice is made in house. The bottles, sealed by my hands. The cap, carefully chiselled by hand-tools. When you hold a bottle, you can be sure that there are no others like it.
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
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl md:text-7xl">Three points of light.</h2>
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
