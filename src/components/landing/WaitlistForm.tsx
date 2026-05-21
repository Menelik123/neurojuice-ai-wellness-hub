import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bell, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const allDrinks = [
  "Tropical Breeze",
  "Beet Flow",
  "Green Vital",
  "Mint Condition",
  "Strawberry Horizon",
  "Hibiscus Delight",
  "Sea Moss Shot",
];

const WaitlistForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDrink, setPreferredDrink] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive text updates.",
        variant: "destructive",
      });
      return;
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = `+1${digits}`;
      
      const { error } = await supabase.functions.invoke("brevo-subscribe", {
        body: {
          phone: formattedPhone,
          email: email || undefined,
          source: "waitlist_form",
        },
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll text you when your juice is ready.",
      });
    } catch (error) {
      console.error("Waitlist signup error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="waitlist" className="py-16 px-4 bg-background">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-primary bg-primary/5">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-foreground">
                You're on the list!
              </h3>
              <p className="text-muted-foreground">
                Check your phone — your 10% code and AI profile link are on the way.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-16 px-4 bg-background">
      <div className="max-w-md mx-auto">
        <Card className="border border-border">
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-foreground">
                Don't Miss the Next Drop — Get Notified First
              </h2>
              <p className="text-muted-foreground">
                Be first to claim limited drops, get personalized stack recommendations, and <span className="font-semibold text-primary">10% off your first order</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drink">What do you want most?</Label>
                <Select value={preferredDrink} onValueChange={setPreferredDrink}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a drink" />
                  </SelectTrigger>
                  <SelectContent>
                    {allDrinks.map((drink) => (
                      <SelectItem key={drink} value={drink}>
                        {drink}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I agree to receive text updates about drops and availability. 
                  Msg & data rates may apply.
                </Label>
              </div>

              <Button 
                type="submit" 
                size="lg"
                disabled={loading}
                className="w-full h-14 text-base font-semibold"
              >
                {loading ? "Joining..." : "Get Notified First →"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WaitlistForm;
