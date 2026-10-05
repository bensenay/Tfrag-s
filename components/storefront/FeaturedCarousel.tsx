"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type FeaturedProduct = {
  description: string;
  eyebrow: string;
  id: string;
  imageAlt: string;
  name: string;
  scene: string;
  slug: string;
};

export function FeaturedCarousel({ products }: { products: FeaturedProduct[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const product = products[activeIndex];

  if (!product) return null;

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) =>
      (current + direction + products.length) % products.length,
    );
  };

  return (
    <section aria-label="Featured fragrances" className="relative w-full max-w-full overflow-hidden bg-ink">
      <div className="relative mx-auto h-[82svh] min-h-[560px] w-full max-w-[1440px] md:min-h-[620px] md:max-h-[900px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={product.id}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
            exit={{ opacity: 0, scale: 0.985 }}
            initial={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              fill
              priority={activeIndex === 0}
              unoptimized
              alt={product.imageAlt}
              className="object-cover object-center"
              sizes="100vw"
              src={product.scene}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/5 to-background/5" />
        <div className="section-shell relative z-10 flex h-full min-w-0 items-end pb-24 md:pb-20">
          <motion.div
            key={product.slug}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0 max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <p className="eyebrow">{product.eyebrow}</p>
            <h2 className="mt-4 break-words font-serif text-5xl leading-[0.9] sm:text-6xl md:text-8xl">{product.name}</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-foreground/80">
              {product.description}
            </p>
            <Link
              href={`/shop/${product.slug}`}
              className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-primary"
            >
              Enter the story <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-7 right-4 z-20 flex items-center gap-3 md:bottom-16 md:right-10">
          <button
            type="button"
            aria-label="Previous fragrance"
            className="grid size-14 place-items-center rounded-full border-2 border-primary/80 bg-background/85 text-primary shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-background md:size-16"
            onClick={() => move(-1)}
          >
            <ArrowLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Next fragrance"
            className="grid size-14 place-items-center rounded-full border-2 border-primary/80 bg-background/85 text-primary shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-background md:size-16"
            onClick={() => move(1)}
          >
            <ArrowRight className="size-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
