import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SMSOptInFormProps {
  variant?: "hero" | "inline" | "compact";
  showEmail?: boolean;
}

const SMSOptInForm = ({ variant = "inline", showEmail = true }: SMSOptInFormProps) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast({
        title: "Phone number required",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("klaviyo-subscribe", {
        body: { 
          phone: phone.trim(), 
          email: email.trim() || undefined,
          source: "sms_optin_form"
        },
      });

      if (error) {
        throw new Error(error.message || "Subscription failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "You're on the list!",
        description: data?.message || "We'll text you when the next drop is ready.",
      });
      
      setPhone("");
      setEmail("");
    } catch (error) {
      console.error("SMS subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 bg-background border-border"
        />
        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-glow text-primary-foreground">
          <MessageSquare className="w-4 h-4 mr-2" />
          {isSubmitting ? "Joining..." : "Get Alerts"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-3">
        <Input
          type="tel"
          placeholder="Phone number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-background border-border text-foreground"
          required
        />
        {showEmail && (
          <Input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background border-border text-foreground"
          />
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-6 text-lg"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        {isSubmitting ? "Joining..." : "Get Drop Alerts by Text"}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        By signing up, you agree to receive SMS updates from NeuroJuice. Msg & data rates may apply. Reply STOP to unsubscribe.
      </p>
    </form>
  );
};

export default SMSOptInForm;
