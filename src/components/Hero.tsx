import { Button } from "@/components/ui/button";
import { MessageCircle, Menu as MenuIcon, Instagram } from "lucide-react";
import heroImage from "@/assets/hero-juice-pour.jpg";

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openChatbot = () => {
    // This would typically open your chatbot widget
    console.log("Opening Dr. Vital chatbot...");
    // For now, we'll scroll to the chat section
    scrollToSection("#chat");
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Fresh juice being poured"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          {/* Main Headline */}
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              NeuroJuice
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="font-heading font-semibold text-2xl md:text-3xl lg:text-4xl text-foreground/90">
            Personalized Wellness in Every Sip
          </h2>
          
          {/* Description */}
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-driven juice blends tailored for your goals. Experience the perfect fusion of 
            technology and nutrition, crafted specifically for your unique wellness journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => scrollToSection("#menu")}
              className="min-w-48"
            >
              <MenuIcon className="w-5 h-5" />
              Explore Menu
            </Button>
            
            <Button 
              variant="accent" 
              size="xl"
              onClick={openChatbot}
              className="min-w-48"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Dr. Vital
            </Button>
          </div>

          {/* QR Code Call-to-Action */}
          <div className="pt-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-border shadow-soft">
              <div className="w-8 h-8 bg-gradient-hero rounded-sm flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="font-body text-sm text-muted-foreground">
                Scan QR for menu & ordering on the go
              </span>
            </div>
            
            {/* Instagram CTA */}
            <div className="animate-float" style={{ animationDelay: '0.5s' }}>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-background/90 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 shadow-soft"
              >
                <a
                  href="https://instagram.com/neurojuicehq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3"
                >
                  <Instagram className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-heading font-semibold text-foreground">Follow @neurojuicehq</div>
                    <div className="text-xs text-muted-foreground">Shop link in bio</div>
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default Hero;