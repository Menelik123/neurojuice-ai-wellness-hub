import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("nj_memberEmail");

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Fuel", href: "/fuel" },
    { label: "Dr. Vital", href: "/dr-vital" },
    { label: "Vital Pass", href: "/vitalpass" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/35b5767b-d341-4c7a-9b10-ec63941d1959.png" 
              alt="NeuroJuice Logo" 
              className="h-12 w-auto"
            />
            <span className="font-heading font-bold text-xl text-foreground">NeuroJuice</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="font-body text-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>

          {/* Profile + Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/profile" className="relative p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="My Account">
              <UserCircle className="w-5 h-5" />
              {isLoggedIn && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </Link>
          </div>

          {/* Mobile: profile + menu button */}
          <div className="md:hidden flex items-center gap-1">
            <Link to="/profile" className="relative p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="My Account">
              <UserCircle className="w-5 h-5" />
              {isLoggedIn && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </Link>
            <Button
              variant="ghost"
              size="icon"
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
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-body text-foreground hover:text-primary transition-colors duration-300 text-left"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
