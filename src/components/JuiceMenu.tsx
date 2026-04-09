import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MemberPricing from "@/components/MemberPricing";
import { juices } from "@/data/juices";
import { Link } from "react-router-dom";

import tropicalBreeze from "@/assets/product-tropical-breeze.png";
import beetFlow from "@/assets/product-beet-flow.png";
import strawberryHorizon from "@/assets/product-strawberry-horizon.png";

const imageMap: Record<string, string> = {
  "tropical-breeze": tropicalBreeze,
  "beet-flow": beetFlow,
  "green-vital": tropicalBreeze,
  "mint-condition": tropicalBreeze,
  "strawberry-horizon": strawberryHorizon,
  "hibiscus-delight": tropicalBreeze,
};

const JuiceMenu = () => {
  return (
    <section id="menu" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
            Our Juice Lineup
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            6 functional juices crafted for performance, recovery, and wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {juices.map((juice) => (
            <Card key={juice.slug} className="overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-card hover:shadow-soft">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={imageMap[juice.slug] || tropicalBreeze} alt={juice.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">{juice.tagline}</Badge>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-heading font-bold text-xl text-foreground">{juice.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{juice.benefit}</p>
                  <div className="space-y-3 pt-2 border-t border-border">
                    <p className="font-body text-sm text-foreground">
                      <span className="font-semibold">Ingredients:</span> {juice.ingredients.join(", ")}
                    </p>
                    <div className="flex justify-between items-center">
                      <MemberPricing regularPrice={8.5} showJoinLink={false} size="sm" />
                      <Button asChild variant="default" size="sm">
                        <Link to={`/juice/${juice.slug}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="font-heading font-bold text-3xl md:text-4xl text-foreground">Bundles & More</h3>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Stack more, save more with our bundle options.
            </p>
          </div>
          <div className="text-center">
            <Button asChild variant="default" size="lg">
              <Link to="/fuel">Shop Bundles</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JuiceMenu;
