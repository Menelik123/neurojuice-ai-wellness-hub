import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Bell } from "lucide-react";

const VideoSection = () => {
  const handleNotifyMe = () => {
    // This could trigger an email signup for video notifications
    console.log("User wants to be notified about founder video");
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Section Header */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
              Founder Stories
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Get to know the passionate minds behind NeuroJuice and learn about our journey 
              to revolutionize personalized nutrition.
            </p>
          </div>

          {/* Video Player Placeholder */}
          <Card className="overflow-hidden shadow-card">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center relative">
                {/* Play Button */}
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center shadow-button cursor-pointer hover:scale-110 transition-transform duration-300">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-heading font-bold text-2xl text-foreground">
                      Coming Soon
                    </h3>
                    <p className="font-body text-muted-foreground max-w-md mx-auto">
                      Our founders are excited to share their story and vision for the future of personalized nutrition.
                    </p>
                  </div>
                </div>

                {/* Overlay Badge */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="font-body text-sm text-primary font-semibold">Preview Coming Soon</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notify Me CTA */}
          <div className="space-y-4">
            <Button 
              variant="default" 
              size="lg"
              onClick={handleNotifyMe}
              className="transform hover:scale-105 transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              Notify Me When It's Ready
            </Button>
            
            <p className="font-body text-sm text-muted-foreground">
              Be the first to watch our founder story and get exclusive insights into our mission.
            </p>
          </div>

          {/* Teaser Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-xl">1</span>
              </div>
              <h4 className="font-heading font-semibold text-foreground">The Vision</h4>
              <p className="font-body text-sm text-muted-foreground">
                How we envisioned AI-powered personalized nutrition
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="font-heading font-bold text-secondary text-xl">2</span>
              </div>
              <h4 className="font-heading font-semibold text-foreground">The Journey</h4>
              <p className="font-body text-sm text-muted-foreground">
                Our path from concept to creating Dr. Vital AI
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <span className="font-heading font-bold text-accent text-xl">3</span>
              </div>
              <h4 className="font-heading font-semibold text-foreground">The Future</h4>
              <p className="font-body text-sm text-muted-foreground">
                What's next for NeuroJuice and personalized wellness
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;