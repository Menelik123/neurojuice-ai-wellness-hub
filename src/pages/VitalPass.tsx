import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Star, Gift, CheckCircle, MessageCircle, Loader2, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const VitalPass = () => {
  const features = [
    { icon: <CreditCard className="w-8 h-8" />, title: "$1 off every bottle ($7.50/bottle, regular $8.50)", description: "Member pricing on all individual juices, every order." },
    { icon: <Star className="w-8 h-8" />, title: "Free monthly Sea Moss shot", description: "Complimentary Sea Moss shot delivered with your orders each month." },
    { icon: <Gift className="w-8 h-8" />, title: "Early access to new bundles", description: "Be first to try new drops and get access to member-only bundles." },
    { icon: <MessageCircle className="w-8 h-8" />, title: "Access to Doctor Vital content", description: "Exclusive wellness content and personalized juice recommendations." },
  ];

  const faqItems = [
    { question: "How does member pricing work?", answer: "As a Vital Pass member, all single bottles are $7.50 instead of $8.50. That's $1 off every bottle, every order." },
    { question: "Can I cancel anytime?", answer: "Yes! You can cancel your membership anytime. You'll keep access to member benefits through the end of your billing period." },
    { question: "Does this work with delivery and pickup?", answer: "Absolutely! Member pricing applies to both delivery and pickup orders." },
    { question: "Do I need a membership to buy?", answer: "No! All products and bundles are available to everyone. Membership just gets you better pricing and perks." },
    { question: "What is the Sea Moss shot?", answer: "A standalone $1.00 Sea Moss shot packed with minerals. Members get one free every month with their orders." },
  ];

  const [joinEmail, setJoinEmail] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const handleJoinNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-vitalpass-checkout", {
        body: { email: joinEmail.trim() || undefined, origin: window.location.origin },
      });
      if (error || !data?.url) throw new Error(error?.message || "No checkout URL");
      window.location.href = data.url;
    } catch (err: any) {
      toast.error("Couldn't start checkout. Please try again.");
      console.error(err);
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-background to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground">Vital Pass</h1>
              <p className="font-body text-xl text-muted-foreground leading-relaxed">
                Your weekly performance fuel routine, locked in. Member pricing, free sea moss shots, and early access to every drop.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-center text-foreground mb-12">Member Benefits</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center hover:shadow-soft transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-center text-primary mb-4">{feature.icon}</div>
                      <CardTitle className="font-heading text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground text-sm">{feature.description}</p></CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-soft border-2 border-primary/20">
                <CardHeader className="bg-gradient-hero text-white text-center rounded-t-lg">
                  <CardTitle className="font-heading text-3xl">Vital Pass</CardTitle>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="font-bold text-5xl">$10</span>
                    <span className="text-lg opacity-90">/month</span>
                  </div>
                  <p className="text-white/80 text-sm mt-2">Cancel anytime — no commitment</p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {[
                      "$1 off every bottle ($7.50/bottle, regular $8.50)",
                      "Free monthly Sea Moss shot with every order",
                      "Early access to new drops and member-only bundles",
                      "Full Dr. Vital AI access — personalized juice recs",
                      "Your own member profile page",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleJoinNow} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="join-email">Email (optional — speeds up checkout)</Label>
                      <Input id="join-email" type="email" placeholder="you@example.com" value={joinEmail} onChange={(e) => setJoinEmail(e.target.value)} />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-14 text-base font-bold" disabled={joinLoading}>
                      {joinLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Loading...</> : <><CreditCard className="w-5 h-5 mr-2" />Join Vital Pass — $10/month</>}
                    </Button>
                  </form>
                  <div className="text-center">
                    <Link to="/profile" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary flex items-center justify-center gap-1">
                      <User className="w-3.5 h-3.5" />Already a member? View your profile
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-center text-foreground mb-12">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                    <AccordionTrigger className="font-medium text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">Wellness support only. Not medical advice.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VitalPass;
