import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailIncentive = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    toast({
      title: "You're in!",
      description: "Check your email for your $5 discount code.",
    });
    
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-xl mx-auto">
        <Card className="border border-border">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Gift className="w-7 h-7 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl text-foreground">
                Get $5 Off Your First Drop
              </h2>
              <p className="text-muted-foreground">
                Join our email list for exclusive offers and wellness tips.
              </p>
            </div>

            {isSubmitted ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Check className="w-5 h-5" />
                <span className="font-medium">Check your inbox for your code!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background border-border"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-glow text-primary-foreground"
                >
                  {isSubmitting ? "Sending..." : "Get $5 Off"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EmailIncentive;
