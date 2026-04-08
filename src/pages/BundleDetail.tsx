import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Check, Package, Home } from "lucide-react";
import StickyNav from "@/components/landing/StickyNav";
import LandingFooter from "@/components/landing/LandingFooter";
import SMSInlineCapture from "@/components/landing/SMSInlineCapture";
import { Link } from "react-router-dom";

import bundleStarterReset from "@/assets/bundle-starter-reset.png";
import bundleHydrationFlow from "@/assets/bundle-hydration-flow.png";
import bundleLungSupport from "@/assets/bundle-lung-support.png";

interface BundleProduct {
  slug: string;
  name: string;
  shortDescription: string;
  whoIsItFor: string;
  whyChoose: string[];
  bottleCount: number;
  price: string;
  perBottle: string;
  savings: string;
  image: string;
}

const bundles: Record<string, BundleProduct> = {
  "starter-stack": {
    slug: "starter-stack",
    name: "Starter Stack",
    shortDescription: "Perfect for first-timers — try your favorites",
    whoIsItFor: "Ideal for those new to juicing or looking to kickstart a wellness routine. Pick any 3 from our 6 juices.",
    whyChoose: [
      "Great introduction to our juice lineup",
      "Choose any 3 from all 6 flavors",
      "Save compared to buying individual bottles",
      "Perfect for a quick wellness reset"
    ],
    bottleCount: 3,
    price: "$23.00",
    perBottle: "$7.67/bottle",
    savings: "Save $2.50",
    image: bundleStarterReset,
  },
  "performance-pack": {
    slug: "performance-pack",
    name: "Performance Pack",
    shortDescription: "Your weekly performance routine",
    whoIsItFor: "For those committed to daily wellness. Choose any 5 juices from our full lineup.",
    whyChoose: [
      "Best value for consistent wellness",
      "Choose any 5 from all 6 flavors",
      "Perfect for a weekly routine",
      "Save $4.50 vs buying singles"
    ],
    bottleCount: 5,
    price: "$38.00",
    perBottle: "$7.60/bottle",
    savings: "Save $4.50",
    image: bundleLungSupport,
  },
  "weekly-neurostack": {
    slug: "weekly-neurostack",
    name: "Weekly NeuroStack",
    shortDescription: "Maximum commitment, maximum savings",
    whoIsItFor: "For the fully committed. 10 bottles of your choice — the ultimate weekly wellness stack.",
    whyChoose: [
      "Maximum savings — $7.00/bottle",
      "Choose any 10 from all 6 flavors",
      "Full week of wellness covered",
      "Save $15 vs buying singles"
    ],
    bottleCount: 10,
    price: "$70.00",
    perBottle: "$7.00/bottle",
    savings: "Save $15.00",
    image: bundleHydrationFlow,
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

  if (!bundle) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <StickyNav />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />Home
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative">
              <img src={bundle.image} alt={bundle.name} className="w-full rounded-xl shadow-lg" />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium mb-2">{bundle.bottleCount} Bottles — You Choose</p>
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">{bundle.name}</h1>
                <p className="text-muted-foreground text-lg">{bundle.whoIsItFor}</p>
              </div>

              <Card className="border border-border">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />Available Juices
                  </h2>
                  <div className="space-y-2">
                    {["Tropical Breeze", "Beet Flow", "Green Vital", "Mint Condition", "Strawberry Horizon", "Hibiscus Delight"].map((name) => (
                      <div key={name} className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-primary">•</span>{name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />Why This Bundle
                  </h2>
                  <ul className="space-y-2">
                    {bundle.whyChoose.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>{reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary bg-primary/5">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground line-through">
                      Regular: ${(bundle.bottleCount * 8.5).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-bold text-3xl text-foreground">{bundle.price}</span>
                      <span className="bg-primary/20 text-primary text-sm font-medium px-2 py-1 rounded">{bundle.savings}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{bundle.perBottle}</p>
                  </div>
                  <Button asChild size="lg" className="w-full bg-[#7FD645] hover:bg-[#6BC535] text-black font-semibold rounded-lg">
                    <Link to="/fuel">
                      <ShoppingCart className="w-4 h-4 mr-2" />Order Now — Choose Your Juices
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <SMSInlineCapture message="Get text alerts for new drops and restocks" />

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
