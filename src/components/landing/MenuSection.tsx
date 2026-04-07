import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Flame, Zap } from "lucide-react";
import { Link } from "react-router-dom";

// Product images
import tropicalBreeze from "@/assets/product-tropical-breeze.png";
import lungDetox from "@/assets/product-lung-detox.png";
import gingerShot from "@/assets/product-ginger-shot.png";
import glowUp from "@/assets/product-glow-up.png";
import hydrationReset from "@/assets/product-hydration-reset.png";
import beetFlow from "@/assets/product-beet-flow.png";
import mucusCleanse from "@/assets/juice-mucus-cleanse.png";
import vitalFlow from "@/assets/juice-vital-flow.png";
import sunshineStarter from "@/assets/juice-sunshine-starter.png";
import coldFlu from "@/assets/juice-cold-flu.png";
import mangoMansa from "@/assets/product-mango-mansa.png";

interface Product {
  slug: string;
  name: string;
  purpose: string;
  ingredients: string;
  image: string;
  stripeLink: string;
  isGingerShot?: boolean;
  badge?: string;
  urgency?: string;
}

const availableNow: Product[] = [
  {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    purpose: "Hydration • Energy • Mood",
    ingredients: "Pineapple, Apple, Lemon, Ginger",
    image: tropicalBreeze,
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b",
  },
  {
    slug: "mango-mansa",
    name: "Mango Mansa",
    purpose: "Solar Energy • Mood • Vitality",
    ingredients: "Mango, Strawberry, Lemon, Ginger",
    image: mangoMansa,
    stripeLink: "",
    badge: "🔥 New Drop",
    urgency: "High Demand",
  },
  {
    slug: "beet-flow",
    name: "Beet Flow",
    purpose: "Circulation • Heart health",
    ingredients: "Beet, Carrot, Lemon, Ginger",
    image: beetFlow,
    stripeLink: "",
  },
  {
    slug: "island-mystery",
    name: "Island Mystery",
    purpose: "Tropical • Refreshing • Bold",
    ingredients: "Seasonal Tropical Blend",
    image: tropicalBreeze,
    stripeLink: "",
    badge: "Limited Batch",
    urgency: "Only a few left",
  },
];

const gingerShots: Product[] = [
  {
    slug: "ginger-shot",
    name: "Ginger Shot",
    purpose: "Immunity • Digestion • Circulation",
    ingredients: "Ginger, Lemon",
    image: gingerShot,
    stripeLink: "https://buy.stripe.com/7sY28q2R7d7M48U9M61B609",
    isGingerShot: true,
  },
];

const madeToOrder: Product[] = [
  {
    slug: "lung-detox",
    name: "Lung Detox",
    purpose: "Breathing • Chest clarity • Circulation",
    ingredients: "Cucumber, Pineapple, Apple, Ginger",
    image: lungDetox,
    stripeLink: "",
  },
  {
    slug: "hydration-reset",
    name: "Hydration Reset",
    purpose: "Refresh • Revitalize • Recovery",
    ingredients: "Pineapple, Watermelon",
    image: hydrationReset,
    stripeLink: "",
  },
  {
    slug: "glow-up",
    name: "Glow Up",
    purpose: "Clear skin • Boost • Energize",
    ingredients: "Carrot, Orange, Cucumber, Apple, Ginger, Lemon",
    image: glowUp,
    stripeLink: "",
  },
  {
    slug: "mucus-cleanse",
    name: "Mucus Cleanse",
    purpose: "Chest congestion • Sinus support",
    ingredients: "Pineapple, Cucumber, Apple, Lime, Ginger",
    image: mucusCleanse,
    stripeLink: "",
  },
  {
    slug: "cold-flu-defense",
    name: "Cold & Flu Defense",
    purpose: "Immune support",
    ingredients: "Orange, Turmeric, Apple, Ginger, Garlic",
    image: coldFlu,
    stripeLink: "",
  },
  {
    slug: "vital-flow",
    name: "Vital Flow",
    purpose: "Blood flow • Performance",
    ingredients: "Celery, Cucumber, Apple",
    image: vitalFlow,
    stripeLink: "",
  },
  {
    slug: "sunshine-starter",
    name: "Sunshine Starter",
    purpose: "Morning energy • Mood",
    ingredients: "Orange, Watermelon, Pineapple",
    image: sunshineStarter,
    stripeLink: "",
  },
];

