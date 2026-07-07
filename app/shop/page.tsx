import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Shop All Fragrances</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full aspect-square bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <h2 className="font-medium text-lg">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
              <p className="mt-2 font-semibold">
                ${(product.price / 100).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}