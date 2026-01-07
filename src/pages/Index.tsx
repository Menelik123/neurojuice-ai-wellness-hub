import StickyNav from "@/components/landing/StickyNav";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import AvailableNow from "@/components/landing/AvailableNow";
import BundlesSection from "@/components/landing/BundlesSection";
import MadeToOrder from "@/components/landing/MadeToOrder";
import VitalPassSection from "@/components/landing/VitalPassSection";
import DrVitalTeaser from "@/components/landing/DrVitalTeaser";
import EmailIncentive from "@/components/landing/EmailIncentive";
import FinalSMSPush from "@/components/landing/FinalSMSPush";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <StickyNav />
      <main>
        <HeroSection />
        <HowItWorks />
        <AvailableNow />
        <BundlesSection />
        <MadeToOrder />
        <VitalPassSection />
        <DrVitalTeaser />
        <EmailIncentive />
        <FinalSMSPush />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
