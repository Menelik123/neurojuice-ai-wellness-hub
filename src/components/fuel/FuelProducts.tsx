import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Flame, Zap } from "lucide-react";

interface FuelProductsProps {
  onAddToOrder: () => void;
}

const bundles = [
  {
    name: "Starter Stack",
    bottles: 3,
    price: 23,
    perBottle: "$7.67/bottle",
    savings: "Save $2.50",
    badge: "Most Popular",
    badgeIcon: Star,
  },
  {
    name: "Performance Pack",
    bottles: 5,
    price: 38,
    perBottle: "$7.60/bottle",
    savings: "Save $4.50",
    badge: "Best Value",
    badgeIcon: Flame,
    featured: true,
  },
  {
    name: "Weekly NeuroStack",
    bottles: 10,
    price: 70,
    perBottle: "$7.00/bottle",
    savings: "Save $15.00",
  },
];

const FuelProducts = ({ onAddToOrder }: FuelProductsProps) => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Build Your Stack
            </h2>
            <p className="text-muted-foreground">
              Bundle more, save more. Choose from all 6 juices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle, index) => (
              <div
                key={index}
                className={`relative bg-background rounded-2xl border p-6 transition-all text-center ${
                  bundle.featured
                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                {bundle.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    {bundle.badgeIcon && <bundle.badgeIcon className="w-3 h-3 mr-1" />}
                    {bundle.badge}
                  </Badge>
                )}

                <h3 className="text-xl font-bold text-foreground mb-1 mt-2">
                  {bundle.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {bundle.bottles} bottles
                </p>

                <div className="space-y-1 mb-4">
                  <p className="font-heading font-bold text-4xl text-foreground">
                    ${bundle.price}
                  </p>
                  <p className="text-sm text-muted-foreground">{bundle.perBottle}</p>
                  <p className="text-sm font-semibold text-primary">{bundle.savings}</p>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  vs. ${(bundle.bottles * 8.5).toFixed(2)} buying singles
                </p>

                <Button onClick={onAddToOrder} className="w-full h-12" size="lg">
                  Shop Bundle
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Sea Moss Add-On */}
        <div className="mb-16 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Sea Moss Shot Add-On</h3>
          </div>
          <p className="text-muted-foreground mb-2">
            Add a sea moss shot to your order for just $1.00.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Or add sea moss to any bottle for +$1.00 ($9.50/bottle).
          </p>
          <Button variant="outline" onClick={onAddToOrder}>
            Add Sea Moss
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FuelProducts;
