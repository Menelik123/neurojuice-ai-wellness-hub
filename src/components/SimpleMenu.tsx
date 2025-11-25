import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  name: string;
  ingredients: string;
  benefit: string;
  price: string;
  stripeLink?: string;
}

const products: Product[] = [
  {
    name: "Tropical Breeze",
    ingredients: "Pineapple, Lemon, Apple, Ginger",
    benefit: "Natural refreshment + clean energy",
    price: "$7.99",
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Green Vitality",
    ingredients: "Cucumber, Lime, Apple",
    benefit: "Crisp + hydrating",
    price: "$7.99",
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
  {
    name: "Ginger Shot",
    ingredients: "Ginger, Lemon, Apple",
    benefit: "Strong, warm, uplifting",
    price: "$7.99",
    stripeLink: "https://buy.stripe.com/00w8wOdvL0l07l6bUe1B600",
  },
];

const SimpleMenu = () => {
  return (
    <section id="menu" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">
            Our Menu
          </h2>
          <p className="text-muted-foreground text-lg">
            Fresh, simple, energizing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.name} className="border border-border shadow-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.ingredients}
                  </p>
                  <p className="text-sm text-foreground/80 italic">
                    {product.benefit}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="font-heading font-bold text-lg text-foreground">
                    {product.price}
                  </span>
                  <Button 
                    asChild
                    className="bg-primary hover:bg-primary-glow text-primary-foreground"
                  >
                    <a 
                      href={product.stripeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Order Now
                    </a>
                  </Button>
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
