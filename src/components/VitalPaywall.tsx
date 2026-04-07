import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VitalPaywallProps {
  onTrialStart: () => void;
}

const VitalPaywall = ({ onTrialStart }: VitalPaywallProps) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if trial has expired
  const isTrialExpired = window.NJ?.trialEndsAt && new Date() > window.NJ.trialEndsAt;

  const handleStartTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !consent) {
      toast({
        title: "Missing Information",
        description: "Please enter your email and accept the terms.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('start-vital-trial', {
        body: { email }
      });

      if (error) throw error;

      if (data.success) {
        window.NJ.hasVitalTrial = true;
        window.NJ.trialEndsAt = new Date(data.expiresAt);
        window.NJ.memberEmail = email;
        
        localStorage.setItem('nj_memberEmail', email);
        
        toast({
          title: "Trial Started!",
          description: "Welcome to your 14-day Dr. Vital trial.",
        });
        
        onTrialStart();
      } else {
        toast({
          title: data.error || "Failed to start trial",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error starting trial:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinVitalPass = () => {
    window.location.href = '/vitalpass';
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:hello@neurojuice.com';
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-soft">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="font-heading text-2xl">
              {isTrialExpired ? "Trial Expired" : "Unlock Dr. Vital"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isTrialExpired 
                ? "Your trial ended—join VitalPass to continue." 
                : "Your Personal Juice Coach"
              }
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isTrialExpired ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm">Personalized blends based on your goals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm">Progress check-ins and wellness tips</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm">Member savings with VitalPass</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Free Trial Option */}
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-4 space-y-4">
                    <div className="text-center">
                      <h3 className="font-medium">Free Trial</h3>
                      <Badge variant="secondary" className="mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        14 Days
                      </Badge>
                    </div>
                    
                    <form onSubmit={handleStartTrial} className="space-y-3">
                      <div>
                        <Label htmlFor="trial-email" className="text-xs">Email</Label>
                        <Input
                          id="trial-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="h-8"
                          defaultValue={window.NJ?.memberEmail || ""}
                        />
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="trial-consent"
                          checked={consent}
                          onCheckedChange={(checked) => setConsent(checked === true)}
                          className="mt-0.5"
                        />
                        <Label htmlFor="trial-consent" className="text-xs text-muted-foreground">
                          I agree to receive wellness updates
                        </Label>
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isLoading || !email || !consent}
                        className="w-full h-8 text-xs"
                        size="sm"
                      >
                        {isLoading ? "Starting..." : "Start Free Trial"}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        No charge today. Trial auto-expires.
                      </p>
                    </form>
                  </CardContent>
                </Card>

                {/* VitalPass Option */}
                <Card className="border-2 border-primary">
                  <CardContent className="p-4 space-y-4">
                    <div className="text-center">
                      <h3 className="font-medium">VitalPass</h3>
                      <Badge className="mt-1">
                        Full Access + Credits
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>• Unlimited Dr. Vital access</div>
                      <div>• $10 monthly store credit</div>
                      <div>• 20% member pricing</div>
                      <div>• Exclusive bundles</div>
                    </div>
                    
                    <Button
                      onClick={handleJoinVitalPass}
                      variant="hero"
                      className="w-full h-8 text-xs"
                      size="sm"
                    >
                      Join VitalPass
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Dismiss the paywall and let user stay on Dr. Vital page
                    const event = new CustomEvent('paywall-dismiss');
                    window.dispatchEvent(event);
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Maybe later
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Your free trial has ended. Join VitalPass to continue using Dr. Vital and unlock member benefits.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleJoinVitalPass}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Join VitalPass
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactSupport}
                  className="w-full"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VitalPaywall;