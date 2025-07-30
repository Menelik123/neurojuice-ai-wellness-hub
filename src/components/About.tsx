import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Leaf, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health First",
      description: "Every blend is crafted with your wellness as our top priority"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Precision", 
      description: "Advanced algorithms ensure optimal nutrition for your unique needs"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Pure Ingredients",
      description: "Only the freshest, organic produce makes it into our blends"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "We're building a wellness community, one juice at a time"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
            Our Mission & Story
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Empowering personal health through the perfect fusion of AI technology and fresh, natural nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Mission Text */}
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              Revolutionizing Personalized Nutrition
            </h3>
            
            <div className="space-y-4 font-body text-foreground leading-relaxed">
              <p>
                At NeuroJuice, we believe that optimal health isn't one-size-fits-all. That's why we've 
                developed Dr. Vital AI, our proprietary nutrition intelligence system that analyzes your 
                unique goals, preferences, and dietary needs to create the perfect juice blend just for you.
              </p>
              
              <p>
                Founded with the vision of making personalized nutrition accessible to everyone, we combine 
                cutting-edge artificial intelligence with the timeless wisdom of whole food nutrition. 
                Every sip is a step toward your optimal wellness.
              </p>
              
              <p>
                Our commitment goes beyond just great-tasting juices. We're building a community of 
                health-conscious individuals who believe in the power of personalized nutrition to 
                transform lives, one blend at a time.
              </p>
            </div>

            <Button variant="default" size="lg" className="mt-6">
              Learn More About Our Process
            </Button>
          </div>

          {/* Founders/Team Image Placeholder */}
          <div className="relative">
            <Card className="overflow-hidden shadow-card">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <div className="font-heading font-bold text-xl text-foreground">Our Founders</div>
                    <div className="font-body text-muted-foreground max-w-xs">
                      Dedicated to revolutionizing wellness through AI-powered personalized nutrition
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card 
              key={index}
              className="text-center p-6 shadow-card hover:shadow-soft transition-all duration-300 hover:scale-105"
            >
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center text-white">
                  {value.icon}
                </div>
                <h4 className="font-heading font-bold text-lg text-foreground">
                  {value.title}
                </h4>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary">2024</div>
              <div className="font-body text-muted-foreground">Founded</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary">100+</div>
              <div className="font-body text-muted-foreground">Juice Combinations</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary">50+</div>
              <div className="font-body text-muted-foreground">Organic Ingredients</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary">24/7</div>
              <div className="font-body text-muted-foreground">AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;