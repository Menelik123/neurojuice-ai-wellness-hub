import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import ProductDetailModal from "./ProductDetailModal";

import tropicalBreeze from "@/assets/product-tropical-breeze.png";
import beetFlow from "@/assets/product-beet-flow.png";
import gingerShot from "@/assets/product-ginger-shot.png";

interface Ingredient {
  name: string;
  benefit: string;
}

interface Product {
  slug: string;
  name: string;
  tagline: string;
  purpose: string;
  ingredients: string;
  description: string;
  image: string;
  stripeLink: string;
  whyChoose: string[];
  detailedIngredients: Ingredient[];
  howToUse: string;
  timing: string;
}

const products: Product[] = [
  {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    tagline: "Refresh & Recharge",
    purpose: "Energy • Metabolism • Cleanse",
    ingredients: "Pineapple, Apple, Lemon, Ginger",
    description: "A bold tropical blend designed to energize and restore. Pineapple and apple deliver natural sweetness while ginger ignites your metabolism and lemon cleanses from within.",
    image: tropicalBreeze,
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b",
    whyChoose: ["Boosts energy and metabolism naturally", "Supports natural cleansing and detox", "Refreshing tropical taste profile", "Perfect for morning or post-workout"],
    detailedIngredients: [
      { name: "Pineapple", benefit: "Natural enzymes support digestion and provide sustained energy." },
      { name: "Apple", benefit: "Natural sweetness with fiber and antioxidant support." },
      { name: "Lemon", benefit: "Rich in vitamin C, supports immune function and internal cleansing." },
      { name: "Ginger", benefit: "Ignites metabolism and supports circulation." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning, post-workout, or whenever you need a refreshing boost.",
  },
  {
    slug: "beet-flow",
    name: "Beet Flow",
    tagline: "Power Your Heart",
    purpose: "Circulation • Heart Health • Anti-Inflammatory",
    ingredients: "Beet, Carrot, Lemon, Ginger",
    description: "A deep earthy blend built for cardiovascular health. Beets and carrots support blood pressure and circulation while ginger fights inflammation and lemon keeps it bright.",
    image: beetFlow,
    stripeLink: "",
    whyChoose: ["Supports healthy blood pressure and circulation", "Rich in heart-healthy nutrients", "Anti-inflammatory ginger for recovery", "Perfect for daily cardiovascular wellness"],
    detailedIngredients: [
      { name: "Beet", benefit: "Rich in nitrates that support blood flow and cardiovascular health." },
      { name: "Carrot", benefit: "Packed with beta-carotene and supports eye and heart health." },
      { name: "Lemon", benefit: "Vitamin C and brightness that aids nutrient absorption." },
      { name: "Ginger", benefit: "Powerful anti-inflammatory that supports circulation." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning or pre-workout for optimal circulation support.",
  },
  {
    slug: "green-vital",
    name: "Green Vital",
    tagline: "Detox. Restore. Repeat.",
    purpose: "Detox • Gut Health • System Reset",
    ingredients: "Celery, Green Apple, Spinach/Swiss Chard, Cucumber, Lemon, Ginger, Coconut Water",
    description: "Our most powerful cleanse. Built to flush toxins, support gut health, and reset your system from the inside out.",
    image: tropicalBreeze,
    stripeLink: "",
    whyChoose: ["Most powerful cleanse in our lineup", "Supports gut health and toxin elimination", "Rotating greens prevent adaptation", "Coconut water for natural electrolytes"],
    detailedIngredients: [
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
  },
  {
    slug: "mint-condition",
    name: "Mint Condition",
    tagline: "Perfectly Fresh",
    purpose: "Hydration • Recovery • Anti-Inflammatory",
    ingredients: "Watermelon, Mint, Basil",
    description: "A light hydration blend made for recovery. Watermelon replenishes electrolytes, mint cools and refreshes, and basil brings anti-inflammatory support.",
    image: tropicalBreeze,
    stripeLink: "",
    whyChoose: ["Ultimate hydration and recovery blend", "Natural electrolyte replenishment", "Cooling mint for refreshment", "Anti-inflammatory basil support"],
    detailedIngredients: [
      { name: "Watermelon", benefit: "Rich in citrulline and natural electrolytes for hydration." },
      { name: "Mint", benefit: "Cooling and refreshing, supports digestion." },
      { name: "Basil", benefit: "Anti-inflammatory properties and adaptogenic support." }
    ],
    howToUse: "Best enjoyed chilled. Perfect over ice.",
    timing: "Post-workout, hot days, or whenever you need to rehydrate.",
  },
  {
    slug: "strawberry-horizon",
    name: "Strawberry Horizon",
    tagline: "Every Sip, A New Horizon",
    purpose: "Hydration • Antioxidants • Electrolytes",
    ingredients: "Strawberry, Coconut Water, Lime",
    description: "A clean, crisp hydration blend that hits different. Strawberry antioxidants, coconut water electrolytes, and lime brightness in every bottle.",
    image: tropicalBreeze,
    stripeLink: "",
    whyChoose: ["Clean and crisp taste profile", "Loaded with strawberry antioxidants", "Coconut water electrolytes for hydration", "Lime brightness for a refreshing finish"],
    detailedIngredients: [
      { name: "Strawberry", benefit: "Rich in antioxidants, vitamin C, and manganese." },
      { name: "Coconut Water", benefit: "Natural electrolytes for hydration and recovery." },
      { name: "Lime", benefit: "Vitamin C and citric acid support digestion and brighten flavor." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Anytime — perfect as a daily hydration choice.",
  },
  {
    slug: "hibiscus-delight",
    name: "Hibiscus Delight",
    tagline: "Blossom",
    purpose: "Heart Health • Blood Pressure • Liver Support",
    ingredients: "Hibiscus, Coconut Water, Lemon or Strawberry",
    description: "A floral wellness blend that works quietly and powerfully. Hibiscus supports heart health, lowers blood pressure, reduces cholesterol, and promotes liver health.",
    image: tropicalBreeze,
    stripeLink: "",
    whyChoose: ["Supports heart health and lowers blood pressure", "Reduces cholesterol naturally", "Promotes liver health and detoxification", "Light and refreshing floral taste"],
    detailedIngredients: [
      { name: "Hibiscus", benefit: "Rich in antioxidants, supports cardiovascular health and blood pressure regulation." },
      { name: "Coconut Water", benefit: "Natural electrolytes for hydration." },
      { name: "Lemon or Strawberry", benefit: "Added brightness and vitamin C for immune support." }
    ],
    howToUse: "Best enjoyed chilled. Shake well before drinking.",
    timing: "Morning or evening — a gentle daily wellness ritual.",
  },
];

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetail }: ProductCardProps) => {
  return (
    <Card
      className="overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 bg-card shadow-sm hover:shadow-lg group h-full flex flex-col cursor-pointer"
      onClick={() => onViewDetail(product)}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="aspect-[4/5] bg-muted/20 flex items-center justify-center overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
            loading="lazy"
          />
        </div>

        <div className="p-5 space-y-3 flex flex-col flex-1">
          <Badge className="bg-primary text-primary-foreground w-fit">
            {product.tagline}
          </Badge>

          <div>
            <h3 className="font-heading font-bold text-xl text-foreground">
              {product.name}
            </h3>
            <p className="text-sm text-primary font-medium mt-1">
              {product.purpose}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {product.ingredients}
          </p>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">$8.50</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-primary">$7.50 Member</span>
          </div>

          <div className="pt-3 space-y-2 mt-auto">
            {product.stripeLink ? (
              <Button
                className="w-full h-12"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.stripeLink, "_blank");
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Buy Now — $8.50
              </Button>
            ) : (
              <Button
                className="w-full h-12"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product);
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Order Now — $8.50
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MenuSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const modalProduct = selectedProduct
    ? {
        slug: selectedProduct.slug,
        name: selectedProduct.name,
        tagline: selectedProduct.tagline,
        purpose: selectedProduct.purpose,
        description: selectedProduct.description,
        whyChoose: selectedProduct.whyChoose,
        ingredients: selectedProduct.detailedIngredients,
        howToUse: selectedProduct.howToUse,
        timing: selectedProduct.timing,
        image: selectedProduct.image,
        regularPrice: "$8.50",
        memberPrice: "$7.50",
        stripeLink: selectedProduct.stripeLink,
      }
    : null;

  return (
    <section id="menu" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Our Menu
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fresh, functional juices crafted for performance
          </p>
        </div>

        <div className="bg-primary/10 text-primary text-center py-3 rounded-lg font-semibold text-sm mb-10">
          Order by 3PM → Delivered Today
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} onViewDetail={handleViewDetail} />
          ))}
        </div>

        {/* Sea Moss Shot Card */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-5 text-center space-y-3">
              <img
                src={gingerShot}
                alt="Sea Moss Shot"
                className="w-24 h-24 object-cover rounded-full mx-auto"
                loading="lazy"
              />
              <Badge className="bg-primary text-primary-foreground">Boost</Badge>
              <h3 className="font-heading font-bold text-lg text-foreground">Sea Moss Shot</h3>
              <p className="text-sm text-muted-foreground">
                Packed with 92+ minerals. Supports immunity, digestion, and energy. Add to any juice or take standalone.
              </p>
              <p className="font-bold text-foreground">$1.00</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/fuel">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order Now
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-5 text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-3xl">
                🌿
              </div>
              <Badge variant="outline" className="border-primary text-primary">Add-On</Badge>
              <h3 className="font-heading font-bold text-lg text-foreground">Sea Moss Add-On</h3>
              <p className="text-sm text-muted-foreground">
                Add sea moss to any bottle for just $1.00 more. 92+ minerals in every sip.
              </p>
              <p className="font-bold text-foreground">+$1.00 <span className="text-sm font-normal text-muted-foreground">($9.50/bottle)</span></p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProductDetailModal
        product={modalProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default MenuSection;
