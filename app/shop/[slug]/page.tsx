import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";
import { Reveal } from "@/components/storefront/Reveal";
import { prisma } from "@/lib/prisma";
import { getProductVisual } from "@/lib/productVisuals";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  return product
    ? { title: product.name, description: product.description }
    : { title: "Fragrance Not Found" };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const visual = getProductVisual(product.slug);
  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-background">
      <section className="relative min-h-screen overflow-hidden bg-ink">
        <Image
          fill
          priority
          unoptimized
          alt={visual.alt}
          className="object-cover object-center"
          sizes="100vw"
          src={visual.scene}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-background/20 md:bg-gradient-to-r md:from-background/80 md:via-background/10 md:to-background/35" />
        <div className="section-shell relative z-10 flex min-h-screen min-w-0 items-end pb-16 pt-32 md:pb-20">
          <Reveal className="min-w-0 max-w-xl">
            <p className="eyebrow">{visual.eyebrow}</p>
            <h1 className="mt-5 max-w-2xl break-words font-serif text-5xl leading-[0.9] sm:text-6xl md:text-8xl">{product.name}</h1>
          </Reveal>
        </div>
      </section>

      <section className="grid min-w-0 min-h-[80svh] md:grid-cols-2">
        <div className="relative flex min-h-[65svh] min-w-0 items-center justify-center bg-white p-2 md:min-h-[80svh] md:p-6">
          <Reveal className="relative h-[62svh] w-full md:h-[74svh]">
            <Image fill unoptimized alt={`${product.name} fragrance bottle`} className="object-contain" sizes="(min-width: 768px) 50vw, 100vw" src={product.imageUrl} />
          </Reveal>
        </div>
        <div className="flex min-w-0 items-center px-7 py-24 md:px-20">
          <Reveal className="min-w-0 max-w-xl">
            <p className="eyebrow">The story</p>
            <h2 className="mt-6 font-serif text-4xl sm:text-5xl md:text-7xl">A world held close.</h2>
            <p className="mt-7 text-sm leading-8 text-muted-foreground">{product.description}</p>
            <AddToCartButton productId={product.id} price={product.price} stock={product.stock} />
            <div className="mt-12 divide-y divide-border border-y border-border">
              {product.scentNotes.map((note, index) => (
                <div key={note} className="flex justify-between gap-5 py-5">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-primary">Note {String(index + 1).padStart(2, "0")}</span>
                  <span className="text-right text-sm capitalize text-foreground/75">{note}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
