import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageSquare } from "lucide-react";

import gingerShot from "@/assets/juice-ginger-shot.png";
import mucusCleanse from "@/assets/juice-mucus-cleanse.png";
import sunshineStarter from "@/assets/juice-sunshine-starter.png";
import glowUp from "@/assets/juice-glow-up.png";
import coldFlu from "@/assets/juice-cold-flu.png";
import beetFlow from "@/assets/juice-beet-flow.png";
import vitalFlow from "@/assets/juice-vital-flow.png";

interface Product {
  name: string;
  purpose: string;
  ingredients: string;
  regularPrice: string;
  memberPrice: string;
  image: string;
  stripeLink: string;
}

const products: Product[] = [
  {
    name: "Ginger Shot",
    purpose: "Immunity & Digestion",
    ingredients: "Ginger, Lemon",
    regularPrice: "$7.99",
    memberPrice: "$6.39",
    image: gingerShot,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Mucus Cleanse",
    purpose: "Sinus & Chest Support",
    ingredients: "Pineapple, Cucumber, Apple, Lime, Ginger",
    regularPrice: "$7.99",
    memberPrice: "$6.39",
    image: mucusCleanse,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Sunshine Starter",
    purpose: "Morning Energy",
    ingredients: "Orange, Watermelon, Pineapple",
    regularPrice: "$7.99",
    memberPrice: "$6.39",
    image: sunshineStarter,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Glow Up",
    purpose: "Skin & Balance",
    ingredients: "Carrot, Orange, Cucumber, Apple, Ginger, Lemon",
    regularPrice: "$7.99",
    memberPrice: "$6.39",
    image: glowUp,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Cold & Flu Defense",
    purpose: "Immune Support",
    ingredients: "Apple, Lemon, Carrot, Ginger",
    regularPrice: "$7.99",
    memberPrice: "$6.39",
    image: coldFlu,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Beet Flow",
    purpose: "Circulation Support",
    ingredients: "Beet, Carrot, Lemon, Ginger",
    regularPrice: "$7.99",
    memberPrice: "$6.39",
    image: beetFlow,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
];

const AvailableNow = () => {
  const scrollToSMS = () => {
    document.querySelector("#sms-signup")?.scrollIntoView({ behavior: "smooth" });
  };

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
            <Card key={product.name} className="border border-border shadow-card hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
                  AVAILABLE NOW
                </Badge>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
              </div>
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">
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
                
                <Button 
                  asChild
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                >
                  <a 
                    href={product.stripeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SMS Micro-CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want to know when we restock?
          </p>
          <Button 
            variant="outline" 
            onClick={scrollToSMS}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Join SMS Alerts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AvailableNow;
