import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingCart, Flame, Star, Zap, Droplets, Heart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import BundleBuilderModal from "./BundleBuilderModal";
import { useBundles } from "@/hooks/useBundles";

interface BundleOption {
  name: string;
  bottles: number;
  price: number;
  priceDisplay: string;
  perBottle: string;
  savings: string;
  badge?: string;
  badgeIcon?: typeof Flame;
}

interface CuratedBundle {
  name: string;
  bottles: number;
  price: number;
  drinks: string[];
  tagline: string;
  icon: typeof Zap;
  badge?: string;
  openBuilder?: boolean;
}

const bundles: BundleOption[] = [
  {
    name: "Starter Stack",
    bottles: 3,
    price: 23,
    priceDisplay: "$23",
    perBottle: "$7.67/bottle",
    savings: "Save $2.50",
    badge: "Most Popular",
    badgeIcon: Star,
  },
  {
    name: "Performance Pack",
    bottles: 5,
    price: 38,
    priceDisplay: "$38",
    perBottle: "$7.60/bottle",
    savings: "Save $4.50",
    badge: "Best Value",
    badgeIcon: Flame,
  },
  {
    name: "Weekly NeuroStack",
    bottles: 10,
    price: 70,
    priceDisplay: "$70",
    perBottle: "$7.00/bottle",
    savings: "Save $15.00",
  },
];

const curatedBundles: CuratedBundle[] = [
  {
    name: "The Energizer Stack",
    bottles: 3,
    price: 23,
    drinks: ["Tropical Breeze", "Beet Flow", "Green Vital"],
    tagline: "All gas, no brakes. Energy, circulation, and a full system reset.",
    icon: Zap,
    badge: "Fan Favorite",
  },
  {
    name: "The Hydration Pack",
    bottles: 3,
    price: 23,
    drinks: ["Strawberry Horizon", "Mint Condition", "Tropical Breeze"],
    tagline: "Stay fluid, stay fresh. Built for recovery and hydration.",
    icon: Droplets,
  },
  {
    name: "The Wellness Reset",
    bottles: 5,
    price: 38,
    drinks: ["Green Vital", "Beet Flow", "Mint Condition", "Hibiscus Delight", "Tropical Breeze"],
    tagline: "Every system covered. Detox, heart, hydration — one full week.",
    icon: Heart,
    badge: "Best Value",
  },
  {
    name: "The Full Week Stack",
    bottles: 10,
    price: 70,
    drinks: [],
    tagline: "Your weekly supply, locked in.",
    icon: Flame,
    openBuilder: true,
  },
];

const iconMap: Record<string, typeof Zap> = {
  "energizer-stack": Zap,
  "hydration-pack": Droplets,
  "wellness-reset": Heart,
  "full-week-stack": Flame,
};

