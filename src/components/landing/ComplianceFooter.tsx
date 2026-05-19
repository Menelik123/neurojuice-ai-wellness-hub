import { Mail, Instagram, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ComplianceFooter = () => {
  return (
    <footer className="py-12 px-4 bg-muted/50 border-t border-border">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xl text-foreground">
              NeuroJuice
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Functional juices, pressed fresh daily. AI-powered performance fuel for your wellness routine.
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Atlanta, Georgia
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> hello@neurojuice.com
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#menu" className="text-muted-foreground hover:text-foreground transition-colors">Menu</Link></li>
              <li><Link to="/#bundles" className="text-muted-foreground hover:text-foreground transition-colors">Bundles</Link></li>
              <li><Link to="/fuel" className="text-muted-foreground hover:text-foreground transition-colors">Order for Pickup</Link></li>
              <li><Link to="/#delivery" className="text-muted-foreground hover:text-foreground transition-colors">How Delivery Works</Link></li>
              <li><Link to="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/dr-vital" className="text-muted-foreground hover:text-foreground transition-colors">Dr. Vital AI</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:hello@neurojuice.com" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/vitalpass" className="text-muted-foreground hover:text-foreground transition-colors">Vital Pass Membership</Link></li>
            </ul>
            {/* Social */}
            <div className="flex gap-3 pt-2">
              <a href="https://instagram.com/neurojuicehq" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="space-y-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto pt-6 border-t border-border">
          <p>
            NeuroJuice content is for educational purposes only and is not medical advice. 
            These statements have not been evaluated by the Food and Drug Administration. 
            Our products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p>
            <strong className="text-foreground">Allergen Notice:</strong> Please review ingredients carefully. 
            If you have allergies or medical conditions, consult a licensed clinician before consuming.
          </p>
          <p>
            By signing up for SMS, you agree to receive text updates from NeuroJuice. 
            Msg & data rates may apply. Reply STOP to unsubscribe.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border space-y-2">
          <p>© {new Date().getFullYear()} NeuroJuice. All rights reserved.</p>
          <Link 
            to="/privacy-policy" 
            className="text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Technology Partner Attribution */}
        <div className="pt-6 text-center">
          <a
            href="https://ApexDigi.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Technology & Automation Partner — Apex Digital
          </a>
        </div>
      </div>
    </footer>
  );
};

export default ComplianceFooter;
