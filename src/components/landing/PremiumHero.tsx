import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PremiumHero = () => {
  const scrollToMembership = () => {
    document.querySelector("#membership")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMenu = () => {
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="relative z-10 px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">NeuroJuice</p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight">
            Your Weekly Performance Fuel. Pressed Fresh. Delivered Today.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg mx-auto">
            AI-built juice stacks based on your goals.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Button 
              onClick={scrollToMembership}
              size="xl"
              className="h-16 px-10 text-lg font-bold"
            >
              Start Your NeuroRoutine
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
      </div>
    </section>
  );
};

export default PremiumHero;
