import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { getJuiceBySlug, type Juice } from "@/data/juices";
import { formatPrice } from "@/lib/pricing";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Declare gtag for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const OrderPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [juice, setJuice] = useState<Juice | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  useEffect(() => {
    if (!slug) {
      navigate("/menu");
      return;
    }

    const foundJuice = getJuiceBySlug(slug);
    if (!foundJuice) {
      navigate("/menu");
      return;
    }

    setJuice(foundJuice);

    // Set SEO title
    document.title = `${foundJuice.name} – Order | NeuroJuice`;
    
    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `${window.location.origin}/order/${slug}`);
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }

    // Analytics: view_item event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: foundJuice.price,
        items: [{
          item_id: foundJuice.slug,
          item_name: foundJuice.name,
          price: foundJuice.price,
          quantity: 1
        }]
      });
    }
  }, [slug, navigate]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleCheckout = () => {
    if (!juice) return;

    // Analytics: begin_checkout event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: juice.price * quantity,
        items: [{
          item_id: juice.slug,
          item_name: juice.name,
          price: juice.price,
          quantity: quantity
        }]
      });
    }

    // Show loading toast
    toast({
      title: "Opening secure checkout...",
      description: "Redirecting to payment page",
    });

    // Build Shopify URL with UTM tracking
    const utmParams = `?utm_source=5dayguide&utm_medium=qr&utm_campaign=${juice.slug}`;
    
    let checkoutUrl: string;
    if (juice.variantId !== "REPLACE_ME") {
      // Use variant URL if available
      checkoutUrl = `https://YOURSTORE.myshopify.com/cart/${juice.variantId}:${quantity}${utmParams}`;
    } else {
      // Fallback to product page
      checkoutUrl = `https://YOURSTORE.myshopify.com/products/${juice.shopifyHandle}?quantity=${quantity}${utmParams.replace('?', '&')}`;
    }

    // Open in same window for better mobile experience
    window.location.href = checkoutUrl;
  };

  const handleBackToMenu = () => {
    navigate("/menu");
  };

  if (!juice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Back to Menu */}
        <Button 
          variant="outline" 
          onClick={handleBackToMenu}
          className="mb-8 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Button>

        {/* Page Title */}
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8">
          Review your order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Product Details (Sticky on Desktop) */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Card className="overflow-hidden shadow-card">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    src={juice.img}
                    alt={juice.name}
                    loading="eager"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Show branded placeholder if image fails to load
                      const placeholder = document.createElement('div');
                      placeholder.className = "w-full h-full bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center text-muted-foreground";
                      placeholder.innerHTML = "Image coming soon";
                      e.currentTarget.parentNode?.replaceChild(placeholder, e.currentTarget);
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="font-heading font-bold text-2xl text-foreground">
                      {juice.name}
                    </h2>
                    <Badge className="bg-primary text-primary-foreground font-bold text-lg">
                      {formatPrice(juice.price)}
                    </Badge>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-2">
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      Ingredients
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {juice.ingredients.join(", ")}
                    </p>
                  </div>

                  {/* Why it works */}
                  <div className="space-y-2">
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      Why it works
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {juice.benefit}
                    </p>
                  </div>

                  {/* Disclaimer */}
                  <p className="font-body text-xs text-muted-foreground border-t border-border pt-4">
                    Wellness support only. Not medical advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Order Options */}
          <div className="space-y-6">
            {/* Quantity Selector */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-heading font-bold text-xl text-foreground min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Delivery Method
                </h3>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer font-body">
                      <div className="font-semibold">Deliver to Your Door</div>
                      <div className="text-sm text-muted-foreground">Fast local delivery</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer font-body">
                      <div className="font-semibold">Pick Up at Pop-Up Shop</div>
                      <div className="text-sm text-muted-foreground">Save on delivery fees</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary & Checkout */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-foreground">Subtotal ({quantity}x)</span>
                  <span className="font-heading font-bold text-foreground">
                    {formatPrice(juice.price * quantity)}
                  </span>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Continue to Checkout
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleBackToMenu}
                >
                  Back to Menu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderPage;