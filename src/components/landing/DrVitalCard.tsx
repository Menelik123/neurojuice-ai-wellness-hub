import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const DrVitalCard = () => {
  return (
    <section id="dr-vital" className="py-16 px-4 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <Card className="border border-primary/20 bg-card overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Bot className="w-10 h-10 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                  Meet Dr. Vital
                </h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Your personal juice guide. Dr. Vital helps you find the right blend 
                  based on your wellness goals — no medical advice, just smart recommendations.
                </p>
              </div>

              {/* CTA */}
              <Button 
                asChild
                size="lg"
                className="h-12 px-8"
              >
                <Link to="/dr-vital">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Dr. Vital
                </Link>
              </Button>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground max-w-sm">
                Dr. Vital is an educational tool, not a medical professional. 
                For health concerns, consult a licensed clinician.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DrVitalCard;
