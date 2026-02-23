import { ShoppingBag, Leaf, Truck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: ShoppingBag,
      title: "Choose Your Stack",
      description: "Pick a bundle or build your own lineup",
    },
    {
      icon: Leaf,
      title: "We Press Fresh",
      description: "Small-batch cold-pressed the day of your order",
    },
    {
      icon: Truck,
      title: "Delivered Same Day",
      description: "Order by 3PM for same-day local delivery",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mx-auto">
                {index + 1}
              </span>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
