import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MessageSquare } from "lucide-react";

const MadeToOrder = () => {
  const scrollToSMS = () => {
    document.querySelector("#sms-signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-dashed border-border bg-muted/20">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <div className="space-y-3">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                Made-to-Order Juices
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                These blends are made on request. We produce them after demand is confirmed. 
                2–3 day prep time.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={scrollToSMS}
                size="lg"
                className="bg-primary hover:bg-primary-glow text-primary-foreground"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Join SMS to Request or Reserve
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MadeToOrder;
