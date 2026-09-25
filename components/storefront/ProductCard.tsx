import type { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatCad } from "@/lib/format";
import { getProductVisual } from "@/lib/productVisuals";

export function ProductCard({ product }: { product: Product }) {
  const visual = getProductVisual(product.slug);

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="product-image-wrap relative aspect-[4/5] overflow-hidden bg-card">
        <Image
          fill
          alt={visual.alt}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          sizes="(min-width: 768px) 33vw, 100vw"
          src={product.imageUrl}
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-foreground">{product.name}</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            30 mL Eau de Parfum
          </p>
        </div>
        <span className="pt-1 text-sm text-primary">
          {formatCad(product.price)} CAD
        </span>
      </div>
    </Link>
  );
}
