type ProductContent = {
  detailDescription: string;
  storyHeading?: string;
};

const productContent: Record<string, ProductContent> = {
  "bear-hug": {
    detailDescription:
      "Bear Hug opens wet and light, with the smell of dew drops and white florals such as lily of the valley and jasmine. The heart of the fragrance is unmistakable green, with notes of grass and luscious rose. At the base lies a warm, velvety embrace of white musk, oakmoss, skin and animalic musk.",
  },
  "cloak-and-dagger": {
    detailDescription:
      "Cloak and Dagger opens with a blast of cardamom and cedarwood, which subdues rapidly yet remains present all throughout. Eventually, the scent takes on a warm amber, and different woods begin to showcase. In the heart, sandalwood asserts its smooth, creamy character. It is topped off with a dash of black pepper. Eventually, a pungent birch tar emerges from the background and leaves a lasting impression.",
  },
  "the-palace-in-the-meadow": {
    storyHeading: "The Palace in the Meadow",
    detailDescription:
      "The Palace in the Meadow opens with sweet fruit. It is dominated by apple, but ripe pear lends a hand, as well as orange blossoms and bergamot. As a counterpoint to the sweetness, the fruits are harnessed by a thick grass, strongly green. The top notes are supported by middle notes of fuzzy cashmere and mint. The base notes anchor the whole composition, subtle, but present throughout are deep woods, burnt sugar, and vanilla.",
  },
};

export const getProductContent = (slug: string): ProductContent =>
  productContent[slug] ?? {
    detailDescription:
      "A singular House of Polaris composition, made and finished by hand.",
  };
