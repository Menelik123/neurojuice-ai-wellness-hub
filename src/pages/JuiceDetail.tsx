import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Crown, Check, Clock, Droplets } from "lucide-react";
import StickyNav from "@/components/landing/StickyNav";
import LandingFooter from "@/components/landing/LandingFooter";

import tropicalBreeze from "@/assets/juice-tropical-breeze.png";
import beetFlow from "@/assets/product-beet-flow.png";
import strawberryHorizon from "@/assets/product-strawberry-horizon.png";
import mintCondition from "@/assets/product-mint-condition.png";
import greenVital from "@/assets/product-green-vital.png";

interface JuiceProduct {
  slug: string;
  name: string;
  tagline: string;
  purpose: string;
  description: string;
  whyChoose: string[];
  ingredients: { name: string; benefit: string }[];
  howToUse: string;
  timing: string;
  image: string;
  regularPrice: string;
  memberPrice: string;
  stripeLink: string;
}

const products: Record<string, JuiceProduct> = {
  "tropical-breeze": {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    tagline: "Refresh & Recharge",
    purpose: "Energy • Metabolism • Cleanse",
    description: "A bold tropical blend designed to energize and restore. Pineapple and apple deliver natural sweetness while ginger ignites your metabolism and lemon cleanses from within.",
    whyChoose: [
      "Boosts energy and metabolism naturally",
      "Supports natural cleansing and detox",
      "Refreshing tropical taste profile",
      "Perfect for morning or post-workout"
    ],
    ingredients: [
      { name: "Pineapple", benefit: "Natural enzymes support digestion and provide sustained energy." },
      { name: "Apple", benefit: "Natural sweetness with fiber and antioxidant support." },
      { name: "Lemon", benefit: "Rich in vitamin C, supports immune function and internal cleansing." },
      { name: "Ginger", benefit: "Ignites metabolism and supports circulation." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning, post-workout, or whenever you need a refreshing boost.",
    image: tropicalBreeze,
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b"
  },
  "beet-flow": {
    slug: "beet-flow",
    name: "Beet Flow",
    tagline: "Power Your Heart",
    purpose: "Circulation • Heart Health • Anti-Inflammatory",
    description: "A deep earthy blend built for cardiovascular health. Beets and carrots support blood pressure and circulation while ginger fights inflammation and lemon keeps it bright.",
    whyChoose: [
      "Supports healthy blood pressure and circulation",
      "Rich in heart-healthy nutrients",
      "Anti-inflammatory ginger for recovery",
      "Perfect for daily cardiovascular wellness"
    ],
    ingredients: [
      { name: "Beet", benefit: "Rich in nitrates that support blood flow and cardiovascular health." },
      { name: "Carrot", benefit: "Packed with beta-carotene and supports eye and heart health." },
      { name: "Lemon", benefit: "Vitamin C and brightness that aids nutrient absorption." },
      { name: "Ginger", benefit: "Powerful anti-inflammatory that supports circulation." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning or pre-workout for optimal circulation support.",
    image: beetFlow,
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    stripeLink: ""
  },
  "green-vital": {
    slug: "green-vital",
    name: "Green Vital",
    tagline: "Detox. Restore. Repeat.",
    purpose: "Detox • Gut Health • System Reset",
    description: "Our most powerful cleanse. Built to flush toxins, support gut health, and reset your system from the inside out. We rotate spinach and swiss chard so your body never stops responding.",
    whyChoose: [
      "Most powerful cleanse in our lineup",
      "Supports gut health and toxin elimination",
      "Rotating greens prevent adaptation",
      "Coconut water for natural electrolytes"
    ],
    ingredients: [
      { name: "Celery", benefit: "Natural diuretic that supports detoxification." },
      { name: "Green Apple", benefit: "Provides sweetness with digestive fiber." },
      { name: "Spinach/Swiss Chard", benefit: "Rotated for maximum nutrient absorption — iron, magnesium, and vitamins." },
      { name: "Cucumber", benefit: "Hydrating and cooling, supports kidney function." },
      { name: "Lemon", benefit: "Alkalizing and rich in vitamin C." },
      { name: "Ginger", benefit: "Supports digestion and reduces bloating." },
      { name: "Coconut Water", benefit: "Natural electrolytes for hydration." }
    ],
    howToUse: "Best enjoyed chilled on an empty stomach for maximum cleansing.",
    timing: "First thing in the morning or as a midday reset.",
    image: greenVital,
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    stripeLink: ""
  },
  "mint-condition": {
    slug: "mint-condition",
    name: "Mint Condition",
    tagline: "Perfectly Fresh",
    purpose: "Hydration • Recovery • Anti-Inflammatory",
    description: "A light hydration blend made for recovery. Watermelon replenishes electrolytes, mint cools and refreshes, and basil brings anti-inflammatory support.",
    whyChoose: [
      "Ultimate hydration and recovery blend",
      "Natural electrolyte replenishment",
      "Cooling mint for refreshment",
      "Anti-inflammatory basil support"
    ],
    ingredients: [
      { name: "Watermelon", benefit: "Rich in citrulline and natural electrolytes for hydration." },
      { name: "Mint", benefit: "Cooling and refreshing, supports digestion." },
      { name: "Basil", benefit: "Anti-inflammatory properties and adaptogenic support." }
    ],
    howToUse: "Best enjoyed chilled. Perfect over ice.",
    timing: "Post-workout, hot days, or whenever you need to rehydrate.",
    image: mintCondition,
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    stripeLink: ""
  },
  "strawberry-horizon": {
    slug: "strawberry-horizon",
    name: "Strawberry Horizon",
    tagline: "Every Sip, A New Horizon",
    purpose: "Hydration • Antioxidants • Electrolytes",
    description: "A clean, crisp hydration blend that hits different. Strawberry antioxidants, coconut water electrolytes, and lime brightness in every bottle.",
    whyChoose: [
      "Clean and crisp taste profile",
      "Loaded with strawberry antioxidants",
      "Coconut water electrolytes for hydration",
      "Lime brightness for a refreshing finish"
    ],
    ingredients: [
      { name: "Strawberry", benefit: "Rich in antioxidants, vitamin C, and manganese." },
      { name: "Coconut Water", benefit: "Natural electrolytes for hydration and recovery." },
      { name: "Lime", benefit: "Vitamin C and citric acid support digestion and brighten flavor." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Anytime — perfect as a daily hydration choice.",
    image: strawberryHorizon,
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    stripeLink: ""
  },
  "hibiscus-delight": {
    slug: "hibiscus-delight",
    name: "Hibiscus Delight",
    tagline: "Blossom",
    purpose: "Heart Health • Blood Pressure • Liver Support",
    description: "A floral wellness blend that works quietly and powerfully. Hibiscus supports heart health, lowers blood pressure, reduces cholesterol, and promotes liver health. Light, refreshing, and purposeful.",
    whyChoose: [
      "Supports heart health and lowers blood pressure",
      "Reduces cholesterol naturally",
      "Promotes liver health and detoxification",
      "Light and refreshing floral taste"
    ],
    ingredients: [
      { name: "Hibiscus", benefit: "Rich in antioxidants, supports cardiovascular health and blood pressure regulation." },
      { name: "Coconut Water", benefit: "Natural electrolytes for hydration." },
      { name: "Lemon or Strawberry", benefit: "Added brightness and vitamin C for immune support." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning or evening — a gentle daily wellness ritual.",
    image: tropicalBreeze,
    regularPrice: "$8.50",
    memberPrice: "$7.50",
    stripeLink: ""
  }
};

const JuiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [juice, setJuice] = useState<JuiceProduct | null>(null);

  useEffect(() => {
    if (slug && products[slug]) {
      setJuice(products[slug]);
      window.scrollTo(0, 0);
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  if (!juice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <StickyNav />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative">
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10">
                {juice.tagline}
              </Badge>
              <img
                src={juice.image}
                alt={juice.name}
                className="w-full rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium mb-2">{juice.purpose}</p>
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
                  {juice.name}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {juice.description}
                </p>
              </div>

              <Card className="border border-border">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    Why People Choose This Juice
                  </h2>
                  <ul className="space-y-2">
                    {juice.whyChoose.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    What's Inside
                  </h2>
                  <div className="space-y-3">
                    {juice.ingredients.map((ingredient, index) => (
                      <div key={index}>
                        <p className="font-medium text-foreground">{ingredient.name}</p>
                        <p className="text-sm text-muted-foreground">{ingredient.benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    How to Use
                  </h2>
                  <p className="text-muted-foreground mb-2">{juice.howToUse}</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Best timing:</strong> {juice.timing}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground line-through">
                        Regular: {juice.regularPrice}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-2xl text-foreground">
                          {juice.memberPrice}
                        </span>
                        <Badge variant="outline" className="text-primary border-primary">
                          <Crown className="w-3 h-3 mr-1" />
                          Vital Pass
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add sea moss: +$1.00 | Sea moss shot: $1.00
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {juice.stripeLink ? (
                      <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-[#7FD645] hover:bg-[#6BC535] text-black font-semibold"
                      >
                        <a href={juice.stripeLink} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order Now
                        </a>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="lg"
                        className="flex-1"
                      >
                        <Link to="/fuel">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order Now
                        </Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      <Link to="/vitalpass">
                        <Crown className="w-4 h-4 mr-2" />
                        Join & Save
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center">
                NeuroJuice products are not intended to diagnose, treat, cure, or prevent any disease. 
                These statements have not been evaluated by the Food and Drug Administration.
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default JuiceDetail;
