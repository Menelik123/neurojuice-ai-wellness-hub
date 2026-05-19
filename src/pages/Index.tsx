import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import MobileNav from "@/components/landing/MobileNav";
import PremiumHero from "@/components/landing/PremiumHero";
import DrVitalCard from "@/components/landing/DrVitalCard";
import SocialProof from "@/components/landing/SocialProof";
import BundleShowcase from "@/components/landing/BundleShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import MenuSection from "@/components/landing/MenuSection";
import VitalPassCard from "@/components/landing/VitalPassCard";
import WaitlistForm from "@/components/landing/WaitlistForm";
import FAQSection from "@/components/landing/FAQSection";
import DeliveryInfoSection from "@/components/landing/DeliveryInfoSection";
import ComplianceFooter from "@/components/landing/ComplianceFooter";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import EmailCaptureModal from "@/components/EmailCaptureModal";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      clearCart();
      toast.success("Order confirmed! Check your email for details. 💚");
      setSearchParams({}, { replace: true });
    } else if (checkout === "canceled") {
      toast.info("Checkout canceled — your cart is ready when you are.");
      setSearchParams({}, { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <MobileNav />
      <EmailCaptureModal />
      <main className="pt-24 pb-20 md:pb-0">
        <PremiumHero />
        <DrVitalCard />
        <BundleShowcase />
        <HowItWorks />
        <MenuSection />
        <SocialProof />
        <DeliveryInfoSection />
        <VitalPassCard />
        <WaitlistForm />
        <FAQSection />
      </main>
      <ComplianceFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
