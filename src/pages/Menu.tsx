import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, Gift } from "lucide-react";

import brainBoostImg from "@/assets/juice-brain-boost.jpg";
import energyBlastImg from "@/assets/juice-energy-blast.jpg";
import greenVitalityImg from "@/assets/juice-green-vitality.jpg";
import immuneShieldImg from "@/assets/juice-immune-shield.jpg";
import pinkPowerImg from "@/assets/juice-pink-power.jpg";
import tropicalBoostImg from "@/assets/juice-tropical-boost.jpg";

const Menu = () => {
  const juices = [
    {
      name: "Brain Boost",
      image: brainBoostImg,
      ingredients: "Blueberry (¾ cup), Grape (¾ cup)",
      description: "Cognitive enhancement with antioxidant-rich berries for memory and focus.",
      price: "$8.99",
      benefits: ["Focus", "Memory", "Antioxidants"]
    },
    {
      name: "Energy Blast", 
      image: energyBlastImg,
      ingredients: "Carrot (1 cup), Orange (¾ cup)",
      description: "Natural energy boost with vitamin A and C for sustained vitality.",
      price: "$7.99",
      benefits: ["Energy", "Vitamin C", "Natural"]
    },
    {
      name: "Green Vitality",
      image: greenVitalityImg, 
      ingredients: "Spinach (1 cup), Cucumber (1 cup), Green Apple (½ cup)",
      description: "Alkalizing detox blend that cleanses and energizes your system.",
      price: "$9.99",
      benefits: ["Detox", "Alkalizing", "Cleanse"]
    },
    {
      name: "Immune Shield",
      image: immuneShieldImg,
      ingredients: "Orange (1 cup), Lemon (½ cup), Elderberry (¼ cup)",
      description: "Vitamin C powerhouse with elderberry for immune system support.",
      price: "$8.49",
      benefits: ["Immunity", "Vitamin C", "Protection"]
    },
    {
      name: "Pink Power",
      image: pinkPowerImg,
      ingredients: "Watermelon (1 cup), Strawberry (¾ cup)",
      description: "Hydrating blend packed with lycopene and natural electrolytes.",
      price: "$7.49",
      benefits: ["Hydration", "Lycopene", "Recovery"]
    },
    {
      name: "Tropical Boost",
      image: tropicalBoostImg,
      ingredients: "Pineapple (¾ cup), Mango (¾ cup)",
      description: "Tropical paradise in a glass with digestive enzymes and vitamin C.",
      price: "$8.99",
      benefits: ["Digestive", "Tropical", "Enzymes"]
    }
  ];

  const bundles = [
    {
      name: "Wellness 5-Pack",
      description: "Mix and match any 5 juices for the ultimate wellness journey.",
      originalPrice: "$44.95",
      bundlePrice: "$37.99",
      savings: "$6.96",
      icon: <Users className="w-8 h-8" />,
      benefits: ["15% Savings", "Mix & Match", "Variety"]
    },
    {
      name: "Daily Boost 3-Pack", 
      description: "Perfect starter pack with our top 3 customer favorites.",
      originalPrice: "$26.97",
      bundlePrice: "$22.99",
      savings: "$3.98",
      icon: <Gift className="w-8 h-8" />,
      benefits: ["Best Sellers", "Great Value", "Starter Pack"]
    }
  ];

  const handleOrderNow = (item: string) => {
    window.location.href = `/order-options?item=${encodeURIComponent(item)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-background to-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="font-heading font-bold text-5xl text-foreground">
                Complete NeuroJuice Menu
              </h1>
              <p className="font-body text-xl text-muted-foreground leading-relaxed">
                Discover our full collection of brain-boosting, immunity-supporting, 
                and energy-enhancing juice blends crafted for optimal wellness.
              </p>
            </div>
          </div>
        </section>

        {/* Individual Juices */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl text-foreground mb-4">
                Individual Blends
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                Each blend is carefully crafted with specific ingredients to target 
                your wellness goals and taste preferences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {juices.map((juice, index) => (
                <Card key={index} className="group hover:shadow-soft transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={juice.image} 
                      alt={juice.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground font-bold">
                        {juice.price}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                          {juice.name}
                        </h3>
                        <p className="font-body text-sm text-muted-foreground mb-3">
                          <strong>Ingredients:</strong> {juice.ingredients}
                        </p>
                        <p className="font-body text-sm text-foreground leading-relaxed">
                          {juice.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {juice.benefits.map((benefit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => handleOrderNow(juice.name)}
                        variant="hero" 
                        className="w-full"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Order Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bundle Packs */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl text-foreground mb-4">
                Value Bundle Packs
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                Save money and experience variety with our specially curated bundle packages.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {bundles.map((bundle, index) => (
                <Card key={index} className="hover:shadow-soft transition-all duration-300 bg-gradient-to-br from-white to-secondary/30">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-6">
                      <div className="flex justify-center text-primary">
                        {bundle.icon}
                      </div>
                      
                      <div>
                        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                          {bundle.name}
                        </h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          {bundle.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        {bundle.benefits.map((benefit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-center items-center space-x-2">
                          <span className="text-lg line-through text-muted-foreground">
                            {bundle.originalPrice}
                          </span>
                          <span className="font-heading font-bold text-3xl text-primary">
                            {bundle.bundlePrice}
                          </span>
                        </div>
                        <p className="text-sm text-success font-medium">
                          Save {bundle.savings}!
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => handleOrderNow(bundle.name)}
                        variant="hero" 
                        size="lg"
                        className="w-full"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Order Bundle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-heading font-bold text-4xl">
                Need Help Choosing?
              </h2>
              <p className="font-body text-lg opacity-90 leading-relaxed">
                Let Dr. Vital AI analyze your wellness goals and recommend 
                the perfect personalized blend combination just for you.
              </p>
              <Button 
                onClick={() => window.location.href = '/dr-vital'}
                variant="outline"
                size="lg"
                className="bg-white text-primary hover:bg-white/90 border-white"
              >
                Get Personalized Recommendations
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;