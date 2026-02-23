import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import tropicalBreeze from "@/assets/product-tropical-breeze.png";

const PremiumHero = () => {
  const scrollToBundles = () => {
    document.querySelector("#bundles")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMembership = () => {
    document.querySelector("#membership")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/50"></div>
        <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full">
          <img src={tropicalBreeze} alt="" className="absolute right-[10%] top-1/2 -translate-y-1/2 h-[70vh] object-contain opacity-90" loading="eager" />
          <img src={tropicalBreeze} alt="" className="absolute right-[35%] top-[45%] -translate-y-1/2 h-[55vh] object-contain opacity-60 blur-[1px]" loading="eager" />
          <img src={tropicalBreeze} alt="" className="absolute right-[-5%] top-[55%] -translate-y-1/2 h-[50vh] object-contain opacity-50 blur-[2px]" loading="eager" />
        </div>
        <div className="lg:hidden absolute inset-0 flex items-center justify-center pt-20">
          <img src={tropicalBreeze} alt="" className="h-[45vh] object-contain opacity-15" loading="eager" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative order-1 lg:hidden">
              <img src={tropicalBreeze} alt="NeuroJuice fresh juice bottles" className="w-full max-w-[280px] mx-auto drop-shadow-2xl" loading="eager" />
            </div>

            <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-widest uppercase text-primary">NeuroJuice</p>
                <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight">
                  Fresh Pressed Weekly Drops — Delivered Same Day.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg">
                  Build your weekly performance routine.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Button 
                  onClick={scrollToBundles}
                  size="lg"
                  className="h-14 px-8 text-base font-semibold"
                >
                  Shop Bundles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={scrollToMembership}
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start NeuroRoutine Membership
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                Same-Day Delivery Available · Next Fresh Drop: Wednesday
              </p>
            </div>

            <div className="hidden lg:block order-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
