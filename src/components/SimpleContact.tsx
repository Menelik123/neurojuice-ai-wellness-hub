import { Mail } from "lucide-react";
import { Instagram } from "lucide-react";

const SimpleContact = () => {
  return (
    <section className="py-16 px-4 bg-muted">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8">
          Contact Us
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <a 
            href="mailto:support@neurojuice.store" 
            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span className="text-lg">support@neurojuice.store</span>
          </a>
          
          <a 
            href="https://instagram.com/neurojuicehq"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="text-lg">@NeuroJuiceHQ</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SimpleContact;
