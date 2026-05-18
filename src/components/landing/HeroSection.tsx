import { Button } from "@/components/ui/button";
import SMSOptInForm from "./SMSOptInForm";
import heroBottles from "@/assets/hero-bottles.webp";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.querySelector("#available-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 md:py-20 pt-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
              Fresh Juice Drops. Small Batches. No Guesswork.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              Fresh juice every Wednesday & Friday. Special blends available on request.
            </p>

            {/* SMS Opt-in Form */}
            <div className="pt-4">
              <SMSOptInForm variant="hero" />
            </div>

            {/* Secondary CTA */}
            <Button 
              variant="outline" 
              onClick={scrollToProducts}
              className="mt-4"
            >
              Shop Available Now
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative order-first lg:order-last">
            <img 
              src={heroBottles}
              alt="NeuroJuice fresh juice bottles"
              className="w-full max-w-md mx-auto lg:max-w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
