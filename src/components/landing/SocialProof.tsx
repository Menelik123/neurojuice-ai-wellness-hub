import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Leeroy",
    quote:
      "This juice is different than any other juice I've tasted before. Most companies don't know how to level out the beet potency and have the drink actually taste more than just beets — they've mastered that.",
  },
  {
    name: "Chris",
    quote: "This is like liquid gold. I never want to stop drinking it.",
  },
  {
    name: "Jihad",
    quote: "This is fire. The best drink I've ever had in my life.",
  },
];

const SocialProof = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            Real People. Real Results.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="border border-border bg-card h-full">
              <CardContent className="p-6 flex flex-col h-full space-y-4">
                <Quote className="w-6 h-6 text-primary/40 flex-shrink-0" />
                <p className="text-foreground text-sm leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <p className="font-heading font-semibold text-foreground">
                  — {t.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Badge className="bg-primary/10 text-primary border-0 px-6 py-2 text-sm font-semibold">
            Sold Out Our First Batch in 48 Hours
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
