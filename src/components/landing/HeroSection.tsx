import { Button } from "@/components/ui/button";
import SMSOptInForm from "./SMSOptInForm";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.querySelector("#available-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 md:py-20 pt-24">
      <div className="max-w-6xl mx-auto w-full">
        {/* Text Content */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
            Fresh Juice Drops. Small Batches. No Guesswork.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            Fresh juice every Wednesday & Friday. Special blends on request.
          </p>

          {/* SMS Opt-in Form */}
          <div className="pt-4 flex flex-col items-center">
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
      </div>
    </section>
  );
};

export default HeroSection;
