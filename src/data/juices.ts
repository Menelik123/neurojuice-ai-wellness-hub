export interface Juice {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  benefit: string;
  ingredients: string[];
  priceId: string;
}

export const juices: Juice[] = [
  {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    price: 8.5,
    tagline: "Refresh & Recharge",
    benefit: "A bold tropical blend designed to energize and restore. Pineapple and apple deliver natural sweetness while ginger ignites your metabolism and lemon cleanses from within.",
    ingredients: ["Pineapple", "Apple", "Lemon", "Ginger"],
    priceId: "price_1TKO6cBrboLvMb3yY8lyaESt",
  },
  {
    slug: "beet-flow",
    name: "Beet Flow",
    price: 8.5,
    tagline: "Power Your Heart",
    benefit: "A deep earthy blend built for cardiovascular health. Beets and carrots support blood pressure and circulation while ginger fights inflammation and lemon keeps it bright.",
    ingredients: ["Beet", "Carrot", "Lemon", "Ginger"],
    priceId: "price_1TKO74BrboLvMb3yXLPjBAIE",
  },
  {
    slug: "green-vital",
    name: "Green Vital",
    price: 8.5,
    tagline: "Detox. Restore. Repeat.",
    benefit: "Our most powerful cleanse. Built to flush toxins, support gut health, and reset your system from the inside out. We rotate spinach and swiss chard so your body never stops responding.",
    ingredients: ["Celery", "Green Apple", "Spinach/Swiss Chard", "Cucumber", "Lemon", "Ginger", "Coconut Water"],
    priceId: "price_1TKO7XBrboLvMb3yMe6mH33f",
  },
  {
    slug: "mint-condition",
    name: "Mint Condition",
    price: 8.5,
    tagline: "Perfectly Fresh",
    benefit: "A light hydration blend made for recovery. Watermelon replenishes electrolytes, mint cools and refreshes, and basil brings anti-inflammatory support.",
    ingredients: ["Watermelon", "Mint", "Basil"],
    priceId: "price_1TKO8EBrboLvMb3y6Goj2dI5",
  },
  {
    slug: "strawberry-horizon",
    name: "Strawberry Horizon",
    price: 8.5,
    tagline: "Every Sip, A New Horizon",
    benefit: "A clean, crisp hydration blend that hits different. Strawberry antioxidants, coconut water electrolytes, and lime brightness in every bottle.",
    ingredients: ["Strawberry", "Coconut Water", "Lime"],
    priceId: "price_1TKOIGBrboLvMb3ykaL9NVd6",
  },
  {
    slug: "hibiscus-delight",
    name: "Hibiscus Delight",
    price: 8.5,
    tagline: "Blossom",
    benefit: "A floral wellness blend that works quietly and powerfully. Hibiscus supports heart health, lowers blood pressure, reduces cholesterol, and promotes liver health. Light, refreshing, and purposeful.",
    ingredients: ["Hibiscus", "Coconut Water", "Lemon or Strawberry"],
    priceId: "price_1TKOIhBrboLvMb3y09yYYPiK",
  },
];

export const getJuiceBySlug = (slug: string): Juice | undefined => {
  return juices.find(juice => juice.slug === slug);
};
