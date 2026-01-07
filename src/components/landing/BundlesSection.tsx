import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Lock } from "lucide-react";

import bundleStarter from "@/assets/bundle-starter.png";
import bundleVariety from "@/assets/bundle-variety.png";

interface Bundle {
  name: string;
  description: string;
  includes: string;
  price: string;
  image: string;
  isVitalPassExclusive?: boolean;
  stripeLink: string;
}

const bundles: Bundle[] = [
  {
    name: "Starter Reset Pack",
    description: "Perfect for first-timers looking to reset their routine",
    includes: "3 bottles: Sunshine Starter, Glow Up, Ginger Shot",
    price: "$19.99",
    image: bundleStarter,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Lung Support Pack",
    description: "Breathe easier with our respiratory-focused blends",
    includes: "3 bottles: Mucus Cleanse, Cold & Flu Defense, Ginger Shot",
    price: "$19.99",
    image: bundleVariety,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Hydration Flow Pack",
    description: "Stay refreshed and energized all day",
    includes: "4 bottles: Vital Flow, Sunshine Starter, Glow Up, Beet Flow",
    price: "$27.99",
    image: bundleStarter,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Vital Pass Exclusive Pack",
    description: "Members-only bundle with our best sellers",
    includes: "6 bottles: Full variety pack with all flavors",
    price: "$39.99",
    image: bundleVariety,
    isVitalPassExclusive: true,
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
];

const BundlesSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-4">
            Bundles — Save More
          </h2>
          <p className="text-muted-foreground">
            Curated packs for your wellness goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <Card 
              key={bundle.name} 
              className={`border shadow-card hover:shadow-lg transition-shadow overflow-hidden ${
                bundle.isVitalPassExclusive ? 'border-primary/50 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative">
                  {bundle.isVitalPassExclusive && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
                      <Lock className="w-3 h-3 mr-1" />
                      Vital Pass Only
                    </Badge>
                  )}
                  <img 
                    src={bundle.image} 
                    alt={bundle.name}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <CardContent className="md:w-3/5 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-heading font-bold text-xl text-foreground">
                      {bundle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {bundle.description}
                    </p>
                    <p className="text-sm text-foreground/80">
                      <span className="font-medium">Includes:</span> {bundle.includes}
                    </p>
                    <p className="font-heading font-bold text-2xl text-foreground">
                      {bundle.price}
                    </p>
                  </div>
                  
                  <Button 
                    asChild
                    className={`mt-4 w-full ${
                      bundle.isVitalPassExclusive 
                        ? 'bg-foreground hover:bg-foreground/90 text-background' 
                        : 'bg-primary hover:bg-primary-glow text-primary-foreground'
                    }`}
                  >
                    <a 
                      href={bundle.stripeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add Bundle
                    </a>
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BundlesSection;
