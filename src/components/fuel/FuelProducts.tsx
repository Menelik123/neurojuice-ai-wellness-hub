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
    price: 15,
    perBottle: "$5.00/bottle",
    savings: "Save $6",
    badge: "Most Popular",
    badgeIcon: Star,
  },
  {
    name: "Performance Stack",
    bottles: 5,
    price: 24,
    perBottle: "$4.80/bottle",
    savings: "Save $11",
    badge: "Best Value",
    badgeIcon: Flame,
    featured: true,
  },
  {
    name: "Weekly NeuroStack",
    bottles: 10,
    price: 45,
    perBottle: "$4.50/bottle",
    savings: "Save $25",
  },
];

const singleBottles = [
  {
    name: "Tropical Breeze",
    supports: "Hydration • Energy • Mood",
    price: 6,
  },
  {
    name: "Mango Mansa",
    supports: "Solar Energy • Mood • Vitality",
    price: 6,
  },
  {
    name: "Beet Flow",
    supports: "Circulation • Heart health",
    price: 6,
  },
  {
    name: "Lung Detox",
    supports: "Breathing • Chest clarity",
    price: 6,
  },
  {
    name: "Glow Up",
    supports: "Clear skin • Inner balance",
    price: 6,
  },
  {
    name: "Cold & Flu Defense",
    supports: "Immune support",
    price: 6,
  },
];

const FuelProducts = ({ onAddToOrder }: FuelProductsProps) => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Bundles First */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Build Your Stack
            </h2>
            <p className="text-muted-foreground">
              Bundle more, save more. Choose your weekly routine.
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
                  vs. ${(bundle.bottles * 6).toFixed(2)} buying singles
                </p>

                <Button onClick={onAddToOrder} className="w-full h-12" size="lg">
                  Shop Bundle
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Ginger Shot Add-On */}
        <div className="mb-16 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Ginger Shot Add-On</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Add 2 Ginger Shots for $5 when you build a stack.
          </p>
          <Button variant="outline" onClick={onAddToOrder}>
            Add Ginger Shots
          </Button>
        </div>

      </div>
    </section>
  );
};

export default FuelProducts;
