import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import SMSInlineCapture from "./SMSInlineCapture";

import bundleStarterReset from "@/assets/bundle-starter-reset.png";
import bundleHydrationFlow from "@/assets/bundle-hydration-flow.png";
import bundleLungSupport from "@/assets/bundle-lung-support.png";
import bundleVariety from "@/assets/bundle-variety.png";

interface Bundle {
  slug: string;
  name: string;
  description: string;
  bottleCount: number;
  includes: string[];
  savings: string;
  price: string;
  image: string;
  isVitalPassExclusive?: boolean;
}

const bundles: Bundle[] = [
  {
    slug: "starter-reset-pack",
    name: "Starter Reset Pack",
    description: "Perfect for first-timers looking to reset their routine",
    bottleCount: 4,
    includes: ["1x Lung Detox", "2x Tropical Breeze", "1x Ginger Shot"],
    savings: "Save $5",
    price: "$23.99",
    image: bundleStarterReset,
  },
  {
    slug: "lung-support-pack",
    name: "Lung Support Pack",
    description: "Breathe easier with our respiratory-focused blends",
    bottleCount: 5,
    includes: ["2x Lung Detox", "2x Tropical Breeze", "1x Ginger Shot"],
    savings: "Save $8",
    price: "$29.99",
    image: bundleLungSupport,
  },
  {
    slug: "hydration-flow-pack",
    name: "Hydration Flow Pack",
    description: "Stay refreshed and energized all day",
    bottleCount: 6,
    includes: ["3x Tropical Breeze", "2x Lung Detox", "1x Ginger Shot"],
    savings: "Save $10",
    price: "$35.99",
    image: bundleHydrationFlow,
  },
  {
    slug: "vital-pass-exclusive-pack",
    name: "Vital Pass Exclusive Pack",
    description: "Members-only bundle with our best sellers",
    bottleCount: 6,
    includes: ["2x Tropical Breeze", "2x Lung Detox", "2x Ginger Shot"],
    savings: "Save $15",
    price: "$29.99",
    image: bundleVariety,
    isVitalPassExclusive: true,
  },
];

const BundlesSection = () => {
  return (
    <section id="bundles" className="py-16 px-4 bg-muted/30">
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
            <Link 
              to={`/bundle/${bundle.slug}`} 
              key={bundle.slug}
              className="block group"
            >
              <Card 
                className={`border shadow-card hover:shadow-lg transition-all overflow-hidden h-full group-hover:border-primary/50 ${
                  bundle.isVitalPassExclusive ? 'border-primary/50 bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative overflow-hidden">
                    {bundle.isVitalPassExclusive && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
                        <Lock className="w-3 h-3 mr-1" />
                        Vital Pass Only
                      </Badge>
                    )}
                    <img 
                      src={bundle.image} 
                      alt={bundle.name}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="md:w-3/5 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                          {bundle.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {bundle.savings}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bundle.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {bundle.bottleCount} bottles included:
                        </p>
                        <ul className="text-sm text-muted-foreground">
                          {bundle.includes.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="font-heading font-bold text-2xl text-foreground">
                        {bundle.price}
                      </p>
                    </div>
                    
                    <Button 
                      className={`mt-4 w-full group-hover:bg-primary-glow ${
                        bundle.isVitalPassExclusive 
                          ? 'bg-foreground hover:bg-foreground/90 text-background' 
                          : 'bg-primary hover:bg-primary-glow text-primary-foreground'
                      }`}
                    >
                      View Bundle Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* SMS Capture Point */}
        <div className="mt-12 max-w-xl mx-auto">
          <SMSInlineCapture message="Bundles sell out fast — get drop alerts by text." />
        </div>
      </div>
    </section>
  );
};

export default BundlesSection;
