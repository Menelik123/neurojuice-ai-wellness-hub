import { Instagram, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingFooter = () => {
  const scrollToSMS = () => {
    document.querySelector("#sms-signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-4 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto">
        {/* Final CTA */}
        <div className="text-center mb-10 pb-10 border-b border-border">
          <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
            Don't Miss the Next Drop
          </h3>
          <Button 
            onClick={scrollToSMS}
            size="lg"
            className="bg-primary hover:bg-primary-glow text-primary-foreground"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Get Text Alerts
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-xl text-foreground mb-1">
              NeuroJuice
            </h3>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NeuroJuice LLC. All rights reserved.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="flex items-center gap-6">
            <a 
              href="mailto:support@neurojuice.store"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">support@neurojuice.store</span>
            </a>
            <a 
              href="https://instagram.com/neurojuicehq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm">@neurojuicehq</span>
            </a>
          </div>
        </div>

        {/* SMS Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            By subscribing to SMS, you consent to receiving text messages from NeuroJuice at the phone number provided. 
            Message frequency varies. Msg & data rates may apply. Reply STOP to unsubscribe or HELP for help.
          </p>
        </div>

        {/* FDA Disclaimer */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground text-center">
            NeuroJuice products are not intended to diagnose, treat, cure, or prevent any disease. 
            These statements have not been evaluated by the Food and Drug Administration.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
