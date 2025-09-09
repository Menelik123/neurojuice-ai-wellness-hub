import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Gift, Lock } from "lucide-react";

const MemberBundles = () => {
  const isMember = window.NJ?.isMember || false;

  const bundles = [
    {
      name: "5-Pack Weekly Bundle",
      description: "Perfect for your weekly juice routine",
      regularPrice: "$39.95",
      memberPrice: "$31.96",
      icon: <Users className="w-6 h-6" />,
      savings: "$7.99"
    },
    {
      name: "3-Pack Trio",
      description: "Try our top customer favorites",
      regularPrice: "$23.97",
      memberPrice: "$19.18",
      icon: <Gift className="w-6 h-6" />,
      savings: "$4.79"
    }
  ];

  const handleOrderBundle = (bundleName: string) => {
    if (isMember) {
      window.location.href = `/order-options?item=${encodeURIComponent(bundleName)}`;
    } else {
      window.location.href = '/vitalpass';
    }
  };

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
          Member Bundles
        </h3>
        <p className="text-muted-foreground">
          Exclusive bundle pricing for VitalPass members
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {bundles.map((bundle, index) => (
          <Card key={index} className="relative hover:shadow-soft transition-all duration-300">
            {!isMember && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center space-y-3">
                  <Lock className="w-8 h-8 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">Join to unlock</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = '/vitalpass'}
                      className="mt-2"
                    >
                      VitalPass Required
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-primary">
                    {bundle.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg">{bundle.name}</h4>
                    <p className="text-sm text-muted-foreground">{bundle.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm line-through text-muted-foreground">
                      {bundle.regularPrice}
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {bundle.memberPrice}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Member Price
                    </Badge>
                  </div>
                  <p className="text-sm text-success font-medium">
                    Save {bundle.savings}!
                  </p>
                </div>
                
                <Button
                  onClick={() => handleOrderBundle(bundle.name)}
                  variant={isMember ? "hero" : "outline"}
                  className="w-full"
                  disabled={!isMember}
                >
                  {isMember ? "Order Now" : "Join to Unlock"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default MemberBundles;