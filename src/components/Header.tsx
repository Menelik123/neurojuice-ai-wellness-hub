import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, QrCode, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import PasscodeModal from "./PasscodeModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

  // Check if user has exotic access
  const hasExoticAccess = sessionStorage.getItem("exotic-access") === "granted";

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Menu", href: "#menu" },
    { label: "Reviews", href: "#reviews" },
    { label: "About", href: "#about" },
    { label: "Chat", href: "#chat" },
    { label: "Order", href: "#order" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">N</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">NeuroJuice</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="font-body text-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </button>
            ))}
            
            {/* Hidden Exotic Menu Link */}
            {hasExoticAccess ? (
              <a 
                href="/exotic-menu"
                className="font-body text-primary hover:text-primary-glow transition-colors duration-300 relative group flex items-center space-x-1"
              >
                <Lock className="w-4 h-4" />
                <span>Exotic</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            ) : (
              <button
                onClick={() => setIsPasscodeModalOpen(true)}
                className="font-body text-muted-foreground hover:text-foreground transition-colors duration-300 opacity-50 hover:opacity-100 text-xs"
                title="Secret Menu"
              >
                🔒
              </button>
            )}
          </nav>

          {/* QR Code & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <QrCode className="w-4 h-4" />
              <span>Scan for mobile menu</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden mt-4 pb-4 border-t border-border transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="flex flex-col space-y-3 pt-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="font-body text-foreground hover:text-primary transition-colors duration-300 text-left"
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Exotic Menu Link */}
            {hasExoticAccess ? (
              <a 
                href="/exotic-menu"
                className="font-body text-primary hover:text-primary-glow transition-colors duration-300 text-left flex items-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Exotic Menu</span>
              </a>
            ) : (
              <button
                onClick={() => setIsPasscodeModalOpen(true)}
                className="font-body text-muted-foreground hover:text-foreground transition-colors duration-300 text-left opacity-50 hover:opacity-100 text-sm"
              >
                🔒 Secret Menu
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Passcode Modal */}
      <PasscodeModal 
        isOpen={isPasscodeModalOpen} 
        onClose={() => setIsPasscodeModalOpen(false)} 
      />
    </header>
  );
};

export default Header;