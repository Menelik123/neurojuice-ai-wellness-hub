import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import SMSInlineCapture from "./SMSInlineCapture";

import tropicalBreeze from "@/assets/juice-tropical-breeze.png";
import lungDetox from "@/assets/juice-lung-detox.png";
import gingerShot from "@/assets/juice-ginger-shot-new.png";

interface Product {
  slug: string;
  name: string;
  purpose: string;
  ingredients: string;
  regularPrice: string;
  memberPrice: string;
  image: string;
  isGingerShot?: boolean;
}

const products: Product[] = [
  {
    slug: "tropical-breeze",
    name: "Tropical Breeze",
    purpose: "Refresh & Recharge",
    ingredients: "Pineapple, Watermelon",
    regularPrice: "$6.99",
    memberPrice: "$5.00",
    image: tropicalBreeze,
  },
  {
    slug: "lung-detox",
    name: "Lung Detox",
    purpose: "Respiratory Support",
    ingredients: "Cucumber, Apple, Pineapple, Ginger",
    regularPrice: "$6.99",
    memberPrice: "$5.00",
    image: lungDetox,
  },
  {
    slug: "ginger-shot",
    name: "Ginger Shot",
    purpose: "Immunity & Digestion",
    ingredients: "Ginger, Lemon",
    regularPrice: "$4.99",
    memberPrice: "$3.00",
    image: gingerShot,
    isGingerShot: true,
  },
];

const AvailableNow = () => {
  return (
    <section id="available-now" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-4">
            Available Now — Ready to Go
          </h2>
          <p className="text-muted-foreground">
            Fresh batches ready for pickup or delivery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link 
              to={`/juice/${product.slug}`} 
              key={product.slug}
              className="block group"
            >
              <Card className="border border-border shadow-card hover:shadow-lg transition-all overflow-hidden group-hover:border-primary/50 h-full">
                <div className="relative">
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
                    AVAILABLE NOW
                  </Badge>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {product.purpose}
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {product.ingredients}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground line-through">
                      {product.regularPrice}
                    </span>
                    <span className="font-heading font-bold text-lg text-foreground">
                      {product.memberPrice}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Vital Pass
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary-glow text-primary-foreground group-hover:bg-primary-glow"
                  >
                    View Juice Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* SMS Capture Point */}
        <div className="mt-12 max-w-xl mx-auto">
          <SMSInlineCapture message="Don't see your flavor? Get text alerts for restocks." />
        </div>
      </div>
    </section>
  );
};

export default AvailableNow;
