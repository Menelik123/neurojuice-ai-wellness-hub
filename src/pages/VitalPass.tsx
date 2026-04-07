import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Star, 
  Gift, 
  CheckCircle,
  Zap,
  Bell
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const VitalPass = () => {
  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "$5 bottles (regular $6)",
      description: "Member pricing on all individual juices, every order."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Free monthly ginger shots",
      description: "Complimentary ginger shots delivered with your orders each month."
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Early access & exclusive bundles",
      description: "Be first to try new drops and get access to member-only bundles."
    }
  ];

  const faqItems = [
    {
      question: "How does member pricing work?",
      answer: "As a NeuroRoutine member, all single bottles are $5 instead of $6. Savings apply automatically at checkout."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your membership anytime. You'll keep access to member benefits through the end of your billing period."
    },
    {
      question: "Does this work with delivery and pickup?",
      answer: "Absolutely! Member pricing applies to both delivery and pickup orders."
    },
    {
      question: "Do I need a membership to buy?",
      answer: "No! All products and bundles are available to everyone. Membership just gets you better pricing and perks."
    }
  ];

  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistPhone, setWaitlistPhone] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) {
      toast.error("Please enter your email");
      return;
    }
    setWaitlistLoading(true);
    try {
      await supabase.functions.invoke("klaviyo-subscribe", {
        body: {
          email: waitlistEmail,
          phone: waitlistPhone || undefined,
          source: "vitalpass_waitlist",
          custom_properties: { name: waitlistName || undefined },
        },
      });
      setWaitlistSubmitted(true);
      toast.success("You're on the list! We'll notify you when NeuroRoutine launches.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="font-heading font-bold text-5xl text-foreground">
                  NeuroRoutine Membership
                </h1>
                <p className="font-body text-xl text-muted-foreground leading-relaxed">
                  Your weekly performance fuel routine, locked in. Member pricing, free ginger shots, and early access to every drop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-4xl text-center text-foreground mb-12">
                Member Benefits
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center hover:shadow-soft transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-soft border-2 border-primary/20">
                <CardHeader className="bg-gradient-hero text-white text-center">
                  <CardTitle className="font-heading text-3xl">NeuroRoutine</CardTitle>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-bold text-4xl">$10</span>
                    <span className="text-lg opacity-90">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>$5 bottles (regular $6)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Free monthly ginger shots</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Early access to new drops</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Exclusive bundle pricing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Cancel anytime (no commitment)</span>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    className="w-full"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Join NeuroRoutine — Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-4xl text-center text-foreground mb-12">
                Frequently Asked Questions
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                    <AccordionTrigger className="font-medium text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Wellness support only. Not medical advice.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VitalPass;
