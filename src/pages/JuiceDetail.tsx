import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Crown, Check, Clock, Droplets } from "lucide-react";
import StickyNav from "@/components/landing/StickyNav";
import LandingFooter from "@/components/landing/LandingFooter";

// Product data with full details
interface JuiceProduct {
  slug: string;
  name: string;
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
  isGingerShot?: boolean;
}

import tropicalBreeze from "@/assets/juice-tropical-breeze.png";
import lungDetox from "@/assets/juice-lung-detox.png";
import gingerShot from "@/assets/juice-ginger-shot-new.png";

const products: Record<string, JuiceProduct> = {
  "tropical-breeze": {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    purpose: "Refresh & Recharge",
    description: "A refreshing blend of tropical fruits designed to hydrate and energize your day.",
    whyChoose: [
      "Supports natural hydration throughout the day",
      "May help replenish electrolytes after activity",
      "Light and refreshing taste profile",
      "Perfect for morning or post-workout refreshment"
    ],
    ingredients: [
      { name: "Pineapple", benefit: "Traditionally used to support digestion and provide natural enzymes." },
      { name: "Lemon", benefit: "Rich in vitamin C, traditionally used to support immune function." },
      { name: "Apple", benefit: "Provides natural sweetness and antioxidants." },
      { name: "Ginger", benefit: "Traditionally used to support circulation and warming comfort." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning, post-workout, or whenever you need a refreshing boost.",
    image: tropicalBreeze,
    regularPrice: "$6",
    memberPrice: "$5",
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b"
  },
  "lung-detox": {
    slug: "lung-detox",
    name: "Lung Detox",
    purpose: "Respiratory Support",
    description: "A cleansing blend crafted to support respiratory wellness and clear breathing.",
    whyChoose: [
      "Formulated to support respiratory comfort",
      "Contains ingredients traditionally used for breathing support",
      "May help with seasonal wellness",
      "Gentle enough for daily use"
    ],
    ingredients: [
      { name: "Cucumber", benefit: "Hydrating and cooling, traditionally used for its soothing properties." },
      { name: "Apple", benefit: "Provides natural sweetness and antioxidants." },
      { name: "Pineapple", benefit: "Contains bromelain, traditionally used for respiratory support." },
      { name: "Ginger", benefit: "Traditionally used to support circulation and warming comfort." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning or evening. Especially helpful during seasonal changes.",
    image: lungDetox,
    regularPrice: "$6",
    memberPrice: "$5",
    stripeLink: "https://buy.stripe.com/9B6bJ00IZgjY0WI9M61B60a"
  },
  "ginger-shot": {
    slug: "ginger-shot",
    name: "Ginger Shot",
    purpose: "Immunity & Digestion",
    description: "A concentrated shot of ginger and lemon to kickstart your wellness routine.",
    whyChoose: [
      "Quick and concentrated wellness boost",
      "Supports digestive comfort",
      "May help with seasonal immunity",
      "Perfect as a daily wellness ritual"
    ],
    ingredients: [
      { name: "Ginger", benefit: "Traditionally used to support digestion, circulation, and immune response." },
      { name: "Lemon", benefit: "Rich in vitamin C, traditionally used to support immune function." },
      { name: "Apple", benefit: "Provides natural sweetness and balance." }
    ],
    howToUse: "Take as a shot. Can be followed with water if desired.",
    timing: "First thing in the morning on an empty stomach for best results.",
    image: gingerShot,
    regularPrice: "$4",
    memberPrice: "$3",
    stripeLink: "https://buy.stripe.com/7sY28q2R7d7M48U9M61B609",
    isGingerShot: true
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
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Product Image */}
            <div className="relative">
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10">
                AVAILABLE NOW
              </Badge>
              <img
                src={juice.image}
                alt={juice.name}
                className="w-full rounded-xl shadow-lg"
              />
            </div>

            {/* Right: Product Details */}
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

              {/* Why People Choose This */}
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

              {/* What's Inside */}
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

              {/* How to Use */}
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

              {/* Pricing */}
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
                        disabled
                        size="lg"
                        className="flex-1 bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Coming Soon
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

              {/* FDA Disclaimer */}
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
