import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Zap } from "lucide-react";

interface FuelProductsProps {
  onAddToOrder: () => void;
}

const singleBottles = [
  {
    name: "Tropical Breeze",
    supports: "Hydration • Energy • Mood",
    price: 6.99,
    vitalPrice: 5.0,
  },
  {
    name: "Lung Detox",
    supports: "Breathing • Chest clarity • Circulation",
    price: 6.99,
    vitalPrice: 5.0,
  },
  {
    name: "Hydration Reset",
    supports: "Low energy • Dehydration • Recovery",
    price: 6.99,
    vitalPrice: 5.0,
  },
  {
    name: "Glow Up",
    supports: "Clear skin • Inner balance",
    price: 6.99,
    vitalPrice: 5.0,
  },
  {
    name: "Cold & Flu Defense",
    supports: "Immune support",
    price: 6.99,
    vitalPrice: 5.0,
  },
  {
    name: "Beet Flow",
    supports: "Circulation • Kidney support",
    price: 6.99,
    vitalPrice: 5.0,
  },
];

const bundles = [
  {
    name: "4-Bottle Bundle",
    bottles: 4,
    whoFor: "New to juicing or building a habit",
    whenToUse: "Daily morning boost or post-workout recovery",
    price: 24.99,
    vitalPrice: 18.0,
    savings: "Save $3",
  },
  {
    name: "6-Bottle Bundle",
    bottles: 6,
    whoFor: "Committed to a weekly routine",
    whenToUse: "6-day reset or sharing with a partner",
    price: 35.99,
    vitalPrice: 27.0,
    savings: "Save $6",
    featured: true,
  },
  {
    name: "8-Bottle Bundle",
    bottles: 8,
    whoFor: "Athletes, families, or meal preppers",
    whenToUse: "Full week coverage or event prep",
    price: 45.99,
    vitalPrice: 36.0,
    savings: "Save $10",
  },
];

const gallonPack = {
  name: "Gallon Equivalent Pack",
  bottles: 8,
  volume: "8 × 16oz = 128oz (1 Gallon)",
  note: "Same volume as a gallon, bottled fresh to preserve quality",
  price: 45.99,
  vitalPrice: 36.0,
};

const FuelProducts = ({ onAddToOrder }: FuelProductsProps) => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Single Bottles */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Single Bottles (16oz)
            </h2>
            <p className="text-muted-foreground">
              Choose your fuel. One bottle, one purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {singleBottles.map((bottle, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl border border-border/50 p-5 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  {bottle.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {bottle.supports}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      ${bottle.price.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground mx-1">|</span>
                    <span className="text-primary font-medium">
                      ${bottle.vitalPrice.toFixed(2)} Vital Pass
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onAddToOrder}
                    className="h-8 px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bundles */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Bundles
            </h2>
            <p className="text-muted-foreground">
              Build your routine. Save more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle, index) => (
              <div
                key={index}
                className={`relative bg-background rounded-2xl border p-6 transition-all ${
                  bundle.featured
                    ? "border-primary shadow-lg scale-[1.02]"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                {bundle.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <h3 className="text-xl font-bold text-foreground mb-4">
                  {bundle.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Who it's for
                    </p>
                    <p className="text-sm text-foreground">{bundle.whoFor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      When to use
                    </p>
                    <p className="text-sm text-foreground">
                      {bundle.whenToUse}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      ${bundle.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      regular
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-semibold text-primary">
                      ${bundle.vitalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-primary">Vital Pass</span>
                    <Badge variant="secondary" className="text-xs">
                      {bundle.savings}
                    </Badge>
                  </div>
                </div>

                <Button onClick={onAddToOrder} className="w-full" size="lg">
                  Add to Order
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Gallon Equivalent Pack */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl border border-primary/20 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-10 h-10 text-primary" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-2 bg-primary/20 text-primary border-0">
                Same Volume as a Gallon
              </Badge>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {gallonPack.name}
              </h3>
              <p className="text-muted-foreground mb-1">{gallonPack.volume}</p>
              <p className="text-sm text-primary font-medium">
                {gallonPack.note}
              </p>
            </div>

            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-foreground">
                ${gallonPack.price.toFixed(2)}
              </div>
              <div className="text-lg text-primary font-semibold">
                ${gallonPack.vitalPrice.toFixed(2)} Vital Pass
              </div>
              <Button onClick={onAddToOrder} className="mt-4" size="lg">
                Add to Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FuelProducts;
