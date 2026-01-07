import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, X } from "lucide-react";

const StickyNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "How Drops Work", target: "#how-it-works" },
    { label: "Available Now", target: "#available-now" },
    { label: "Bundles", target: "#bundles" },
    { label: "Vital Pass", target: "#vital-pass" },
    { label: "Dr. Vital", target: "#dr-vital" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-heading font-bold text-xl text-foreground"
          >
            NeuroJuice
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollToSection(item.target)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Button
              size="sm"
              onClick={() => scrollToSection("#sms-signup")}
              className="bg-primary hover:bg-primary-glow text-primary-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Get Text Alerts
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border bg-background">
            <div className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => scrollToSection(item.target)}
                  className="text-left px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="px-4 pt-2">
                <Button
                  onClick={() => scrollToSection("#sms-signup")}
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get Text Alerts
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StickyNav;
