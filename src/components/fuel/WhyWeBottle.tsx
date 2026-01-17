import { Droplets, Target, RefreshCw, Leaf } from "lucide-react";

const reasons = [
  {
    icon: Droplets,
    title: "Freshness First",
    description:
      "Each 16oz bottle is pressed and sealed same-day. No bulk batching, no oxidation, no compromise.",
  },
  {
    icon: Target,
    title: "Portion Control",
    description:
      "One bottle = one serving. Perfect for tracking intake, building habits, and staying consistent.",
  },
  {
    icon: RefreshCw,
    title: "Consistency",
    description:
      "Every bottle delivers the same potency and flavor. No guessing, no variation.",
  },
  {
    icon: Leaf,
    title: "Why Not a Gallon?",
    description:
      "Large jugs oxidize quickly once opened. Single bottles preserve nutrients and taste from first sip to last.",
  },
];

const WhyWeBottle = () => {
  return (
    <section className="bg-muted/30 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Why We Bottle This Way
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every decision is intentional. Here's why single-serve bottles beat bulk every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <reason.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWeBottle;
