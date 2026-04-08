import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SMSInlineCapture from "./SMSInlineCapture";

import tropicalBreeze from "@/assets/juice-tropical-breeze.png";
import beetFlow from "@/assets/product-beet-flow.png";

interface Product {
  slug: string;
  name: string;
  tagline: string;
  purpose: string;
  ingredients: string;
  regularPrice: string;
  memberPrice: string;
  image: string;
  stripeLink: string;
}

const products: Product[] = [
  {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    tagline: "Refresh & Recharge",
    purpose: "Energy • Metabolism • Cleanse",
    ingredients: "Pineapple, Apple, Lemon, Ginger",
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    image: tropicalBreeze,
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b",
  },
  {
    slug: "beet-flow",
    name: "Beet Flow",
    tagline: "Power Your Heart",
    purpose: "Circulation • Heart Health",
    ingredients: "Beet, Carrot, Lemon, Ginger",
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    image: beetFlow,
    stripeLink: "",
  },
  {
    slug: "green-vital",
    name: "Green Vital",
    tagline: "Detox. Restore. Repeat.",
    purpose: "Detox • Gut Health • Reset",
    ingredients: "Celery, Green Apple, Spinach/Swiss Chard, Cucumber, Lemon, Ginger, Coconut Water",
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    image: tropicalBreeze,
    stripeLink: "",
  },
  {
    slug: "mint-condition",
    name: "Mint Condition",
    tagline: "Perfectly Fresh",
    purpose: "Hydration • Recovery",
    ingredients: "Watermelon, Mint, Basil",
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    image: tropicalBreeze,
    stripeLink: "",
  },
  {
    slug: "strawberry-horizon",
    name: "Strawberry Horizon",
    tagline: "Every Sip, A New Horizon",
    purpose: "Hydration • Antioxidants",
    ingredients: "Strawberry, Coconut Water, Lime",
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    image: tropicalBreeze,
    stripeLink: "",
  },
  {
    slug: "hibiscus-delight",
    name: "Hibiscus Delight",
    tagline: "Blossom",
    purpose: "Heart Health • Liver Support",
    ingredients: "Hibiscus, Coconut Water, Lemon or Strawberry",
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    image: tropicalBreeze,
    stripeLink: "",
  },
];

const AvailableNow = () => {
  return (
    <section id="available-now" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-4">
            Available Now — Ready to Go
          </h2>
          <p className="text-muted-foreground">
            Fresh batches ready for pickup or delivery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link 
              to={`/juice/${product.slug}`} 
              key={product.slug}
              className="block group"
            >
              <Card className="border border-border shadow-card hover:shadow-lg transition-all overflow-hidden group-hover:border-primary/50 h-full">
                <div className="relative">
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
                    {product.tagline}
                  </Badge>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {product.purpose}
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {product.ingredients}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground line-through">
                      {product.regularPrice}
                    </span>
                    <span className="font-heading font-bold text-lg text-foreground">
                      {product.memberPrice}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Vital Pass
                    </Badge>
                  </div>
                  
                  {product.stripeLink ? (
                    <Button 
                      asChild
                      className="w-full bg-[#7FD645] hover:bg-[#6BC535] text-black font-semibold"
                    >
                      <a href={product.stripeLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        Order Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Sea Moss Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Add sea moss to any bottle for +$1.00 | Standalone sea moss shot: $1.00</p>
        </div>

        <div className="mt-8 max-w-xl mx-auto">
          <SMSInlineCapture message="Don't see your flavor? Get text alerts for restocks." />
        </div>
      </div>
    </section>
  );
};

export default AvailableNow;
