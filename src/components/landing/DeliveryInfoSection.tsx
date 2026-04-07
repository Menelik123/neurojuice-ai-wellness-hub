import { Clock, Leaf, MapPin, ShieldCheck } from "lucide-react";

const deliveryFeatures = [
  {
    icon: Clock,
    title: "Order by 3PM",
    description: "Same-day delivery for all orders placed before 3PM local time.",
  },
  {
    icon: Leaf,
    title: "Pressed When You Order",
    description: "Your order triggers the press. No pre-made inventory sitting around.",
  },
  {
    icon: MapPin,
    title: "Atlanta Metro Delivery",
    description: "Currently serving the Atlanta metro area. Expanding soon.",
  },
  {
    icon: ShieldCheck,
    title: "Freshness Guaranteed",
    description: "Cold-pressed and delivered at peak freshness. Best within 3–5 days.",
  },
];

const DeliveryInfoSection = () => {
  return (
    <section id="delivery" className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            How Delivery Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fresh juice, pressed the moment you order. No warehouses, no shelf life, no shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center space-y-4 p-6 bg-background rounded-xl border border-border"
            >
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryInfoSection;
