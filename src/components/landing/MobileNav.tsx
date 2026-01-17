import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Fuel", href: "/fuel", isRoute: true },
  { label: "Vital Pass", href: "#vital-pass" },
  { label: "Dr. Vital", href: "#dr-vital" },
  { label: "Waitlist", href: "#waitlist" },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-heading font-bold text-xl text-foreground">
            NeuroJuice
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button onClick={() => handleNavClick("#menu")} size="sm">
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="py-3 px-4 text-left text-foreground font-medium hover:bg-muted rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="py-3 px-4 text-left text-foreground font-medium hover:bg-muted rounded-lg transition-colors"
                  >
                    {link.label}
                  </button>
                )
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileNav;
