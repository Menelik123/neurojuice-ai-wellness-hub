import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import juice images
import tropicalBoost from "@/assets/juice-tropical-boost.jpg";
import pinkPower from "@/assets/juice-pink-power.jpg";
import greenVitality from "@/assets/juice-green-vitality.jpg";
import energyBlast from "@/assets/juice-energy-blast.jpg";
import brainBoost from "@/assets/juice-brain-boost.jpg";
import immuneShield from "@/assets/juice-immune-shield.jpg";

interface JuiceBlend {
  id: string;
  name: string;
  benefit: string;
  image: string;
  ingredients: string[];
  proportions: string;
  category: "energy" | "wellness" | "focus";
}

const juiceBlends: JuiceBlend[] = [
  {
    id: "tropical-boost",
    name: "Tropical Boost",
    benefit: "Natural energy & vitamin C power",
    image: tropicalBoost,
    ingredients: ["Fresh Pineapple", "Mango", "Coconut Water", "Lime", "Mint"],
    proportions: "40% Pineapple, 30% Mango, 20% Coconut Water, 10% Citrus & Herbs",
    category: "energy"
  },
  {
    id: "pink-power",
    name: "Pink Power",
    benefit: "Antioxidant boost & heart health",
    image: pinkPower,
    ingredients: ["Watermelon", "Strawberry", "Pomegranate", "Rose Water"],
    proportions: "50% Watermelon, 25% Strawberry, 20% Pomegranate, 5% Rose Water",
    category: "wellness"
  },
  {
    id: "green-vitality",
    name: "Green Vitality",
    benefit: "Detox & alkalizing minerals",
    image: greenVitality,
    ingredients: ["Cucumber", "Spinach", "Green Apple", "Lemon", "Ginger"],
    proportions: "35% Cucumber, 25% Apple, 20% Spinach, 15% Citrus, 5% Ginger",
    category: "wellness"
  },
  {
    id: "energy-blast",
    name: "Energy Blast",
    benefit: "Sustained energy & beta-carotene",
    image: energyBlast,
    ingredients: ["Carrot", "Orange", "Turmeric", "Ginger", "Cayenne"],
    proportions: "60% Carrot, 30% Orange, 8% Turmeric & Ginger, 2% Cayenne",
    category: "energy"
  },
  {
    id: "brain-boost",
    name: "Brain Boost",
    benefit: "Cognitive enhancement & memory",
    image: brainBoost,
    ingredients: ["Blueberry", "Grape", "Acai", "Walnut Extract", "Sage"],
    proportions: "40% Blueberry, 30% Grape, 20% Acai, 8% Walnut, 2% Sage",
    category: "focus"
  },
  {
    id: "immune-shield",
    name: "Immune Shield",
    benefit: "Immune system & vitamin powerhouse",
    image: immuneShield,
    ingredients: ["Orange", "Lemon", "Elderberry", "Zinc", "Echinacea"],
    proportions: "50% Orange, 25% Lemon, 15% Elderberry, 8% Zinc, 2% Echinacea",
    category: "wellness"
  }
];

const categoryColors = {
  energy: "bg-primary text-primary-foreground",
  wellness: "bg-accent text-accent-foreground", 
  focus: "bg-secondary text-secondary-foreground"
};

const JuiceMenu = () => {
  const openFullMenu = () => {
    // This would typically open a modal or navigate to a full menu page
    console.log("Opening full menu...");
  };

  return (
    <section id="menu" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
            Signature Juice Blends
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Each blend is carefully crafted with AI precision to target specific wellness goals with complete ingredient transparency.
          </p>
        </div>

        {/* Juice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {juiceBlends.map((blend) => (
            <Card 
              key={blend.id}
              className="overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-card hover:shadow-soft"
            >
              <CardContent className="p-0">
                {/* Juice Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={blend.image}
                    alt={blend.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <Badge className={`absolute top-4 right-4 ${categoryColors[blend.category]}`}>
                    {blend.category}
                  </Badge>
                </div>
                
                {/* Always Visible Content */}
                <div className="p-6 space-y-4">
                  {/* Blend Name */}
                  <h3 className="font-heading font-bold text-xl text-foreground">{blend.name}</h3>
                  
                  {/* Benefit */}
                  <p className="font-body text-sm text-muted-foreground">{blend.benefit}</p>
                  
                  {/* Ingredients and Proportions */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div>
                      <p className="font-body text-sm text-foreground">
                        <span className="font-semibold">Ingredients:</span> {blend.ingredients.join(", ")}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-body text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Proportions:</span> {blend.proportions}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Menu & Bundles Section */}
        <div className="mt-16 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              See the Full Menu & Bundles
            </h3>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of signature blends and convenient bundle options designed for your lifestyle.
            </p>
          </div>

          {/* Bundle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <Card className="overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center text-white">
                      <span className="font-heading font-bold text-lg">5</span>
                    </div>
                    <div className="font-heading font-bold text-xl text-foreground">5-Pack Weekly Bundle</div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="font-body text-muted-foreground">
                    One bottle per weekday, perfect for daily wellness
                  </p>
                  <Button variant="default" className="w-full">
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center text-white">
                      <span className="font-heading font-bold text-lg">3</span>
                    </div>
                    <div className="font-heading font-bold text-xl text-foreground">3-Pack Trio Bundle</div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="font-body text-muted-foreground">
                    Three signature blends, your midweek energy boost
                  </p>
                  <Button variant="default" className="w-full">
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Menu CTA */}
          <div className="text-center">
            <Button 
              variant="default" 
              size="lg"
              onClick={openFullMenu}
              className="animate-pulse hover:animate-none"
            >
              See Full Menu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JuiceMenu;