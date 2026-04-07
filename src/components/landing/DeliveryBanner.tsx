import { Truck } from "lucide-react";

const DeliveryBanner = () => {
  return (
    <div className="bg-foreground text-background py-2.5 px-4 text-center text-sm font-medium z-[60] relative">
      <div className="flex items-center justify-center gap-2">
        <Truck className="w-4 h-4" />
        <span>Order by 3PM → Delivered Today (Local Only)</span>
      </div>
    </div>
  );
};

export default DeliveryBanner;
