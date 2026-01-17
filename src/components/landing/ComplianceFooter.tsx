import { Mail } from "lucide-react";

const ComplianceFooter = () => {
  return (
    <footer className="py-12 px-4 bg-muted/50 border-t border-border">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Brand */}
        <div className="text-center">
          <h3 className="font-heading font-bold text-xl text-foreground mb-2">
            NeuroJuice
          </h3>
          <p className="text-muted-foreground text-sm">
            Functional juices, made fresh.
          </p>
        </div>

        {/* Contact */}
        <div className="flex justify-center">
          <a 
            href="mailto:hello@neurojuice.com" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4" />
            hello@neurojuice.com
          </a>
        </div>

        {/* Disclaimers */}
        <div className="space-y-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          {/* Educational Disclaimer */}
          <p>
            NeuroJuice content is for educational purposes only and is not medical advice. 
            These statements have not been evaluated by the Food and Drug Administration. 
            Our products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>

          {/* Allergen Note */}
          <p>
            <strong className="text-foreground">Allergen Notice:</strong> Please review ingredients carefully. 
            If you have allergies or medical conditions, consult a licensed clinician before consuming.
          </p>

          {/* SMS Consent */}
          <p>
            By signing up for SMS, you agree to receive text updates from NeuroJuice. 
            Msg & data rates may apply. Reply STOP to unsubscribe.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>© {new Date().getFullYear()} NeuroJuice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default ComplianceFooter;
