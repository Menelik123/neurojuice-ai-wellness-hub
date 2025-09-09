import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Star, 
  Gift, 
  Clock,
  CheckCircle,
  Zap
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const VitalPass = () => {
  const memberPrice = window.NJ_CONFIG ? 
    (window.NJ_CONFIG.REGULAR_PRICE * (1 - window.NJ_CONFIG.MEMBER_DISCOUNT_PCT)).toFixed(2) : 
    "6.39";
  
  const isMember = window.NJ?.isMember || false;

  const handleJoinVitalPass = () => {
    // Redirect to Shopify membership product (placeholder)
    window.open('/products/vitalpass-membership', '_blank');
  };

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "$10/mo → $10 store credit",
      description: "Monthly store credit automatically issued to your account"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "~20% member pricing",
      description: `Example: $7.99 → $${memberPrice} on all individual juices`
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Members-only bundles & perks",
      description: "Early access to new blends and exclusive birthday treats"
    }
  ];

  const faqItems = [
    {
      question: "How do store credits work?",
      answer: "You receive $10 in store credit each month that automatically applies at checkout. Credits accumulate and never expire as long as your membership is active."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your VitalPass membership anytime from your account settings. You'll keep access to member benefits through the end of your billing period."
    },
    {
      question: "Does this work with delivery and pickup?",
      answer: "Absolutely! Member pricing and credits apply to both delivery and pickup orders. Just select your preferred option at checkout."
    },
    {
      question: "What's the difference between trial and paid access?",
      answer: "Free trial gives you 14 days of Dr. Vital access. VitalPass includes Dr. Vital plus monthly credits, member pricing, and exclusive bundles."
    }
  ];

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
                  VitalPass Membership
                </h1>
                <p className="font-body text-xl text-muted-foreground leading-relaxed">
                  Monthly store credit, member pricing, and access to Dr. Vital AI health coaching.
                </p>
                
                {isMember && (
                  <Badge className="bg-success text-success-foreground font-bold text-lg px-4 py-2">
                    Active Member
                  </Badge>
                )}
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
                  <CardTitle className="font-heading text-3xl">VitalPass</CardTitle>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-bold text-4xl">$10</span>
                    <span className="text-lg opacity-90">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>$10 monthly store credit (auto-applied at checkout)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>~20% member pricing on all products</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Unlimited Dr. Vital AI coaching access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Members-only bundles and early access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Cancel anytime (no commitment)</span>
                    </div>
                  </div>
                  
                  {!isMember ? (
                    <Button
                      onClick={handleJoinVitalPass}
                      variant="hero"
                      size="lg"
                      className="w-full"
                    >
                      <Zap className="w-5 h-5" />
                      Join VitalPass
                    </Button>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-success/10 rounded-lg">
                        <p className="font-medium text-success">You're already a VitalPass member!</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        Manage Membership
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Credit Balance Section */}
        {isMember && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                  <CardContent className="p-8 space-y-4">
                    <h3 className="font-heading font-bold text-2xl">Your VitalPass Credit</h3>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary" data-credit-balance>
                        $15.50
                      </div>
                      <div className="text-sm text-muted-foreground" data-next-credit-date>
                        Next credit date: March 15, 2024
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

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

        {/* Compliance Footer */}
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