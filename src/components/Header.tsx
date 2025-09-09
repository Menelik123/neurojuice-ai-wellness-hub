import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, QrCode, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import PasscodeModal from "./PasscodeModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Check if user has exotic access
  const hasExoticAccess = sessionStorage.getItem("exotic-access") === "granted";

  const navItems = [
    { label: "Home", href: "#home", action: "scroll" },
    { label: "Menu", href: "/menu", action: "navigate" },
    { label: "Dr. Vital", href: "/dr-vital", action: "navigate" },
    { label: "VitalPass", href: "/vitalpass", action: "navigate" },
    { label: "Reviews", href: "#reviews", action: "scroll" },
    { label: "About", href: "#about", action: "scroll" },
    { label: "Order", href: "/order-options", action: "navigate" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.action === "scroll") {
      if (item.href === "#home") {
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.href = '/';
        }
      } else {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else if (item.action === "chat") {
      // Open chatbot widget - assuming there's a global chat function
      const chatWidget = document.querySelector('#chat');
      if (chatWidget) {
        chatWidget.scrollIntoView({ behavior: "smooth" });
      }
    } else if (item.action === "navigate") {
      window.location.href = item.href;
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/35b5767b-d341-4c7a-9b10-ec63941d1959.png" 
              alt="NeuroJuice Logo" 
              className="h-12 w-auto"
            />
            <span className="font-heading font-bold text-xl text-foreground">NeuroJuice</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
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
            <button 
              onClick={() => setIsQrModalOpen(true)}
              className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan for mobile menu</span>
            </button>
            
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
                onClick={() => handleNavClick(item)}
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

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mobile Menu QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 p-4">
            <div className="w-48 h-48 bg-white p-4 rounded-lg border-2 border-border flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://neurojuice.lovable.app" 
                alt="QR Code for NeuroJuice mobile menu"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code with your phone to access the NeuroJuice menu on mobile
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;