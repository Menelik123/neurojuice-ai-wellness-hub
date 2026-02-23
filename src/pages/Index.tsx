import MobileNav from "@/components/landing/MobileNav";
import DeliveryBanner from "@/components/landing/DeliveryBanner";
import PremiumHero from "@/components/landing/PremiumHero";
import BundleShowcase from "@/components/landing/BundleShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import MenuSection from "@/components/landing/MenuSection";
import VitalPassCard from "@/components/landing/VitalPassCard";
import DrVitalCard from "@/components/landing/DrVitalCard";
import WaitlistForm from "@/components/landing/WaitlistForm";
import ComplianceFooter from "@/components/landing/ComplianceFooter";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <DeliveryBanner />
      <MobileNav />
      <main className="pb-20 md:pb-0">
        <PremiumHero />
        <BundleShowcase />
        <HowItWorks />
        <MenuSection />
        <VitalPassCard />
        <DrVitalCard />
        <WaitlistForm />
      </main>
      <ComplianceFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
