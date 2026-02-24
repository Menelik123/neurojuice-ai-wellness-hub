import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Twitter, Hash } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { label: "Menu", href: "#menu" },
    { label: "Chatbot", href: "#chat" },
    { label: "Reviews", href: "#reviews" },
    { label: "About", href: "#about" },
    { label: "Order", href: "#order" }
  ];

  const legalLinks = [
    { label: "FAQ", href: "#faq" },
    { label: "Privacy Policy", href: "/privacy-policy", isRoute: true },
    { label: "Terms of Service", href: "#terms" },
    { label: "Refund Policy", href: "#refunds" }
  ];

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/neurojuicehq", label: "Instagram" },
    { icon: <Hash className="w-5 h-5" />, href: "https://tiktok.com/@neurojuice", label: "TikTok" },
    { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com/@neurojuice", label: "YouTube" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/neurojuice", label: "X (Twitter)" }
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-xl">NeuroJuice</span>
            </div>
            <p className="font-body text-background/80 leading-relaxed">
              AI-powered personalized nutrition that adapts to your unique wellness goals. 
              Experience the future of healthy living.
            </p>
            <div className="space-y-2">
              <p className="font-body text-sm text-background/90">
                📍 Atlanta, Georgia
              </p>
              <p className="font-body text-sm text-background/90">
                ✉️ hello@neurojuice.com
              </p>
              <p className="font-body text-sm text-background/90">
                📞 321-367-2172
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-background/80 hover:text-background transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg">Support</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="font-body text-background/80 hover:text-background transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="font-body text-background/80 hover:text-background transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg">Stay Connected</h3>
            <p className="font-body text-background/80 text-sm">
              Follow us for daily wellness tips, new blend announcements, and exclusive offers.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-background/80 hover:text-background hover:bg-background/10"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <p className="font-body text-sm text-background/90">
                Get wellness tips & exclusive offers
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-background/30 text-background hover:bg-background hover:text-foreground"
                onClick={() => scrollToSection("#newsletter")}
              >
                Join Newsletter
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-body text-background/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} NeuroJuice. All rights reserved. Made with ❤️ for your wellness journey.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy-policy" className="font-body text-background/60 hover:text-background transition-colors">
                Privacy
              </Link>
              <a href="#terms" className="font-body text-background/60 hover:text-background transition-colors">
                Terms
              </a>
              <a href="#cookies" className="font-body text-background/60 hover:text-background transition-colors">
                Cookies
              </a>
            </div>
          </div>

          {/* Technology Partner Attribution */}
          <div className="mt-6 text-center">
            <a
              href="https://ApexDigi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] text-background/40 hover:text-background/60 transition-colors"
            >
              Technology & Automation Partner — Apex Digital
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;