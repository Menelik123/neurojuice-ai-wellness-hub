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
  {
    name: "Tropical Breeze",
    ingredients: "Pineapple, Lemon, Apple, Ginger",
    benefit: "Refreshing, naturally energizing",
    price: "$6.99",
    stripeLink: "https://buy.stripe.com/9B67sK1N33xcgVG6zU1B60b",
  },
  {
    name: "Lung Detox",
    ingredients: "Cucumber, Pineapple, Ginger, Apple",
    benefit: "Helps clear airways for easier breathing",
    price: "$6.99",
    stripeLink: "https://buy.stripe.com/9B6bJ00IZgjY0WI9M61B60a",
  },
  {
    name: "Ginger Shot",
    ingredients: "Ginger, Lemon, Apple",
    benefit: "Bold, warming wellness support",
    price: "$4.99",
    stripeLink: "https://buy.stripe.com/7sY28q2R7d7M48U9M61B609",
  },
];

const SimpleMenu = () => {
  return (
    <section id="menu" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-black mb-4">
            Our Menu
          </h2>
          <p className="text-gray-600 text-lg">
            Fresh, simple, energizing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.name} className="border border-gray-200 shadow-sm hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-black mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.ingredients}
                  </p>
                  <p className="text-sm text-gray-700 italic">
                    {product.benefit}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="font-heading font-bold text-lg text-black">
                    {product.price}
                  </span>
                  {product.stripeLink ? (
                    <Button 
                      asChild
                      className="bg-[#7FD645] hover:bg-[#6BC535] text-black font-semibold"
                    >
                      <a 
                        href={product.stripeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Order Now
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
                    >
                      Coming Soon
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
