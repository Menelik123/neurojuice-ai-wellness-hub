import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Crown, Sparkles, Zap, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const VitalPassSection = () => {
  const benefits = [
    { icon: Zap, text: "$1 off every bottle ($7.50/bottle)" },
    { icon: Check, text: "Free monthly sea moss shot" },
    { icon: Sparkles, text: "Early access to new bundles" },
    { icon: MessageCircle, text: "Access to Doctor Vital content" },
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
                  NeuroRoutine Membership
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
                  <span className="text-4xl font-heading font-bold">$5</span>
                  <span className="text-background/60">/month</span>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-background hover:bg-background/90 text-foreground font-semibold rounded-lg px-8 py-6 text-lg transition-all hover:scale-105 active:scale-100"
                  >
                    <Link to="/vitalpass">
                      <Crown className="w-5 h-5 mr-2" />
                      Join NeuroRoutine — Save on Every Drop
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
