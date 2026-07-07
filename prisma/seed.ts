import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      name: 'Amber Nocturne',
      slug: 'amber-nocturne',
      description: 'A warm, seductive blend of amber, vanilla, and sandalwood. Perfect for evening wear.',
      price: 8900, // $89.00 in cents
      imageUrl: '/images/amber-nocturne.jpg',
      scentNotes: ['amber', 'vanilla', 'sandalwood'],
      stock: 25,
    },
    {
      name: 'Citrus Verde',
      slug: 'citrus-verde',
      description: 'Fresh and energizing, with notes of bergamot, lime, and green tea.',
      price: 6500,
      imageUrl: '/images/citrus-verde.jpg',
      scentNotes: ['bergamot', 'lime', 'green tea'],
      stock: 40,
    },
    {
      name: 'Velvet Oud',
      slug: 'velvet-oud',
      description: 'A rich, smoky oud fragrance with hints of rose and leather.',
      price: 12000,
      imageUrl: '/images/velvet-oud.jpg',
      scentNotes: ['oud', 'rose', 'leather'],
      stock: 15,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

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