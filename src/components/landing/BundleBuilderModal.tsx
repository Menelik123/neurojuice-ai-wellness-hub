import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface BundleConfig {
  name: string;
  bottles: number;
  price: number;
}

interface BundleBuilderModalProps {
  bundle: BundleConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableDrinks = [
  "Tropical Breeze",
  "Beet Flow",
  "Green Vital",
  "Mint Condition",
  "Strawberry Horizon",
  "Hibiscus Delight",
];

const BundleBuilderModal = ({ bundle, open, onOpenChange }: BundleBuilderModalProps) => {
  const { addItem } = useCart();
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [seaMossCount, setSeaMossCount] = useState(0);

  if (!bundle) return null;

  const totalSelected = Object.values(selections).reduce((a, b) => a + b, 0);
  const remaining = bundle.bottles - totalSelected;

  const updateDrink = (name: string, delta: number) => {
    setSelections((prev) => {
      const current = prev[name] || 0;
      const next = Math.max(0, current + delta);
      if (delta > 0 && remaining <= 0) return prev;
      const updated = { ...prev, [name]: next };
      if (updated[name] === 0) delete updated[name];
      return updated;
    });
  };

  const handleAddToCart = () => {
    if (totalSelected !== bundle.bottles) {
      toast.error(`Please select exactly ${bundle.bottles} drinks.`);
      return;
    }
    const selectedDrinks = Object.entries(selections).flatMap(([name, qty]) =>
      Array(qty).fill(name)
    );
    addItem({
      id: `bundle-${bundle.name}`,
      name: `${bundle.name} (${bundle.bottles} bottles)`,
      type: "bundle",
      quantity: 1,
      unitPrice: bundle.price,
      addSeaMoss: false,
      bundleBottles: bundle.bottles,
      selectedDrinks,
      seaMossCount: seaMossCount,
    });
    // Reset
    setSelections({});
    setSeaMossCount(0);
    onOpenChange(false);
    toast.success(`${bundle.name} added to cart!`);
  };

  const seaMossTotal = seaMossCount * 1.0;
  const cartTotal = bundle.price + seaMossTotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Build Your {bundle.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select {bundle.bottles} drinks for ${bundle.price.toFixed(2)}
          </p>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {availableDrinks.map((drink) => (
            <div key={drink} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm font-medium text-foreground">{drink}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateDrink(drink, -1)}
                  className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  disabled={!selections[drink]}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{selections[drink] || 0}</span>
                <button
                  onClick={() => updateDrink(drink, 1)}
                  className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  disabled={remaining <= 0}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sea Moss add-on */}
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-sm font-medium text-foreground">🌿 Add Sea Moss Shots — +$1.00 each</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeaMossCount(Math.max(0, seaMossCount - 1))}
              className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
              disabled={seaMossCount <= 0}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{seaMossCount}</span>
            <button
              onClick={() => setSeaMossCount(seaMossCount + 1)}
              className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
            {seaMossCount > 0 && (
              <span className="text-xs text-muted-foreground">+${seaMossTotal.toFixed(2)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant={remaining === 0 ? "default" : "outline"} className={remaining === 0 ? "bg-primary" : ""}>
            {remaining === 0 ? "✓ All selected" : `${remaining} more to pick`}
          </Badge>
          <span className="font-heading font-bold text-lg">${cartTotal.toFixed(2)}</span>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={totalSelected !== bundle.bottles}
          className="w-full h-12 font-semibold"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add Bundle to Cart — ${cartTotal.toFixed(2)}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BundleBuilderModal;
