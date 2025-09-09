import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STANDARD_JUICE_PRICE } from "@/lib/pricing";
import { juices } from "@/data/juices";

// Import juice images (fallbacks)
import tropicalBoost from "@/assets/juice-tropical-boost.jpg";
import pinkPower from "@/assets/juice-pink-power.jpg";
import greenVitality from "@/assets/juice-green-vitality.jpg";
import energyBlast from "@/assets/juice-energy-blast.jpg";
import brainBoost from "@/assets/juice-brain-boost.jpg";
import immuneShield from "@/assets/juice-immune-shield.jpg";

// Mapping for fallback images
const imageMap: Record<string, string> = {
  "weight-loss-juice": greenVitality,
  "hydration-juice": pinkPower,
  "lung-detox": greenVitality,
  "glowing-skin-juice": energyBlast,
  "cold-flu-juice": immuneShield,
  "beet-cleanse": energyBlast,
  "natural-vigara": greenVitality,
  "sunshine-juice": tropicalBoost,
};

const categoryColors = {
  energy: "bg-primary text-primary-foreground",
  wellness: "bg-accent text-accent-foreground", 
  focus: "bg-secondary text-secondary-foreground"
};

const getCategoryFromSlug = (slug: string): "energy" | "wellness" | "focus" => {
  if (slug === "natural-vigara" || slug === "sunshine-juice") return "energy";
  return "wellness";
};

const JuiceMenu = () => {
  const openFullMenu = () => {
    window.location.href = "/menu";
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
          {juices.map((juice) => (
            <Card 
              key={juice.slug}
              className="overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-card hover:shadow-soft"
            >
              <CardContent className="p-0">
                {/* Juice Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={imageMap[juice.slug]}
                    alt={juice.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <Badge className={`absolute top-4 right-4 ${categoryColors[getCategoryFromSlug(juice.slug)]}`}>
                    {getCategoryFromSlug(juice.slug)}
                  </Badge>
                </div>
                
                {/* Always Visible Content */}
                <div className="p-6 space-y-4">
                  {/* Juice Name */}
                  <h3 className="font-heading font-bold text-xl text-foreground">{juice.name}</h3>
                  
                  {/* Benefit */}
                  <p className="font-body text-sm text-muted-foreground">{juice.benefit}</p>
                  
                  {/* Ingredients, Benefit and Price */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div>
                      <p className="font-body text-sm text-foreground">
                        <span className="font-semibold">Ingredients:</span> {juice.ingredients.join(", ")}
                      </p>
                      <p className="font-body text-sm text-muted-foreground mt-2">
                        {juice.benefit}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge className="bg-primary text-primary-foreground font-bold">
                        {STANDARD_JUICE_PRICE}
                      </Badge>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => window.location.href = `/order/${juice.slug}`}
                      >
                        Order Now
                      </Button>
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
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.location.href = "/order-options"}
                  >
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
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.location.href = "/order-options"}
                  >
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