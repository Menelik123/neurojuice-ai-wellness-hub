import { Button } from "@/components/ui/button";
import { ShoppingBag, Bell } from "lucide-react";

const StickyMobileCTA = () => {
  const scrollToMenu = () => {
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWaitlist = () => {
    document.querySelector("#waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="flex gap-3 max-w-lg mx-auto">
        <Button 
          onClick={scrollToMenu}
          className="flex-1 h-12 font-semibold"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Order
        </Button>
        <Button 
          onClick={scrollToWaitlist}
          variant="outline"
          className="flex-1 h-12 font-semibold"
        >
          <Bell className="w-4 h-4 mr-2" />
          Waitlist
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