interface ProductCardProps {
  product: Product;
  status: "in-stock" | "preorder";
}

const ProductCard = ({ product, status }: ProductCardProps) => {
  const isInStock = status === "in-stock";
  const regularPrice = product.isGingerShot ? "$4" : "$6";
  const memberPrice = product.isGingerShot ? "$3" : "$5";

  return (
    <Card className="overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 bg-card shadow-sm hover:shadow-lg group h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image */}
        <div className="aspect-[4/5] bg-muted/20 flex items-center justify-center overflow-hidden relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
            loading="lazy"
          />
          {/* Urgency badge overlay */}
          {product.urgency && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-red-500 text-white border-0 text-xs font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {product.urgency}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex flex-col flex-1">
          {/* Status Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant={isInStock ? "default" : "secondary"}
              className={isInStock 
                ? "bg-primary text-primary-foreground w-fit" 
                : "bg-muted text-muted-foreground w-fit"
              }
            >
              {isInStock ? "In Stock" : "Made to Order"}
            </Badge>
            {product.badge && (
              <Badge className="bg-amber-500 text-white w-fit border-0">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Name & Purpose */}
          <div>
            <h3 className="font-heading font-bold text-xl text-foreground">
              {product.name}
            </h3>
            <p className="text-sm text-primary font-medium mt-1">
              {product.purpose}
            </p>
          </div>

          {/* Ingredients */}
          <p className="text-sm text-muted-foreground">
            {product.ingredients}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{regularPrice}</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-primary">{memberPrice} Member</span>
          </div>

          {/* CTA - Push to bottom */}
          <div className="pt-3 space-y-2 mt-auto">
            {product.stripeLink ? (
              <Button asChild className="w-full h-12">
                <a href={product.stripeLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Buy Now — {regularPrice}
                </a>
              </Button>
            ) : (
              <Button asChild className="w-full h-12" variant="outline">
                <Link to="/fuel">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order Now — {regularPrice}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState<"available" | "made-to-order">("available");

  return (
    <section id="menu" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Our Menu
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fresh, functional juices crafted for performance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-muted rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all ${
                activeTab === "available"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ready Today – Same-Day Delivery
            </button>
            <button
              onClick={() => setActiveTab("made-to-order")}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all ${
                activeTab === "made-to-order"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Made-to-Order
            </button>
          </div>
        </div>

        {/* Available Now Tab */}
        {activeTab === "available" && (
          <div className="space-y-16">
            {/* Banner */}
            <div className="bg-primary/10 text-primary text-center py-3 rounded-lg font-semibold text-sm">
              Order by 3PM → Delivered Today
            </div>
            {/* Ready Today Juices */}
            <div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-8 text-center">
                Ready Today
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {availableNow.map((product) => (
                  <ProductCard key={product.slug} product={product} status="in-stock" />
                ))}
              </div>
            </div>

            {/* Ginger Shots */}
            <div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-8 text-center">
                Ginger Shots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-sm mx-auto sm:max-w-none">
                {gingerShots.map((product) => (
                  <ProductCard key={product.slug} product={product} status="in-stock" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Made-to-Order Tab */}
        {activeTab === "made-to-order" && (
          <div>
            <div className="text-center mb-10">
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Pressed the day you order. Delivered today.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {madeToOrder.map((product) => (
                <ProductCard key={product.slug} product={product} status="preorder" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
