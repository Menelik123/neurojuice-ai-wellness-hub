import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('nj_seen_welcome_modal');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      toast({
        title: "Enter your email or phone",
        description: "We need at least one way to reach you.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const digits = phone.replace(/\D/g, "");
      
      if (digits.length > 0) {
        const formattedPhone = `+1${digits}`;
        await supabase.functions.invoke("klaviyo-subscribe", {
          body: {
            phone: formattedPhone,
            email: email || undefined,
            source: "welcome_gate",
          },
        });
      }

      localStorage.setItem('nj_memberEmail', email);
      localStorage.setItem('nj_seen_welcome_modal', 'true');
      
      if (window.NJ) {
        window.NJ.memberEmail = email;
      }
      
      setIsOpen(false);
      
      toast({
        title: "Welcome to NeuroJuice! 🎉",
        description: "Use code WELCOME10 for $2 off your first order.",
      });
    } catch (error) {
      // Still let them through
      localStorage.setItem('nj_seen_welcome_modal', 'true');
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('nj_seen_welcome_modal', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              Get Early Access to Weekly Drops
            </h2>
            <p className="text-muted-foreground">
              Join the list for <span className="font-semibold text-primary">$2 off your first order</span>, 
              member pricing, and first dibs on limited drops.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gate-email">Email</Label>
              <Input
                id="gate-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gate-phone">Phone (for SMS drop alerts)</Label>
              <Input
                id="gate-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="h-12"
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="gate-consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="gate-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I agree to receive text & email updates from NeuroJuice. 
                Msg & data rates may apply. Reply STOP to unsubscribe.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || (!email && !phone) || !consent}
              className="w-full h-14 text-base font-bold"
            >
              {isLoading ? "Joining..." : "Unlock $2 Off + Early Access"}
            </Button>
          </form>

          <button
            onClick={handleClose}
            className="block w-full text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailCaptureModal;
