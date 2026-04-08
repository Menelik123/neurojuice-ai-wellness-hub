import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  name: string;
  ingredients: string;
  benefit: string;
  price: string;
  stripeLink: string;
}

const products: Product[] = [
  { name: "Tropical Breeze", ingredients: "Pineapple, Apple, Lemon, Ginger", benefit: "Refresh & Recharge — energize and restore", price: "$8.50", stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b" },
  { name: "Beet Flow", ingredients: "Beet, Carrot, Lemon, Ginger", benefit: "Power Your Heart — cardiovascular health", price: "$8.50", stripeLink: "" },
  { name: "Green Vital", ingredients: "Celery, Green Apple, Spinach/Swiss Chard, Cucumber, Lemon, Ginger, Coconut Water", benefit: "Detox. Restore. Repeat.", price: "$8.50", stripeLink: "" },
  { name: "Mint Condition", ingredients: "Watermelon, Mint, Basil", benefit: "Perfectly Fresh — hydration and recovery", price: "$8.50", stripeLink: "" },
  { name: "Strawberry Horizon", ingredients: "Strawberry, Coconut Water, Lime", benefit: "Every Sip, A New Horizon", price: "$8.50", stripeLink: "" },
  { name: "Hibiscus Delight", ingredients: "Hibiscus, Coconut Water, Lemon or Strawberry", benefit: "Blossom — heart health and wellness", price: "$8.50", stripeLink: "" },
];

const SimpleMenu = () => {
  return (
    <section id="menu" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-black mb-4">Our Menu</h2>
          <p className="text-gray-600 text-lg">Fresh, functional, purposeful</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.name} className="border border-gray-200 shadow-sm hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-black mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.ingredients}</p>
                  <p className="text-sm text-gray-700 italic">{product.benefit}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-heading font-bold text-lg text-black">{product.price}</span>
                  {product.stripeLink ? (
                    <Button asChild className="bg-[#7FD645] hover:bg-[#6BC535] text-black font-semibold">
                      <a href={product.stripeLink} target="_blank" rel="noopener noreferrer">Order Now</a>
                    </Button>
                  ) : (
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      <a href="/fuel">Order Now</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleMenu;
