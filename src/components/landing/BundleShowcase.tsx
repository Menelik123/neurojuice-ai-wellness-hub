import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Flame, Star } from "lucide-react";

interface BundleOption {
  name: string;
  bottles: number;
  price: string;
  perBottle: string;
  savings: string;
  badge?: string;
  badgeIcon?: typeof Flame;
  stripeLink: string;
}

const bundles: BundleOption[] = [
  {
    name: "Starter Stack",
    bottles: 3,
    price: "$15",
    perBottle: "$5.00/bottle",
    savings: "Save $6",
    badge: "Most Popular",
    badgeIcon: Star,
    stripeLink: "",
  },
  {
    name: "Performance Pack",
    bottles: 5,
    price: "$24",
    perBottle: "$4.80/bottle",
    savings: "Save $11",
    badge: "Best Value",
    badgeIcon: Flame,
    stripeLink: "",
  },
  {
    name: "Weekly NeuroStack",
    bottles: 10,
    price: "$45",
    perBottle: "$4.50/bottle",
    savings: "Save $25",
    stripeLink: "",
  },
];

const BundleShowcase = () => {
  return (
    <section id="bundles" className="py-16 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Build Your Stack
          </h2>
          <p className="text-muted-foreground text-lg">
            Bundle more, save more. Choose your weekly routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Card
              key={bundle.name}
              className={`border overflow-hidden transition-all duration-300 hover:shadow-lg relative ${
                bundle.badge === "Best Value"
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {bundle.badge && (
                <div className="absolute top-0 left-0 right-0">
                  <Badge className="w-full rounded-none rounded-t-lg justify-center py-1.5 bg-primary text-primary-foreground font-semibold text-sm">
                    {bundle.badgeIcon && <bundle.badgeIcon className="w-3.5 h-3.5 mr-1.5" />}
                    {bundle.badge}
                  </Badge>
                </div>
              )}
              <CardContent className={`p-6 text-center space-y-4 ${bundle.badge ? "pt-12" : "pt-6"}`}>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {bundle.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {bundle.bottles} bottles
                </p>
                <div className="space-y-1">
                  <p className="font-heading font-bold text-4xl text-foreground">
                    {bundle.price}
                  </p>
                  <p className="text-sm text-muted-foreground">{bundle.perBottle}</p>
                  <p className="text-sm font-semibold text-primary">{bundle.savings}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. ${(bundle.bottles * 6).toFixed(2)} buying singles
                </p>
                <Button
                  className="w-full h-12 font-semibold"
                  asChild={!!bundle.stripeLink}
                  disabled={!bundle.stripeLink}
                >
                  {bundle.stripeLink ? (
                    <a href={bundle.stripeLink} target="_blank" rel="noopener noreferrer">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Shop Bundle
                    </a>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Coming Soon
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BundleShowcase;
