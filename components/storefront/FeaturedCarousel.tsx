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
    <section aria-label="Featured fragrances" className="relative overflow-hidden bg-ink">
      <div className="relative mx-auto h-[82svh] max-h-[900px] min-h-[620px] max-w-[1440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
            exit={{ opacity: 0, scale: 0.985 }}
            initial={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <Image
              fill
              alt=""
              aria-hidden="true"
              className="scale-110 object-cover opacity-30 blur-2xl"
              sizes="100vw"
              src={product.scene}
            />
            <Image
              fill
              priority={activeIndex === 0}
              alt={product.imageAlt}
              className="object-contain"
              sizes="100vw"
              src={product.scene}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/5 to-background/5" />
        <div className="section-shell relative z-10 flex h-full items-end pb-16 md:pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.slug}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg"
              exit={{ opacity: 0, y: 12 }}
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.4 }}
            >
              <p className="eyebrow">{product.eyebrow}</p>
              <h2 className="mt-4 font-serif text-6xl md:text-8xl">{product.name}</h2>
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
          </AnimatePresence>
        </div>

        <div className="absolute bottom-7 right-6 z-20 flex items-center gap-2 md:bottom-16 md:right-10">
          <button
            type="button"
            aria-label="Previous fragrance"
            className="grid size-12 place-items-center rounded-full border border-primary/50 bg-background/70 text-primary backdrop-blur-md transition hover:bg-background"
            onClick={() => move(-1)}
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next fragrance"
            className="grid size-12 place-items-center rounded-full border border-primary/50 bg-background/70 text-primary backdrop-blur-md transition hover:bg-background"
            onClick={() => move(1)}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
