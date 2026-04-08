import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SMSInlineCapture from "./SMSInlineCapture";

import bundleStarterReset from "@/assets/bundle-starter-reset.png";
import bundleHydrationFlow from "@/assets/bundle-hydration-flow.png";
import bundleLungSupport from "@/assets/bundle-lung-support.png";

interface Bundle {
  slug: string;
  name: string;
  description: string;
  bottleCount: number;
  savings: string;
  price: string;
  perBottle: string;
  image: string;
}

const bundles: Bundle[] = [
  {
    slug: "starter-stack",
    name: "Starter Stack",
    description: "Perfect for first-timers — try your favorites",
    bottleCount: 3,
    savings: "Save $2.50",
    price: "$23.00",
    perBottle: "$7.67/bottle",
    image: bundleStarterReset,
  },
  {
    slug: "performance-pack",
    name: "Performance Pack",
    description: "Your weekly performance routine",
    bottleCount: 5,
    savings: "Save $4.50",
    price: "$38.00",
    perBottle: "$7.60/bottle",
    image: bundleLungSupport,
  },
  {
    slug: "weekly-neurostack",
    name: "Weekly NeuroStack",
    description: "Maximum commitment, maximum savings",
    bottleCount: 10,
    savings: "Save $15.00",
    price: "$70.00",
    perBottle: "$7.00/bottle",
    image: bundleHydrationFlow,
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
            Choose from our 6 active juices for any bundle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Link 
              to="/fuel" 
              key={bundle.slug}
              className="block group"
            >
              <Card className="border border-border shadow-card hover:shadow-lg transition-all overflow-hidden h-full group-hover:border-primary/50">
                <div className="relative overflow-hidden">
                  <img 
                    src={bundle.image} 
                    alt={bundle.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-5 flex flex-col justify-between">
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
                    <p className="text-sm text-muted-foreground">
                      {bundle.bottleCount} bottles — you choose from all 6 juices
                    </p>
                    <div>
                      <p className="font-heading font-bold text-2xl text-foreground">
                        {bundle.price}
                      </p>
                      <p className="text-sm text-muted-foreground">{bundle.perBottle}</p>
                      <p className="text-xs text-muted-foreground">
                        vs. ${(bundle.bottleCount * 8.5).toFixed(2)} buying singles
                      </p>
                    </div>
                  </div>
                  
                  <Button className="mt-4 w-full bg-primary hover:bg-primary-glow text-primary-foreground">
                    Order Bundle
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          <SMSInlineCapture message="Bundles sell out fast — get drop alerts by text." />
        </div>
      </div>
    </section>
  );
};

export default BundlesSection;