const BundleShowcase = () => {
  const { addItem } = useCart();
  const [selectedBundle, setSelectedBundle] = useState<BundleOption | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [seaMossChecked, setSeaMossChecked] = useState<Record<string, boolean>>({});
  const { data: dbBundles } = useBundles();

  const customBundles: BundleOption[] = dbBundles
    ? dbBundles.filter((b) => !b.is_curated).map((b) => ({
        name: b.name,
        bottles: b.bottles,
        price: b.price,
        priceDisplay: `$${b.price}`,
        perBottle: `$${(b.price / b.bottles).toFixed(2)}/bottle`,
        savings: `Save $${(b.bottles * 8.5 - b.price).toFixed(2)}`,
        badge: b.badge || undefined,
        badgeIcon: b.badge === "Most Popular" ? Star : b.badge === "Best Value" ? Flame : undefined,
      }))
    : bundles;

  const curatedList = dbBundles
    ? dbBundles.filter((b) => b.is_curated).map((b) => ({
        name: b.name,
        bottles: b.bottles,
        price: b.price,
        drinks: b.drinks,
        tagline: b.tagline,
        icon: iconMap[b.slug] || Zap,
        badge: b.badge || undefined,
        openBuilder: b.drinks.length === 0,
      }))
    : curatedBundles;

  const handleOrderBundle = (bundle: BundleOption) => {
    setSelectedBundle(bundle);
    setModalOpen(true);
  };

  const handleAddCurated = (curated: typeof curatedList[0]) => {
    if (curated.openBuilder) {
      setSelectedBundle({
        name: curated.name,
        bottles: curated.bottles,
        price: curated.price,
        priceDisplay: `$${curated.price}`,
        perBottle: `$${(curated.price / curated.bottles).toFixed(2)}/bottle`,
        savings: "",
      });
      setModalOpen(true);
      return;
    }

    const addSeaMoss = seaMossChecked[curated.name] || false;
    const seaMossCount = addSeaMoss ? curated.bottles : 0;

    addItem({
      id: `curated-${curated.name}`,
      slug: `bundle-${curated.bottles}`,
      name: `${curated.name} (${curated.bottles} bottles)`,
      type: "bundle",
      quantity: 1,
      unitPrice: curated.price,
      addSeaMoss: false,
      bundleBottles: curated.bottles,
      selectedDrinks: curated.drinks,
      seaMossCount,
    });

    toast.success(`${curated.name} added to cart!`);
  };

  const getCuratedTotal = (curated: CuratedBundle) => {
    const addSeaMoss = seaMossChecked[curated.name] || false;
    return curated.price + (addSeaMoss ? curated.bottles * 1 : 0);
  };

  return (
    <section id="bundles" className="py-16 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Build Your Stack
          </h2>
          <p className="text-muted-foreground text-lg">
            The more you stack, the more you save.
          </p>
        </div>

        <Tabs defaultValue="curated" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="curated" className="font-semibold">Curated Stacks</TabsTrigger>
            <TabsTrigger value="custom" className="font-semibold">Build Your Own</TabsTrigger>
          </TabsList>

          <TabsContent value="curated">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curatedList.map((curated) => (
                <Card
                  key={curated.name}
                  className={`border overflow-hidden transition-all duration-300 hover:shadow-lg relative ${
                    curated.badge === "Best Value"
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {curated.badge && (
                    <div className="absolute top-0 left-0 right-0">
                      <Badge className="w-full rounded-none rounded-t-lg justify-center py-1.5 bg-primary text-primary-foreground font-semibold text-sm">
                        <curated.icon className="w-3.5 h-3.5 mr-1.5" />
                        {curated.badge}
                      </Badge>
                    </div>
                  )}
                  <CardContent className={`p-6 space-y-4 ${curated.badge ? "pt-12" : "pt-6"}`}>
                    <div className="flex items-center gap-2">
                      <curated.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-heading font-bold text-xl text-foreground">
                        {curated.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {curated.tagline}
                    </p>
                    {curated.drinks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {curated.drinks.map((drink) => (
                          <Badge key={drink} variant="outline" className="text-xs font-normal">
                            {drink}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-bold text-3xl text-foreground">
                        ${getCuratedTotal(curated).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {curated.bottles} bottles
                      </span>
                    </div>

                    {!curated.openBuilder && (
                      <div className="flex items-start gap-2 pt-1">
                        <Checkbox
                          id={`seamoss-${curated.name}`}
                          checked={seaMossChecked[curated.name] || false}
                          onCheckedChange={(checked) =>
                            setSeaMossChecked((prev) => ({ ...prev, [curated.name]: !!checked }))
                          }
                        />
                        <label htmlFor={`seamoss-${curated.name}`} className="text-xs text-muted-foreground leading-tight cursor-pointer">
                          + Add Sea Moss Shots to each bottle — +$1.00 per shot 🌿
                        </label>
                      </div>
                    )}

                    <Button
                      className="w-full h-12 font-semibold"
                      onClick={() => handleAddCurated(curated)}
                    >
                      {curated.openBuilder ? (
                        <>Build My Week <ArrowRight className="w-4 h-4 ml-2" /></>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart — ${getCuratedTotal(curated).toFixed(2)}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {customBundles.map((bundle) => (
                <Card
                  key={bundle.name}
                  className={`border overflow-hidden transition-all duration-300 hover:shadow-lg relative ${
                    bundle.badge === "Best Value"
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {bundle.badge && (
                    <div className="absolute top-0 left-0 right-0">
                      <Badge className="w-full rounded-none rounded-t-lg justify-center py-1.5 bg-primary text-primary-foreground font-semibold text-sm">
                        {bundle.badgeIcon && <bundle.badgeIcon className="w-3.5 h-3.5 mr-1.5" />}
                        {bundle.badge}
                      </Badge>
                    </div>
                  )}
                  <CardContent className={`p-6 text-center space-y-4 ${bundle.badge ? "pt-12" : "pt-6"}`}>
                    <h3 className="font-heading font-bold text-xl text-foreground">
                      {bundle.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {bundle.bottles} bottles — you choose
                    </p>
                    <div className="space-y-1">
                      <p className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                        {bundle.priceDisplay}
                      </p>
                      <p className="text-sm text-muted-foreground">{bundle.perBottle}</p>
                      <p className="text-sm font-semibold text-primary">{bundle.savings}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      vs. ${(bundle.bottles * 8.5).toFixed(2)} buying singles
                    </p>
                    <Button className="w-full h-12 font-semibold" onClick={() => handleOrderBundle(bundle)}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Build Your Bundle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BundleBuilderModal
        bundle={selectedBundle ? { name: selectedBundle.name, bottles: selectedBundle.bottles, price: selectedBundle.price } : null}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default BundleShowcase;
