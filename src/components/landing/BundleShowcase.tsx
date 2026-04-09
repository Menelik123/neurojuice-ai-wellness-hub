import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame, Star } from "lucide-react";
import BundleBuilderModal from "./BundleBuilderModal";

interface BundleOption {
  name: string;
  bottles: number;
  price: number;
  priceDisplay: string;
  perBottle: string;
  savings: string;
  badge?: string;
  badgeIcon?: typeof Flame;
}

const bundles: BundleOption[] = [
  {
    name: "Starter Stack",
    bottles: 3,
    price: 23,
    priceDisplay: "$23",
    perBottle: "$7.67/bottle",
    savings: "Save $2.50",
    badge: "Most Popular",
    badgeIcon: Star,
  },
  {
    name: "Performance Pack",
    bottles: 5,
    price: 38,
    priceDisplay: "$38",
    perBottle: "$7.60/bottle",
    savings: "Save $4.50",
    badge: "Best Value",
    badgeIcon: Flame,
  },
  {
    name: "Weekly NeuroStack",
    bottles: 10,
    price: 70,
    priceDisplay: "$70",
    perBottle: "$7.00/bottle",
    savings: "Save $15.00",
  },
];

const BundleShowcase = () => {
  const [selectedBundle, setSelectedBundle] = useState<BundleOption | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOrderBundle = (bundle: BundleOption) => {
    setSelectedBundle(bundle);
    setModalOpen(true);
  };

  return (
    <section id="bundles" className="py-16 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Build Your Stack
          </h2>
          <p className="text-muted-foreground text-lg">
            The more you stack, the more you save.
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
                  {bundle.bottles} bottles — you choose
                </p>
                <div className="space-y-1">
                  <p className="font-heading font-bold text-4xl text-foreground">
                    {bundle.priceDisplay}
                  </p>
                  <p className="text-sm text-muted-foreground">{bundle.perBottle}</p>
                  <p className="text-sm font-semibold text-primary">{bundle.savings}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. ${(bundle.bottles * 8.5).toFixed(2)} buying singles
                </p>
                <Button className="w-full h-12 font-semibold" onClick={() => handleOrderBundle(bundle)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Build Your Bundle
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BundleBuilderModal
        bundle={selectedBundle ? { name: selectedBundle.name, bottles: selectedBundle.bottles, price: selectedBundle.price } : null}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default BundleShowcase;
