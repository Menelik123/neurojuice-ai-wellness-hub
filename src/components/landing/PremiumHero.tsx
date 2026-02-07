import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import tropicalBreeze from "@/assets/product-tropical-breeze.png";

const PremiumHero = () => {
  const scrollToMenu = () => {
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWaitlist = () => {
    document.querySelector("#waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Background with multiple bottle composition */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/50"></div>
        
        {/* Decorative bottle images positioned for desktop */}
        <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full">
          {/* Main bottle - center right */}
          <img 
            src={tropicalBreeze}
            alt=""
            className="absolute right-[10%] top-1/2 -translate-y-1/2 h-[70vh] object-contain opacity-90"
            loading="eager"
          />
          {/* Secondary bottle - back left */}
          <img 
            src={tropicalBreeze}
            alt=""
            className="absolute right-[35%] top-[45%] -translate-y-1/2 h-[55vh] object-contain opacity-60 blur-[1px]"
            loading="eager"
          />
          {/* Third bottle - far right */}
          <img 
            src={tropicalBreeze}
            alt=""
            className="absolute right-[-5%] top-[55%] -translate-y-1/2 h-[50vh] object-contain opacity-50 blur-[2px]"
            loading="eager"
          />
        </div>
        
        {/* Mobile background bottle */}
        <div className="lg:hidden absolute inset-0 flex items-center justify-center pt-20">
          <img 
            src={tropicalBreeze}
            alt=""
            className="h-[45vh] object-contain opacity-20"
            loading="eager"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Hero Image - Mobile only (visible above text) */}
            <div className="relative order-1 lg:hidden">
              <img 
                src={tropicalBreeze}
                alt="NeuroJuice Tropical Breeze"
                className="w-full max-w-[280px] mx-auto drop-shadow-2xl"
                loading="eager"
              />
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
              {/* Brand */}
              <div className="space-y-3">
                <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight">
                  NeuroJuice
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-medium">
                  Functional juices, made fresh. Powered by Dr. Vital.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Button 
                  onClick={scrollToMenu}
                  size="lg"
                  className="h-14 px-8 text-base font-semibold"
                >
                  Order Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={scrollToWaitlist}
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Join Waitlist
                </Button>
              </div>

              {/* App Download Placeholder */}
              <div className="pt-1">
                <Button 
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {}}
                >
                  Download the App →
                </Button>
              </div>
            </div>

            {/* Spacer for desktop layout */}
            <div className="hidden lg:block order-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
