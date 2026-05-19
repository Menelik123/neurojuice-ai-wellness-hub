import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Menu", href: "#menu", isRoute: false },
  { label: "Bundles", href: "#bundles", isRoute: false },
  { label: "How It Works", href: "#delivery", isRoute: false },
  { label: "Fuel", href: "/fuel", isRoute: true },
  { label: "Dr. Vital", href: "/dr-vital", isRoute: true },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setDrawerOpen } = useCart();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("nj_memberEmail");

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      {/* Delivery banner */}
      <div className="bg-foreground text-background py-2 px-4 text-center text-xs font-medium">
        <div className="flex items-center justify-center gap-2">
          <span>🚚</span>
          <span>Order by 3PM → Delivered Today (Local Only)</span>
        </div>
      </div>
      <div className="border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">N</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">NeuroJuice</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop right: profile + cart */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/profile" className="relative p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="My Account">
              <UserCircle className="w-5 h-5" />
              {isLoggedIn && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: profile + cart + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <Link to="/profile" className="relative p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="My Account">
              <UserCircle className="w-5 h-5" />
              {isLoggedIn && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 text-foreground"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) =>
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
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="py-3 px-4 text-left text-foreground font-medium hover:bg-muted rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

export default MobileNav;
