import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const StickyMobileCTA = () => {
  const scrollToBundles = () => {
    document.querySelector("#bundles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="max-w-lg mx-auto">
        <Button 
          onClick={scrollToBundles}
          className="w-full h-12 font-semibold"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Shop Bundles
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
