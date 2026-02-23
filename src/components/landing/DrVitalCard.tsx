import { Button } from "@/components/ui/button";
import { Bot, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DrVitalCard = () => {
  return (
    <section id="dr-vital" className="py-20 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
          <Bot className="w-10 h-10 text-primary" />
        </div>

        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
          Not sure what to drink?
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Let AI build your stack in 30 seconds.
        </p>

        <Button 
          asChild
          size="xl"
          className="h-14 px-10 text-base font-bold"
        >
          <Link to="/dr-vital">
            Ask Dr. Vital
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>

        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Dr. Vital is an educational tool, not a medical professional. 
          For health concerns, consult a licensed clinician.
        </p>
      </div>
    </section>
  );
};

export default DrVitalCard;
