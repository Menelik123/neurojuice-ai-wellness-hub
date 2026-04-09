import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const StickyMobileCTA = () => {
  const { totalItems, setDrawerOpen } = useCart();

  const scrollToBundles = () => {
    document.querySelector("#bundles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="max-w-lg mx-auto flex gap-2">
        {totalItems > 0 ? (
          <Button
            onClick={() => setDrawerOpen(true)}
            className="w-full h-12 font-semibold"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart ({totalItems})
          </Button>
        ) : (
          <Button
            onClick={scrollToBundles}
            className="w-full h-12 font-semibold"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Shop Bundles
          </Button>
        )}
      </div>
    </div>
  );
};

export default StickyMobileCTA;
