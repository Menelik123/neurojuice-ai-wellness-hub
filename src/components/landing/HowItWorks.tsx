import { Package, MessageSquare, Truck, CalendarDays } from "lucide-react";
import SMSInlineCapture from "./SMSInlineCapture";

const HowItWorks = () => {
  const steps = [
    {
      icon: Package,
      title: "We juice fresh in small batches",
      description: "Every bottle is made with real ingredients",
    },
    {
      icon: CalendarDays,
      title: "Drops happen Wednesdays & Fridays",
      description: "You get notified when new batches are ready",
    },
    {
      icon: Truck,
      title: "Order for delivery or pickup",
      description: "Choose what works best for you",
    },
    {
      icon: MessageSquare,
      title: "Special requests handled via SMS",
      description: "Text us for custom blends or large orders",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground text-center mb-12">
          How Drops Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* SMS Capture Point */}
        <div className="max-w-xl mx-auto">
          <SMSInlineCapture message="Get notified when fresh batches drop" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
