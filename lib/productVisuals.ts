export type ProductVisual = {
  alt: string;
  eyebrow: string;
  scene: string;
};

const visuals: Record<string, ProductVisual> = {
  "bear-hug": {
    alt: "Bear Hug fragrance bottle glowing beside a glass bear in golden light",
    eyebrow: "No. 01 · The warm one",
    scene: "/images/bear-hug-scene.png",
  },
  "cloak-and-dagger": {
    alt: "Cloak & Dagger fragrance bottle in a narrow beam of amber light",
    eyebrow: "No. 02 · The shadowed one",
    scene: "/images/cloak-and-dagger-scene.png",
  },
  "the-palace-in-the-meadow": {
    alt: "The Palace in the Meadow fragrance bottle in soft morning light",
    eyebrow: "No. 03 · The green one",
    scene: "/images/the-palace-in-the-meadow-scene.png",
  },
};

export const getProductVisual = (slug: string): ProductVisual =>
  visuals[slug] ?? {
    alt: "House of Polaris fragrance bottle",
    eyebrow: "30 mL Eau de Parfum",
    scene: "/images/collection-trio.png",
  };
