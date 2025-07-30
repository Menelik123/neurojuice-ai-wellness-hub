import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CookieNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("neurojuice-cookies-accepted");
    if (!hasAccepted) {
      // Show notice after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("neurojuice-cookies-accepted", "true");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("neurojuice-cookies-accepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-6 left-6 right-6 z-50 transition-all duration-500",
      "md:left-6 md:right-auto md:max-w-md",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <Card className="shadow-soft border-0 bg-background/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <Cookie className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <h3 className="font-heading font-semibold text-foreground">
                We use cookies
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and personalize 
                your juice recommendations. By continuing, you accept our use of cookies.
              </p>
              
              {/* Links */}
              <div className="flex flex-wrap gap-2 text-xs">
                <a 
                  href="#privacy" 
                  className="text-primary hover:underline font-body"
                >
                  Privacy Policy
                </a>
                <span className="text-muted-foreground">•</span>
                <a 
                  href="#cookies" 
                  className="text-primary hover:underline font-body"
                >
                  Cookie Policy
                </a>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={acceptCookies}
                  variant="default"
                  size="sm"
                  className="flex-1"
                >
                  Accept All
                </Button>
                <Button
                  onClick={rejectCookies}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Reject All
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieNotice;