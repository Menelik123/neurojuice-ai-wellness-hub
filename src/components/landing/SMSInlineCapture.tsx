import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SMSInlineCaptureProps {
  variant?: "light" | "dark";
  message?: string;
}

const SMSInlineCapture = ({ variant = "light", message = "Don't miss the next drop" }: SMSInlineCaptureProps) => {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("klaviyo-subscribe", {
        body: { 
          phone: phone.trim(),
          source: "inline_capture"
        },
      });

      if (error) {
        throw new Error(error.message || "Subscription failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "You'll get a text when the next batch drops.",
      });
    } catch (error) {
      console.error("SMS subscription error:", error);
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = variant === "dark";

  if (submitted) {
    return (
      <div className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg ${isDark ? 'bg-primary/20' : 'bg-primary/10'}`}>
        <Check className="w-5 h-5 text-primary" />
        <span className={`font-medium ${isDark ? 'text-background' : 'text-foreground'}`}>
          You're on the list!
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-background/10' : 'bg-muted/50'}`}>
      <p className={`text-sm mb-3 ${isDark ? 'text-background/80' : 'text-muted-foreground'}`}>
        {message}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="tel"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`flex-1 ${isDark ? 'bg-background text-foreground' : ''}`}
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary-glow text-primary-foreground"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {isLoading ? "..." : "Get Alerts"}
        </Button>
      </form>
      <p className={`text-xs mt-2 ${isDark ? 'text-background/50' : 'text-muted-foreground'}`}>
        Msg & data rates may apply. Reply STOP to unsubscribe.
      </p>
    </div>
  );
};

export default SMSInlineCapture;
