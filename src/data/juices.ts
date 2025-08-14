export interface Juice {
  slug: string;
  name: string;
  price: number;
  benefit: string;
  ingredients: string;
  img: string;
  shopifyHandle: string;
  variantId: string;
}

export const juices: Juice[] = [
  {
    slug: "weight-loss-juice",
    name: "Weight Loss Juice",
    price: 7.99,
    benefit: "Supports metabolism and cleanses naturally.",
    ingredients: "Celery (1 stalk), Spinach (1 cup), Apple (1), Cucumber (½ cup), Lime (½ fruit)",
    img: "/images/juices/weight-loss-juice.jpg",
    shopifyHandle: "weight-loss-juice",
    variantId: "REPLACE_ME"
  },
  {
    slug: "hydration-juice",
    name: "Hydration Juice",
    price: 7.99,
    benefit: "Replenishes fluids and electrolytes fast.",
    ingredients: "Pineapple (¾ cup), Watermelon (¾ cup)",
    img: "/images/juices/hydration-juice.jpg",
    shopifyHandle: "hydration-juice",
    variantId: "REPLACE_ME"
  },
  {
    slug: "lung-detox",
    name: "Lung Detox",
    price: 7.99,
    benefit: "Helps clear airways for easier breathing.",
    ingredients: "Cucumber (1 cup), Pineapple (½ cup), Ginger (1 tsp), Apple (½ cup)",
    img: "/images/juices/lung-detox.jpg",
    shopifyHandle: "lung-detox",
    variantId: "REPLACE_ME"
  },
  {
    slug: "glowing-skin-juice",
    name: "Glowing Skin Juice",
    price: 7.99,
    benefit: "Promotes clear, radiant complexion.",
    ingredients: "Carrots (1 cup), Lemon (¼ fruit), Orange (½ fruit), Cucumber (½ cup), Ginger (1 tsp), Apple (½ cup)",
    img: "/images/juices/glowing-skin-juice.jpg",
    shopifyHandle: "glowing-skin-juice",
    variantId: "REPLACE_ME"
  },
  {
    slug: "cold-flu-juice",
    name: "Cold & Flu Juice",
    price: 7.99,
    benefit: "Boosts immunity and soothes seasonal sniffles.",
    ingredients: "Apple (1), Lemon (½ fruit), Carrots (½ cup), Ginger (1 tsp)",
    img: "/images/juices/cold-flu-juice.jpg",
    shopifyHandle: "cold-flu-juice",
    variantId: "REPLACE_ME"
  },
  {
    slug: "beet-cleanse",
    name: "Beet Cleanse",
    price: 7.99,
    benefit: "Detoxes liver and purifies blood.",
    ingredients: "Carrots (1 cup), Beets (½ cup), Lemon (½ fruit), Ginger (1 tsp)",
    img: "/images/juices/beet-cleanse.jpg",
    shopifyHandle: "beet-cleanse",
    variantId: "REPLACE_ME"
  },
  {
    slug: "natural-vigara",
    name: "Natural Vigara",
    price: 7.99,
    benefit: "Enhances circulation and lasting vitality.",
    ingredients: "Celery (1 stalk), Cucumber (1 cup), Apple (½ cup), Ginger (1 tsp)",
    img: "/images/juices/natural-vigara.jpg",
    shopifyHandle: "natural-vigara",
    variantId: "REPLACE_ME"
  },
  {
    slug: "sunshine-juice",
    name: "Sunshine Juice",
    price: 7.99,
    benefit: "Uplifts mood with a vitamin C kick.",
    ingredients: "Orange (1), Watermelon (½ cup), Pineapple (½ cup)",
    img: "/images/juices/sunshine-juice.jpg",
    shopifyHandle: "sunshine-juice",
    variantId: "REPLACE_ME"
  }
];

export const getJuiceBySlug = (slug: string): Juice | undefined => {
  return juices.find(juice => juice.slug === slug);
};