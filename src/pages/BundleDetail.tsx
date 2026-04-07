import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Crown, Check, Package, MessageSquare, Home } from "lucide-react";
import StickyNav from "@/components/landing/StickyNav";
import LandingFooter from "@/components/landing/LandingFooter";
import SMSInlineCapture from "@/components/landing/SMSInlineCapture";

import bundleStarterReset from "@/assets/bundle-starter-reset.png";
import bundleHydrationFlow from "@/assets/bundle-hydration-flow.png";
import bundleLungSupport from "@/assets/bundle-lung-support.png";
import bundleVariety from "@/assets/bundle-variety.png";

interface BundleProduct {
  slug: string;
  name: string;
  shortDescription: string;
  whoIsItFor: string;
  whyChoose: string[];
  includes: { name: string; quantity: number; benefit: string }[];
  bottleCount: number;
  regularPrice: string;
  vitalPassPrice?: string;
  savings: string;
  image: string;
  stripeLink: string;
  isVitalPassExclusive?: boolean;
}

const bundles: Record<string, BundleProduct> = {
  "starter-reset-pack": {
    slug: "starter-reset-pack",
    name: "Starter Reset Pack",
    shortDescription: "Perfect for first-timers looking to reset their routine",
    whoIsItFor: "Ideal for those new to juicing or looking to kickstart a wellness routine with a curated selection of our most popular blends.",
    whyChoose: [
      "Great introduction to our best-selling juices",
      "Balanced variety for hydration and respiratory support",
      "Save compared to buying individual bottles",
      "Perfect for a 2-3 day wellness reset"
    ],
    includes: [
      { name: "Lung Detox", quantity: 1, benefit: "Supports respiratory comfort" },
      { name: "Tropical Breeze", quantity: 2, benefit: "Refreshing hydration" },
      { name: "Ginger Shot", quantity: 1, benefit: "Immunity and digestion boost" }
    ],
    bottleCount: 4,
    regularPrice: "$27.96",
    vitalPassPrice: "$23.99",
    savings: "Save $5",
    image: bundleStarterReset,
    stripeLink: "" // Empty - to be added manually after publish
  },
  "lung-support-pack": {
    slug: "lung-support-pack",
    name: "Lung Support Pack",
    shortDescription: "Breathe easier with our respiratory-focused blends",
    whoIsItFor: "Designed for those seeking respiratory wellness support, especially during seasonal changes or for daily breathing comfort.",
    whyChoose: [
      "Focused on respiratory wellness ingredients",
      "Extra Lung Detox bottles for consistent support",
      "Balanced with hydrating Tropical Breeze",
      "Ginger shot for additional immune support"
    ],
    includes: [
      { name: "Lung Detox", quantity: 2, benefit: "Supports respiratory comfort" },
      { name: "Tropical Breeze", quantity: 2, benefit: "Refreshing hydration" },
      { name: "Ginger Shot", quantity: 1, benefit: "Immunity and digestion boost" }
    ],
    bottleCount: 5,
    regularPrice: "$37.95",
    vitalPassPrice: "$29.99",
    savings: "Save $8",
    image: bundleLungSupport,
    stripeLink: "" // Empty - to be added manually after publish
  },
  "hydration-flow-pack": {
    slug: "hydration-flow-pack",
    name: "Hydration Flow Pack",
    shortDescription: "Stay refreshed and energized all day",
    whoIsItFor: "Perfect for active individuals, busy professionals, or anyone prioritizing daily hydration and energy.",
    whyChoose: [
      "Maximum hydration with tropical fruits",
      "Great for post-workout recovery",
      "Balanced with respiratory support",
      "Ginger shot for an extra wellness boost"
    ],
    includes: [
      { name: "Tropical Breeze", quantity: 3, benefit: "Refreshing hydration" },
      { name: "Lung Detox", quantity: 2, benefit: "Supports respiratory comfort" },
      { name: "Ginger Shot", quantity: 1, benefit: "Immunity and digestion boost" }
    ],
    bottleCount: 6,
    regularPrice: "$45.94",
    vitalPassPrice: "$35.99",
    savings: "Save $10",
    image: bundleHydrationFlow,
    stripeLink: "" // Empty - to be added manually after publish
  },
  "vital-pass-exclusive-pack": {
    slug: "vital-pass-exclusive-pack",
    name: "Vital Pass Exclusive Pack",
    shortDescription: "Members-only bundle with our best sellers",
    whoIsItFor: "Exclusive for Vital Pass members who want the best value on our complete juice lineup.",
    whyChoose: [
      "Best value bundle — members only",
      "Equal portions of all three juices",
      "Perfect for weekly wellness routine",
      "Maximum savings at member pricing"
    ],
    includes: [
      { name: "Tropical Breeze", quantity: 2, benefit: "Refreshing hydration" },
      { name: "Lung Detox", quantity: 2, benefit: "Supports respiratory comfort" },
      { name: "Ginger Shot", quantity: 2, benefit: "Immunity and digestion boost" }
    ],
    bottleCount: 6,
    regularPrice: "$44.94",
    vitalPassPrice: "$29.99",
    savings: "Save $15",
    image: bundleVariety,
    stripeLink: "", // Empty - to be added manually after publish
    isVitalPassExclusive: true
  }
};

const BundleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<BundleProduct | null>(null);

  useEffect(() => {
    if (slug && bundles[slug]) {
      setBundle(bundles[slug]);
      window.scrollTo(0, 0);
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  if (!bundle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <StickyNav />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Navigation */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bundles
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Bundle Image */}
            <div className="relative">
              {bundle.isVitalPassExclusive && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium z-10 flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Vital Pass Exclusive
                </div>
              )}
              <img
                src={bundle.image}
                alt={bundle.name}
                className="w-full rounded-xl shadow-lg"
              />
            </div>

            {/* Right: Bundle Details */}
            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium mb-2">{bundle.bottleCount} Bottles</p>
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
                  {bundle.name}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {bundle.whoIsItFor}
                </p>
              </div>

              {/* What's Inside */}
              <Card className="border border-border">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    What's Inside
                  </h2>
                  <div className="space-y-3">
                    {bundle.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          {item.quantity}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Why People Choose This Bundle */}
              <Card className="border border-border">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    Why People Choose This Bundle
                  </h2>
                  <ul className="space-y-2">
                    {bundle.whyChoose.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="border-2 border-primary bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground line-through">
                        Regular: {bundle.regularPrice}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-bold text-3xl text-foreground">
                          {bundle.vitalPassPrice || bundle.regularPrice}
                        </span>
                        <span className="bg-primary/20 text-primary text-sm font-medium px-2 py-1 rounded">
                          {bundle.savings}
                        </span>
                      </div>
                      {bundle.vitalPassPrice && (
                        <p className="text-sm text-primary mt-1 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Vital Pass Price
                        </p>
                      )}
                    </div>
                  </div>

                  {bundle.stripeLink ? (
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-[#7FD645] hover:bg-[#6BC535] text-black font-semibold rounded-lg"
                    >
                      <a href={bundle.stripeLink} target="_blank" rel="noopener noreferrer">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Order Now
                      </a>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      size="lg"
                      className="w-full bg-gray-300 text-gray-500 font-semibold cursor-not-allowed rounded-lg"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* SMS Capture */}
              <SMSInlineCapture message="Get text alerts when this bundle is back in stock" />

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

export default BundleDetail;
