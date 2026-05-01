import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Crown, Check, Droplets, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useStock } from "@/hooks/useStock";

interface Ingredient {
  name: string;
  benefit: string;
}

interface ProductDetail {
  slug: string;
  name: string;
  tagline: string;
  purpose: string;
  description: string;
  whyChoose: string[];
  ingredients: Ingredient[];
  howToUse: string;
  timing: string;
  image: string;
  regularPrice: string;
  memberPrice: string;
  stripeLink: string;
}

interface ProductDetailModalProps {
  product: ProductDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailModal = ({ product, open, onOpenChange }: ProductDetailModalProps) => {
  const { isInStock } = useStock();
  if (!product) return null;
  const inStock = isInStock(product.slug);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-64 object-cover rounded-t-lg ${!inStock ? "grayscale" : ""}`}
          />
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            {product.tagline}
          </Badge>
          {!inStock && (
            <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
              Sold Out
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader className="space-y-2">
            <p className="text-primary font-medium text-sm">{product.purpose}</p>
            <DialogTitle className="font-heading font-bold text-2xl">{product.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              {product.description}
            </DialogDescription>
          </DialogHeader>

          {/* Why Choose */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Why People Choose This Juice
            </h3>
            <ul className="space-y-1">
              {product.whyChoose.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary" />
              What's Inside
            </h3>
            <div className="space-y-2">
              {product.ingredients.map((ing, i) => (
                <div key={i}>
                  <p className="font-medium text-sm text-foreground">{ing.name}</p>
                  <p className="text-xs text-muted-foreground">{ing.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How to Use */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              How to Use
            </h3>
            <p className="text-sm text-muted-foreground">{product.howToUse}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Best timing:</strong> {product.timing}
            </p>
          </div>

          {/* Pricing & CTA */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-muted-foreground line-through">
                {product.regularPrice}
              </span>
              <span className="font-heading font-bold text-xl text-foreground">
                {product.memberPrice}
              </span>
              <Badge variant="outline" className="text-primary border-primary text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Vital Pass
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Add sea moss: +$1.00 | Sea moss shot: $1.00
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              {!inStock ? (
                <Button disabled className="flex-1 h-11" variant="outline">
                  Sold Out — Check Back Soon
                </Button>
              ) : product.stripeLink ? (
                <Button asChild className="flex-1 h-11">
                  <a href={product.stripeLink} target="_blank" rel="noopener noreferrer">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Buy Now — {product.regularPrice}
                  </a>
                </Button>
              ) : (
                <Button asChild className="flex-1 h-11" variant="outline">
                  <Link to="/fuel">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Order Now — {product.regularPrice}
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="flex-1 h-11">
                <Link to="/vitalpass">
                  <Crown className="w-4 h-4 mr-2" />
                  Join & Save
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            NeuroJuice products are not intended to diagnose, treat, cure, or prevent any disease.
            These statements have not been evaluated by the FDA.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
