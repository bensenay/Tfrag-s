import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      legacySlug: 'amber-nocturne',
      name: 'Bear Hug',
      slug: 'bear-hug',
      description: 'A warm embrace beneath a wide-open night sky, where glowing amber, soft woods, and vanilla settle close to the skin.',
      price: 15000, // CAD $150.00 in cents
      imageUrl: '/images/bear-hug.png',
      scentNotes: ['golden amber', 'vanilla suede', 'cedarwood'],
      stock: 25,
    },
    {
      legacySlug: 'citrus-verde',
      name: 'Cloak & Dagger',
      slug: 'cloak-and-dagger',
      description: 'A shadowy trail through moonlit pines, sharpened with black pepper and wrapped in smoke, leather, and quiet intrigue.',
      price: 15000,
      imageUrl: '/images/cloak-and-dagger.png',
      scentNotes: ['black pepper', 'pine smoke', 'worn leather'],
      stock: 40,
    },
    {
      legacySlug: 'velvet-oud',
      name: 'The Palace in the Meadow',
      slug: 'the-palace-in-the-meadow',
      description: 'A sunlit mirage on the prairie, blooming with wildflowers, warm hay, and luminous musk beneath a celestial blue sky.',
      price: 15000,
      imageUrl: '/images/the-palace-in-the-meadow.png',
      scentNotes: ['prairie wildflowers', 'sun-warmed hay', 'white musk'],
      stock: 15,
    },
  ]

  await prisma.$transaction(async (tx) => {
    for (const { legacySlug, ...product } of products) {
      const [legacyProduct, currentProduct] = await Promise.all([
        tx.product.findUnique({ where: { slug: legacySlug } }),
        tx.product.findUnique({ where: { slug: product.slug } }),
      ])

      if (legacyProduct && !currentProduct) {
        await tx.product.update({
          where: { id: legacyProduct.id },
          data: product,
        })
        continue
      }

      const seededProduct = await tx.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      })

      if (legacyProduct) {
        await tx.orderItem.updateMany({
          where: { productId: legacyProduct.id },
          data: { productId: seededProduct.id },
        })
        await tx.product.delete({ where: { id: legacyProduct.id } })
      }
    }
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
