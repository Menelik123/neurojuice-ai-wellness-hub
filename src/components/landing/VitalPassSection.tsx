import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Crown, Sparkles, Zap, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const VitalPassSection = () => {
  const benefits = [
    { icon: Zap, text: "$5 bottles (reg. $6.99)" },
    { icon: Check, text: "$3 ginger shots (reg. $4.99)" },
    { icon: Sparkles, text: "Early drop access" },
    { icon: Crown, text: "Exclusive bundles" },
    { icon: MessageCircle, text: "Access to Dr. Vital AI" },
  ];

  return (
    <section id="vital-pass" className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 bg-foreground text-background overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <div className="space-y-3">
                <h2 className="font-heading font-bold text-2xl md:text-4xl">
                  Vital Pass Membership
                </h2>
                <p className="text-background/80 text-lg max-w-xl mx-auto">
                  Get more juice for less. Join our membership for exclusive perks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-background/90">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-heading font-bold">$10</span>
                  <span className="text-background/60">/month</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary-glow text-primary-foreground"
                  >
                    <Link to="/vital-pass">
                      Join Vital Pass
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-background/30 text-background hover:bg-background/10"
                  >
                    <Link to="/vital-pass">
                      See Member Benefits
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VitalPassSection;
