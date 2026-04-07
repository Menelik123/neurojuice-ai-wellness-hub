import { useRef } from "react";
import FuelHero from "@/components/fuel/FuelHero";
import WhyWeBottle from "@/components/fuel/WhyWeBottle";
import FuelProducts from "@/components/fuel/FuelProducts";
import FuelFAQ from "@/components/fuel/FuelFAQ";
import FuelOrderForm from "@/components/fuel/FuelOrderForm";
import ComplianceFooter from "@/components/landing/ComplianceFooter";

const Fuel = () => {
  const bundlesRef = useRef<HTMLDivElement>(null);
  const orderFormRef = useRef<HTMLDivElement>(null);

  const scrollToBundles = () => {
    bundlesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToOrder = () => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <FuelHero onViewBundles={scrollToBundles} onOrderPickup={scrollToOrder} />
      <WhyWeBottle />
      <div ref={bundlesRef}>
        <FuelProducts onAddToOrder={scrollToOrder} />
      </div>
      <div ref={orderFormRef}>
        <FuelOrderForm />
      </div>
      <FuelFAQ />
      <ComplianceFooter />
    </div>
  );
};

export default Fuel;
