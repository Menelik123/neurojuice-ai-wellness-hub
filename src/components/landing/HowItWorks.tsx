import { Package, MessageSquare, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const scrollToSMS = () => {
    document.querySelector("#sms-signup")?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    {
      icon: Package,
      title: "We juice fresh in small batches",
      description: "Every bottle is made with real ingredients",
    },
    {
      icon: MessageSquare,
      title: "Drops happen Wednesdays & Fridays",
      description: "You get notified when new batches are ready",
    },
    {
      icon: Truck,
      title: "Order for delivery or pickup",
      description: "Special requests handled via SMS",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={scrollToSMS}
            className="bg-primary hover:bg-primary-glow text-primary-foreground"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Join SMS for Drop Alerts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
