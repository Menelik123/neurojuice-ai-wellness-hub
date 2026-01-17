import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Bell } from "lucide-react";

// Product images
import tropicalBreeze from "@/assets/juice-tropical-breeze.png";
import lungDetox from "@/assets/juice-lung-detox.png";
import gingerShot from "@/assets/juice-ginger-shot-new.png";
import glowUp from "@/assets/juice-glow-up.png";
import mucusCleanse from "@/assets/juice-mucus-cleanse.png";
import beetFlow from "@/assets/juice-beet-flow.png";
import vitalFlow from "@/assets/juice-vital-flow.png";
import sunshineStarter from "@/assets/juice-sunshine-starter.png";
import coldFlu from "@/assets/juice-cold-flu.png";

interface Product {
  slug: string;
  name: string;
  purpose: string;
  ingredients: string;
  image: string;
  stripeLink: string;
  isGingerShot?: boolean;
}

// AVAILABLE NOW products
const availableNow: Product[] = [
  {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    purpose: "Hydration • Energy • Mood",
    ingredients: "Pineapple, Watermelon",
    image: tropicalBreeze,
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b",
  },
  {
    slug: "lung-detox",
    name: "Lung Detox",
    purpose: "Breathing • Chest clarity • Circulation",
    ingredients: "Cucumber, Pineapple, Apple, Ginger",
    image: lungDetox,
    stripeLink: "https://buy.stripe.com/9B6bJ00IZgjY0WI9M61B60a",
  },
];

// GINGER SHOTS (Available Now)
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

// MADE-TO-ORDER products (2-3 Day Prep)
const madeToOrder: Product[] = [
  {
    slug: "hydration-reset",
    name: "Hydration Reset",
    purpose: "Low energy • Dehydration • Recovery",
    ingredients: "Pineapple, Watermelon",
    image: tropicalBreeze, // Similar to Tropical Breeze
    stripeLink: "",
  },
  {
    slug: "glow-up",
    name: "Glow Up",
    purpose: "Clear skin • Inner balance",
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
    ingredients: "Apple, Lemon, Carrot, Ginger",
    image: coldFlu,
    stripeLink: "",
  },
  {
    slug: "beet-flow",
    name: "Beet Flow",
    purpose: "Circulation • Kidney support",
    ingredients: "Beet, Carrot, Lemon, Ginger",
    image: beetFlow,
    stripeLink: "",
  },
  {
    slug: "vital-flow",
    name: "Vital Flow",
    purpose: "Blood flow • Performance",
    ingredients: "Celery, Cucumber, Apple, Ginger",
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

const scrollToWaitlist = () => {
  document.querySelector("#waitlist")?.scrollIntoView({ behavior: "smooth" });
};

interface ProductCardProps {
  product: Product;
  status: "in-stock" | "preorder";
}

const ProductCard = ({ product, status }: ProductCardProps) => {
  const isInStock = status === "in-stock";
  const regularPrice = product.isGingerShot ? "$4.99" : "$6.99";
  const memberPrice = product.isGingerShot ? "$3" : "$5";

  return (
    <Card className="overflow-hidden border border-border hover:border-primary/30 transition-all duration-200 bg-card">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-square bg-muted/30 p-4 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain max-h-40"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Status Badge */}
          <Badge 
            variant={isInStock ? "default" : "secondary"}
            className={isInStock 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
            }
          >
            {isInStock ? "In Stock" : "Preorder"}
          </Badge>

          {/* Name & Purpose */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
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
            <span className="font-semibold text-foreground">{regularPrice} Regular</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-primary">{memberPrice} Vital Pass</span>
          </div>

          {/* CTA */}
          <div className="pt-2 space-y-2">
            {isInStock && product.stripeLink ? (
              <Button 
                asChild
                className="w-full h-12"
              >
                <a href={product.stripeLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Buy Now
                </a>
              </Button>
            ) : (
              <>
                <Button 
                  className="w-full h-12"
                  disabled={!product.stripeLink}
                  asChild={!!product.stripeLink}
                >
                  {product.stripeLink ? (
                    <a href={product.stripeLink} target="_blank" rel="noopener noreferrer">
                      <Clock className="w-4 h-4 mr-2" />
                      Preorder (2–3 Days)
                    </a>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Preorder (2–3 Days)
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-10"
                  onClick={scrollToWaitlist}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Join SMS Waitlist
                </Button>
              </>
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
    <section id="menu" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Our Menu
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fresh, functional juices crafted for wellness
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-muted rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all ${
                activeTab === "available"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Available Now
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
          <div className="space-y-12">
            {/* Ready to Go Juices */}
            <div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-6 text-center">
                Ready to Go
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableNow.map((product) => (
                  <ProductCard key={product.slug} product={product} status="in-stock" />
                ))}
              </div>
            </div>

            {/* Ginger Shots */}
            <div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-6 text-center">
                Ginger Shots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-md mx-auto lg:max-w-none">
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
            <div className="text-center mb-8">
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                2–3 Day Prep Time
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
