import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck, Clock } from "lucide-react";

const OrderBanner = () => {
  const handleOrderNow = () => {
    window.location.href = "/order-options";
  };

  const features = [
    {
      icon: <Truck className="w-5 h-5" />,
      text: "Local delivery available"
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      text: "Easy online ordering"
    }
  ];

  return (
    <section id="order" className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="font-body text-xl text-white/90 max-w-2xl mx-auto">
              Order your personalized juice blends now and experience the difference that AI-powered nutrition can make.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 py-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-white/90">
                {feature.icon}
                <span className="font-body">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              onClick={handleOrderNow}
              className="bg-white text-primary hover:bg-white/90 font-semibold transform hover:scale-105 transition-all duration-300 shadow-button"
              size="xl"
            >
              <ShoppingCart className="w-5 h-5" />
              Order Now
            </Button>
            
            <p className="font-body text-sm text-white/70">
              First-time customers get 20% off their first order
            </p>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/30"
              onClick={() => document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Full Menu
            </Button>
            
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/30"
              onClick={() => document.querySelector("#chat")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get AI Recommendation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderBanner;