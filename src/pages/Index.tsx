import MobileNav from "@/components/landing/MobileNav";
import DeliveryBanner from "@/components/landing/DeliveryBanner";
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
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <MobileNav />
      <DeliveryBanner />
      <EmailCaptureModal />
      <main className="pb-20 md:pb-0">
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
