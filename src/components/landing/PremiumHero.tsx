import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import heroBottles from "@/assets/hero-bottles.png";

const PremiumHero = () => {
  const scrollToMenu = () => {
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWaitlist = () => {
    document.querySelector("#waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-4 pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Hero Image - Mobile first */}
          <div className="relative order-1 lg:order-2">
            <img 
              src={heroBottles}
              alt="NeuroJuice fresh juice bottles"
              className="w-full max-w-xs mx-auto lg:max-w-md xl:max-w-lg"
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
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
