import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      legacySlug: 'amber-nocturne',
      name: 'Bear Hug',
      slug: 'bear-hug',
      description: 'As I lie in the dewy grass, I look up at the night sky through the canopy of the trees. The smell of wildflowers is carried over by the warm evening wind. Somewhere nearby, a fierce predator lurks, unbothered by my presence.',
      price: 18500, // CAD $185.00 in cents
      imageUrl: '/images/bear-hug.png',
      scentNotes: ['dew drops', 'lily of the valley', 'jasmine'],
      stock: 10,
    },
    {
      legacySlug: 'citrus-verde',
      name: 'Cloak & Dagger',
      slug: 'cloak-and-dagger',
      description: 'The wooden floorboards creek ever so slightly under my weight. The light of the stars peer through the window, curious as to my intrusion. I have work to do…',
      price: 18500,
      imageUrl: '/images/cloak-and-dagger.png',
      scentNotes: ['cardamom', 'cedarwood', 'black pepper'],
      stock: 10,
    },
    {
      legacySlug: 'velvet-oud',
      name: 'The Palace in the Meadow',
      slug: 'the-palace-in-the-meadow',
      description: 'The princess strolls her vast orchard, the trees are bare following the fall harvest. Oblivious, she rambles on. The kitchen, however, is in full swing, producing a seemingly endless horde of apple pies, preparing for the feast.',
      price: 18500,
      imageUrl: '/images/the-palace-in-the-meadow.png',
      scentNotes: ['apple', 'pear', 'orange blossom'],
      stock: 10,
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
