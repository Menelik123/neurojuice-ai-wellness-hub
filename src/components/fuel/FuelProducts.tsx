import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Zap } from "lucide-react";
import { useBundles } from "@/hooks/useBundles";

interface FuelProductsProps {
  onAddToOrder: () => void;
}

const FALLBACK_BUNDLES = [
  { name: "Starter Stack", bottles: 3, price: 23, badge: "Most Popular", featured: false, badgeIcon: Star },
  { name: "Performance Pack", bottles: 5, price: 38, badge: "Best Value", featured: true, badgeIcon: Flame },
  { name: "Weekly NeuroStack", bottles: 10, price: 70, badge: "", featured: false, badgeIcon: undefined },
];

const FuelProducts = ({ onAddToOrder }: FuelProductsProps) => {
  const { data: dbBundles } = useBundles();
  const customBundles = dbBundles?.filter((b) => !b.is_curated) ?? [];
  const displayBundles = customBundles.length > 0
    ? customBundles.map((b) => ({
        name: b.name,
        bottles: b.bottles,
        price: b.price,
        badge: b.badge,
        featured: b.badge === "Best Value",
        badgeIcon: b.badge === "Best Value" ? Flame : undefined,
      }))
    : FALLBACK_BUNDLES;

  const singleBottlePrice = dbBundles ? (dbBundles.find((b) => !b.is_curated)?.price ?? 8.5) / (dbBundles.find((b) => !b.is_curated)?.bottles ?? 1) * 1.1 : 8.5;
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
            {displayBundles.map((bundle, index) => (
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
                  <p className="text-sm text-muted-foreground">${(bundle.price / bundle.bottles).toFixed(2)}/bottle</p>
                  <p className="text-sm font-semibold text-primary">Save ${(bundle.bottles * 8.5 - bundle.price).toFixed(2)}</p>
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
