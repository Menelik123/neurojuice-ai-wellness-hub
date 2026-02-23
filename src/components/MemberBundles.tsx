import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const MemberBundles = () => {
  const bundles = [
    {
      name: "Starter Stack",
      description: "3 bottles — perfect to try your favorites",
      price: "$15",
      perBottle: "$5.00/bottle",
      icon: <Gift className="w-6 h-6" />,
      savings: "Save $3",
    },
    {
      name: "Performance Stack",
      description: "5 bottles — your weekly performance routine",
      price: "$24",
      perBottle: "$4.80/bottle",
      icon: <Users className="w-6 h-6" />,
      savings: "Save $6",
    },
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
          Bundle & Save
        </h3>
        <p className="text-muted-foreground">
          Stack more, save more. No membership required.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {bundles.map((bundle, index) => (
          <Card key={index} className="hover:shadow-soft transition-all duration-300">
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
                    <span className="font-bold text-2xl text-foreground">
                      {bundle.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {bundle.perBottle}
                    </span>
                  </div>
                  <p className="text-sm text-primary font-semibold">
                    {bundle.savings}
                  </p>
                </div>
                
                <Button asChild className="w-full">
                  <Link to="/fuel">
                    Shop Bundle
                  </Link>
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
