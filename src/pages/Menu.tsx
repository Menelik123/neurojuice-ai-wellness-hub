import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberBundles from "@/components/MemberBundles";
import MemberPricing from "@/components/MemberPricing";
import PasscodeModal from "@/components/PasscodeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, Gift, Lock } from "lucide-react";
import { juices } from "@/data/juices";
import { Link } from "react-router-dom";

import tropicalBreeze from "@/assets/product-tropical-breeze.webp";
import beetFlow from "@/assets/product-beet-flow.webp";
import strawberryHorizon from "@/assets/product-strawberry-horizon.webp";
import mintCondition from "@/assets/product-mint-condition.webp";
import greenVital from "@/assets/product-green-vital.webp";
import hibiscusDelight from "@/assets/product-hibiscus-delight.webp";

const Menu = () => {
  const [showPasscode, setShowPasscode] = useState(false);
  const imageMap: Record<string, string> = {
    "tropical-breeze": tropicalBreeze,
    "beet-flow": beetFlow,
    "green-vital": greenVital,
    "mint-condition": mintCondition,
    "strawberry-horizon": strawberryHorizon,
    "hibiscus-delight": hibiscusDelight,
  };

  const bundles = [
    { name: "Starter Stack (3 Bottles)", price: "$23.00", savings: "$2.50", icon: <Gift className="w-8 h-8" />, benefits: ["3 Bottles", "You Choose", "Save $2.50"] },
    { name: "Performance Pack (5 Bottles)", price: "$38.00", savings: "$4.50", icon: <Users className="w-8 h-8" />, benefits: ["5 Bottles", "Best Value", "Save $4.50"] },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-background to-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">Complete NeuroJuice Menu</h1>
              <p className="font-body text-xl text-muted-foreground leading-relaxed">
                6 functional juices crafted for performance, recovery, and wellness.
              </p>
              <p className="text-sm text-muted-foreground">
                Single bottle: $8.50 | With sea moss: $9.50 | Sea moss shot: $1.00
              </p>
            </div>
          </div>
        </section>

        <MemberBundles />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-4">Individual Blends</h2>
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                Each blend is crafted with specific ingredients to target your wellness goals.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {juices.map((juice) => (
                <Card key={juice.slug} className="group hover:shadow-soft transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img src={imageMap[juice.slug] || tropicalBreeze} alt={juice.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground font-bold">${juice.price.toFixed(2)}</Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="text-xs">{juice.tagline}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-1">{juice.name}</h3>
                        <p className="font-body text-sm text-muted-foreground mb-2">
                          <strong>Ingredients:</strong> {juice.ingredients.join(", ")}
                        </p>
                        <p className="font-body text-sm text-foreground leading-relaxed">{juice.benefit}</p>
                      </div>
                      <MemberPricing regularPrice={8.5} showJoinLink={false} size="sm" />
                      <Button asChild variant="default" className="w-full">
                        <Link to={`/juice/${juice.slug}`}>
                          <ShoppingCart className="w-4 h-4 mr-2" />View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <MemberBundles />

        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-4">Value Bundle Packs</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {bundles.map((bundle, index) => (
                <Card key={index} className="hover:shadow-soft transition-all duration-300 bg-gradient-to-br from-white to-secondary/30">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-6">
                      <div className="flex justify-center text-primary">{bundle.icon}</div>
                      <div>
                        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">{bundle.name}</h3>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {bundle.benefits.map((b, i) => (<Badge key={i} variant="secondary" className="text-xs">{b}</Badge>))}
                      </div>
                      <div>
                        <span className="font-heading font-bold text-3xl text-primary">{bundle.price}</span>
                        <p className="text-sm text-success font-medium">Save {bundle.savings}!</p>
                      </div>
                      <Button asChild variant="hero" size="lg" className="w-full">
                        <Link to="/fuel"><ShoppingCart className="w-5 h-5 mr-2" />Order Bundle</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Exotic Menu unlock */}
        <section className="py-12 bg-gradient-to-br from-purple-950 to-black text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7 text-purple-300" />
              </div>
              <h2 className="font-heading font-bold text-2xl">Exotic Blends — Members Only</h2>
              <p className="text-white/70 text-sm">Rare, limited-edition formulas for those in the know. Enter your passcode to unlock.</p>
              <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-900/50" onClick={() => setShowPasscode(true)}>
                Unlock Exotic Menu
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-heading font-bold text-2xl md:text-4xl">Need Help Choosing?</h2>
              <p className="font-body text-lg opacity-90 leading-relaxed">
                Let Dr. Vital AI recommend the perfect blend for your wellness goals.
              </p>
              <Button onClick={() => window.location.href = '/dr-vital'} variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90 border-white">
                Get Personalized Recommendations
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <PasscodeModal isOpen={showPasscode} onClose={() => setShowPasscode(false)} />
    </div>
  );
};

export default Menu;
