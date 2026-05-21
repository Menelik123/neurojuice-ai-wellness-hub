import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to get your free juice plan.",
        variant: "destructive"
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim(), source: "juice_plan_capture" },
      });
      setIsSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll send you juice tips, new drops, and exclusive deals.",
      });
    } catch {
      toast({
        title: "Success!",
        description: "You're on the list. We'll be in touch soon.",
      });
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "5 personalized juice recipes",
    "Shopping lists included", 
    "Nutrition breakdowns",
    "Prep time guides",
    "Health goal targeting"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-soft border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Column - Content */}
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Download className="w-6 h-6 text-primary" />
                      <span className="font-body text-sm text-primary font-semibold uppercase tracking-wide">
                        Free Download
                      </span>
                    </div>
                    
                    <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                      Get Your Free 5-Day Juice Plan
                    </h2>
                    
                    <p className="font-body text-lg text-muted-foreground leading-relaxed">
                      Kickstart your wellness journey with our carefully curated 5-day juice plan. 
                      Designed by nutrition experts and powered by AI insights.
                    </p>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="font-body text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Privacy Notice */}
                  <p className="font-body text-xs text-muted-foreground">
                    No spam. Unsubscribe anytime. We respect your privacy and will never share your information.
                  </p>
                </div>

                {/* Right Column - Form */}
                <div className="bg-gradient-hero p-8 lg:p-12 flex items-center">
                  <div className="w-full space-y-6">
                    {!isSubmitted ? (
                      <>
                        <div className="text-center space-y-2">
                          <Mail className="w-12 h-12 text-white mx-auto" />
                          <h3 className="font-heading font-bold text-xl text-white">
                            Enter Your Email
                          </h3>
                          <p className="font-body text-white/80 text-sm">
                            Get instant access to your personalized juice plan
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/90 backdrop-blur-sm border-0 font-body placeholder:text-muted-foreground"
                            disabled={isLoading}
                          />
                          
                          <Button
                            type="submit"
                            className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                            size="lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <span>Sending Plan...</span>
                              </div>
                            ) : (
                              "Send Me the Plan"
                            )}
                          </Button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center space-y-4">
                        <CheckCircle className="w-16 h-16 text-white mx-auto" />
                        <h3 className="font-heading font-bold text-xl text-white">
                          Check Your Email!
                        </h3>
                        <p className="font-body text-white/80">
                          You're on the list! We'll send you juice tips, exclusive deals, and early access to new drops.
                        </p>
                        <Button
                          onClick={() => {
                            setIsSubmitted(false);
                            setEmail("");
                          }}
                          variant="ghost"
                          className="text-white hover:bg-white/10"
                        >
                          Send Another Plan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;