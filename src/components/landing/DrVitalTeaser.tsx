import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const DrVitalTeaser = () => {
  return (
    <section id="dr-vital" className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icon/Visual */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center relative">
                  <Bot className="w-12 h-12 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                  Meet Dr. Vital — Your AI Juice Guide
                </h2>
                <p className="text-muted-foreground text-lg">
                  Get personalized juice recommendations based on your goals. 
                  Dr. Vital knows our menu inside and out and can help you find the perfect blend.
                </p>
                
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary-glow text-primary-foreground"
                >
                  <Link to="/vital-pass">
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock with Vital Pass
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DrVitalTeaser;
