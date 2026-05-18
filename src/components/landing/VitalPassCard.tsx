import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const VitalPassCard = () => {
  const benefits = [
    "$1 off every bottle ($7.50/bottle, regular $8.50)",
    "Free monthly Sea Moss shot",
    "Early access to drops",
    "Exclusive bundle pricing",
    "Access to Dr. Vital AI",
  ];

  return (
    <section id="membership" className="py-16 px-4 bg-foreground text-background">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 bg-background text-foreground overflow-hidden">
          <CardContent className="p-8 md:p-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Monthly Membership
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                Vital Pass
              </h2>
              <p className="text-muted-foreground text-lg">
                Your weekly wellness routine, locked in.
              </p>
            </div>

            <ul className="space-y-3 py-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button 
              asChild
              size="lg"
              className="w-full h-14 text-base font-semibold"
            >
              <Link to="/vitalpass">
                Start Vital Pass
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VitalPassCard;
