import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    notFound()
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-2xl mt-2 font-medium">
            ${(product.price / 100).toFixed(2)}
          </p>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Scent Notes
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.scentNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </p>

          <button
            disabled={product.stock === 0}
            className="mt-8 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  )
}