import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// Product images
import tropicalBreeze from "@/assets/product-tropical-breeze.png";
import beetFlow from "@/assets/product-beet-flow.png";
import gingerShot from "@/assets/product-ginger-shot.png";

interface Product {
  slug: string;
  name: string;
  tagline: string;
  purpose: string;
  ingredients: string;
  description: string;
  image: string;
  stripeLink: string;
  isSeaMoss?: boolean;
}

const products: Product[] = [
  {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    tagline: "Refresh & Recharge",
    purpose: "Energy • Metabolism • Cleanse",
    ingredients: "Pineapple, Apple, Lemon, Ginger",
    description: "A bold tropical blend designed to energize and restore. Pineapple and apple deliver natural sweetness while ginger ignites your metabolism and lemon cleanses from within.",
    image: tropicalBreeze,
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b",
  },
  {
    slug: "beet-flow",
    name: "Beet Flow",
    tagline: "Power Your Heart",
    purpose: "Circulation • Heart Health • Anti-Inflammatory",
    ingredients: "Beet, Carrot, Lemon, Ginger",
    description: "A deep earthy blend built for cardiovascular health. Beets and carrots support blood pressure and circulation while ginger fights inflammation and lemon keeps it bright.",
    image: beetFlow,
    stripeLink: "",
  },
  {
    slug: "green-vital",
    name: "Green Vital",
    tagline: "Detox. Restore. Repeat.",
    purpose: "Detox • Gut Health • System Reset",
    ingredients: "Celery, Green Apple, Spinach/Swiss Chard, Cucumber, Lemon, Ginger, Coconut Water",
    description: "Our most powerful cleanse. Built to flush toxins, support gut health, and reset your system from the inside out.",
    image: tropicalBreeze, // placeholder — keep existing images
    stripeLink: "",
  },
  {
    slug: "mint-condition",
    name: "Mint Condition",
    tagline: "Perfectly Fresh",
    purpose: "Hydration • Recovery • Anti-Inflammatory",
    ingredients: "Watermelon, Mint, Basil",
    description: "A light hydration blend made for recovery. Watermelon replenishes electrolytes, mint cools and refreshes, and basil brings anti-inflammatory support.",
    image: tropicalBreeze, // placeholder
    stripeLink: "",
  },
  {
    slug: "strawberry-horizon",
    name: "Strawberry Horizon",
    tagline: "Every Sip, A New Horizon",
    purpose: "Hydration • Antioxidants • Electrolytes",
    ingredients: "Strawberry, Coconut Water, Lime",
    description: "A clean, crisp hydration blend that hits different. Strawberry antioxidants, coconut water electrolytes, and lime brightness in every bottle.",
    image: tropicalBreeze, // placeholder
    stripeLink: "",
  },
  {
    slug: "hibiscus-delight",
    name: "Hibiscus Delight",
    tagline: "Blossom",
    purpose: "Heart Health • Blood Pressure • Liver Support",
    ingredients: "Hibiscus, Coconut Water, Lemon or Strawberry",
    description: "A floral wellness blend that works quietly and powerfully. Hibiscus supports heart health, lowers blood pressure, reduces cholesterol, and promotes liver health.",
    image: tropicalBreeze, // placeholder
    stripeLink: "",
  },
];

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 bg-card shadow-sm hover:shadow-lg group h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="aspect-[4/5] bg-muted/20 flex items-center justify-center overflow-hidden relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
            loading="lazy"
          />
        </div>

        <div className="p-5 space-y-3 flex flex-col flex-1">
          <Badge className="bg-primary text-primary-foreground w-fit">
            {product.tagline}
          </Badge>

          <div>
            <h3 className="font-heading font-bold text-xl text-foreground">
              {product.name}
            </h3>
            <p className="text-sm text-primary font-medium mt-1">
              {product.purpose}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {product.ingredients}
          </p>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">$8.50</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-primary">$7.50 Member</span>
          </div>

          <div className="pt-3 space-y-2 mt-auto">
            {product.stripeLink ? (
              <Button asChild className="w-full h-12">
                <a href={product.stripeLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Buy Now — $8.50
                </a>
              </Button>
            ) : (
              <Button asChild className="w-full h-12" variant="outline">
                <Link to="/fuel">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order Now — $8.50
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
  return (
    <section id="menu" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Our Menu
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fresh, functional juices crafted for performance
          </p>
        </div>

        <div className="bg-primary/10 text-primary text-center py-3 rounded-lg font-semibold text-sm mb-10">
          Order by 3PM → Delivered Today
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {/* Sea Moss Add-On */}
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-foreground mb-2">Sea Moss Add-On</h3>
          <p className="text-muted-foreground mb-1">
            Add sea moss to any bottle for just $1.00 more ($9.50/bottle)
          </p>
          <p className="text-sm text-muted-foreground">
            Standalone sea moss shot: $1.00
          </p>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
