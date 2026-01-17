import { Button } from "@/components/ui/button";
import { ArrowDown, ShoppingBag } from "lucide-react";

interface FuelHeroProps {
  onViewBundles: () => void;
  onOrderPickup: () => void;
}

const FuelHero = ({ onViewBundles, onOrderPickup }: FuelHeroProps) => {
  return (
    <section className="relative bg-background pt-16 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Fresh & Bottled Daily
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
          Fuel Built for
          <br />
          <span className="text-primary">Performance & Recovery</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Fresh. Bottled intentionally. No shortcuts.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onViewBundles}
            className="w-full sm:w-auto min-w-[200px] h-14 text-lg font-semibold gap-2"
          >
            <ArrowDown className="w-5 h-5" />
            View Bundles
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onOrderPickup}
            className="w-full sm:w-auto min-w-[200px] h-14 text-lg font-semibold gap-2 border-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Order for Pickup
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FuelHero;
