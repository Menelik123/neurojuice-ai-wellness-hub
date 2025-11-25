import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const SimpleEvents = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
          Find Us in the Community
        </h2>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          We sell at local pop-ups, basketball games, and wellness events across Atlanta. 
          Follow our Instagram for dates and locations.
        </p>
        <div className="pt-4">
          <Button 
            asChild
            className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg rounded-lg shadow-card"
          >
            <a
              href="https://instagram.com/neurojuicehq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow Us</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SimpleEvents;
