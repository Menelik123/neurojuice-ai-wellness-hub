import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

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
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const handleCardHover = (id: string) => {
    setFlippedCard(id);
  };

  const handleCardLeave = () => {
    setFlippedCard(null);
  };

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
            Each blend is carefully crafted with AI precision to target specific wellness goals. 
            Hover over any card to discover the magic behind the mix.
          </p>
        </div>

        {/* Juice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {juiceBlends.map((blend) => (
            <Card 
              key={blend.id}
              className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-card hover:shadow-soft"
              onMouseEnter={() => handleCardHover(blend.id)}
              onMouseLeave={handleCardLeave}
            >
              <CardContent className="p-0 relative h-80">
                {/* Front of card */}
                <div className={`absolute inset-0 transition-transform duration-500 ${
                  flippedCard === blend.id ? 'transform rotate-y-180' : ''
                }`}>
                  <img 
                    src={blend.image}
                    alt={blend.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <Badge className={`absolute top-4 right-4 ${categoryColors[blend.category]}`}>
                    {blend.category}
                  </Badge>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-heading font-bold text-xl mb-2">{blend.name}</h3>
                    <p className="font-body text-sm opacity-90">{blend.benefit}</p>
                  </div>
                </div>

                {/* Back of card */}
                <div className={`absolute inset-0 bg-background p-6 flex flex-col justify-center transition-transform duration-500 ${
                  flippedCard === blend.id ? '' : 'transform rotate-y-180'
                }`}>
                  <h3 className="font-heading font-bold text-lg mb-4 text-foreground">{blend.name}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-body font-semibold text-sm text-foreground mb-2">Ingredients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {blend.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-body font-semibold text-sm text-foreground mb-2">Proportions:</h4>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        {blend.proportions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
                    <Eye className="w-4 h-4 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
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
    </section>
  );
};

export default JuiceMenu;