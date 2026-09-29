export type ProductVisual = {
  alt: string;
  eyebrow: string;
  scene: string;
};

const visuals: Record<string, ProductVisual> = {
  "bear-hug": {
    alt: "Bear Hug fragrance bottle glowing beside a glass bear in golden light",
    eyebrow: "No. 01 · The wild",
    scene: "/images/bear-hug-scene-wide.png",
  },
  "cloak-and-dagger": {
    alt: "Cloak & Dagger fragrance bottle in a narrow beam of amber light",
    eyebrow: "No. 02 · The spicy",
    scene: "/images/cloak-and-dagger-scene-wide.png",
  },
  "the-palace-in-the-meadow": {
    alt: "The Palace in the Meadow fragrance bottle in soft morning light",
    eyebrow: "No. 03 · The green",
    scene: "/images/the-palace-in-the-meadow-scene-wide.png",
  },
};

export const getProductVisual = (slug: string): ProductVisual =>
  visuals[slug] ?? {
    alt: "House of Polaris fragrance bottle",
    eyebrow: "30 mL Extrait de Parfum",
    scene: "/images/collection-trio-wide.png",
  };
