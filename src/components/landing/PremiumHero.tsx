import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const PremiumHero = () => {
  const scrollToBundles = () => {
    document.querySelector("#bundles")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMembership = () => {
    document.querySelector("#membership")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="relative z-10 px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">NeuroJuice</p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight">
            Fresh Pressed Weekly Drops — Delivered Same Day.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg mx-auto">
            Build your weekly performance routine.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
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
            Same-Day Delivery Available · Fresh Drops Weekly
          </p>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
