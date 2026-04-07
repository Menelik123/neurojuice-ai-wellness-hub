import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBottles from "@/assets/hero-bottles-combined.png";

const PremiumHero = () => {
  const scrollToMenu = () => {
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBundles = () => {
    document.querySelector("#bundles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex flex-col justify-center bg-gradient-to-br from-background via-background to-muted/30 pt-20 md:pt-24">
      <div className="relative z-10 px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6">
              <p className="text-sm font-semibold tracking-widest uppercase text-primary">NeuroJuice</p>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight">
                Your Weekly Performance Fuel. Pressed Fresh. Delivered Today.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg mx-auto lg:mx-0">
                AI-built juice stacks based on your goals.
              </p>

              <div className="flex flex-col items-center lg:items-start gap-4 pt-4">
                <Button 
                  onClick={scrollToBundles}
                  size="xl"
                  className="h-16 px-10 text-lg font-bold"
                >
                  Shop Bundles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <button 
                  onClick={scrollToMenu}
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Just want a single juice? Browse menu
                </button>
              </div>
            </div>

            {/* Hero Product Image */}
            <div className="relative order-first lg:order-last flex items-center justify-center">
              <img 
                src={heroBottles}
                alt="NeuroJuice fresh juice bottles"
                className="w-full max-w-xl mx-auto lg:max-w-full lg:scale-110 drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
