import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";
import { Reveal } from "@/components/storefront/Reveal";
import { formatCad } from "@/lib/format";
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
  const relatedProducts = await prisma.product.findMany({
    where: { id: { not: product.id } },
    take: 2,
  });

  return (
    <div className="bg-background">
      <section className="relative min-h-screen overflow-hidden">
        <Image fill priority alt={visual.alt} className="object-cover" sizes="100vw" src={visual.scene} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-background/35" />
        <div className="section-shell relative z-10 flex min-h-screen items-end pb-14 pt-32 md:items-center md:pb-0">
          <Reveal className="max-w-xl">
            <Link href="/shop" className="mb-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-foreground/65">
              <ArrowLeft className="size-4" /> Collection
            </Link>
            <p className="eyebrow">{visual.eyebrow}</p>
            <h1 className="mt-5 max-w-2xl font-serif text-6xl leading-[0.9] md:text-8xl">{product.name}</h1>
            <p className="mt-5 text-sm text-primary">{formatCad(product.price)} CAD</p>
            <p className="mt-7 max-w-md text-sm leading-7 text-foreground/75">{product.description}</p>
            <AddToCartButton productId={product.id} price={product.price} stock={product.stock} />
          </Reveal>
        </div>
      </section>

      <section className="grid min-h-[80svh] md:grid-cols-2">
        <div className="spotlight-backdrop relative flex min-h-[65svh] items-center justify-center p-10 md:p-20">
          <Reveal className="relative h-[55svh] w-full max-w-xl">
            <Image fill alt={visual.alt} className="object-contain mix-blend-screen" sizes="(min-width: 768px) 50vw, 100vw" src={product.imageUrl} />
          </Reveal>
        </div>
        <div className="flex items-center px-7 py-24 md:px-20">
          <Reveal className="max-w-xl">
            <p className="eyebrow">The story</p>
            <h2 className="mt-6 font-serif text-5xl md:text-7xl">A world held close.</h2>
            <p className="mt-7 text-sm leading-8 text-muted-foreground">{product.description}</p>
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

      <section className="px-6 py-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-10">Continue across the sky</p>
          <div className="grid gap-5 md:grid-cols-2">
            {relatedProducts.map((item) => {
              const relatedVisual = getProductVisual(item.slug);
              return (
                <Link key={item.id} href={`/shop/${item.slug}`} className="group relative aspect-[5/3] overflow-hidden">
                  <Image fill alt={relatedVisual.alt} className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" sizes="(min-width: 768px) 50vw, 100vw" src={relatedVisual.scene} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <h3 className="absolute bottom-7 left-7 font-serif text-4xl">{item.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
