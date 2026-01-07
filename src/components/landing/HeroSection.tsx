import { Button } from "@/components/ui/button";
import SMSOptInForm from "./SMSOptInForm";
import heroBottles from "@/assets/hero-bottles.png";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.querySelector("#available-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 md:py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Hero Image */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <img 
            src={heroBottles} 
            alt="NeuroJuice cold-pressed juice bottles" 
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
            Fresh Juice Drops. Small Batches. No Guesswork.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            We juice fresh in limited batches. You get notified when it's ready.
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
            See What's Available Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
