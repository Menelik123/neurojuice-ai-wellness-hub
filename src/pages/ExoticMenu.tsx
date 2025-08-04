import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

/* EXOTIC MENU START */
const ExoticMenu = () => {
  const [dragonfuitSize, setDragonfruitSize] = useState("medium");
  const [starfruitSize, setStarfruitSize] = useState("medium");
  const navigate = useNavigate();

  // Check access on component mount
  useEffect(() => {
    const hasAccess = sessionStorage.getItem("exotic-access");
    if (!hasAccess) {
      navigate("/");
    }
  }, [navigate]);

  const handleOrder = (blend: string, size: string) => {
    // Navigate to order options with parameters
    const params = new URLSearchParams({
      blend,
      size,
      exotic: "true"
    });
    navigate(`/order-options?${params.toString()}`);
  };

  const sizes = [
    { value: "small", label: "Small", description: "8oz" },
    { value: "medium", label: "Medium", description: "12oz" },
    { value: "large", label: "Large", description: "16oz" }
  ];

  return (
    <div className="min-h-screen exotic-menu-bg text-white font-body">
      {/* Header */}
      <header className="relative py-8 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Main Site
          </Button>
          
          <div className="text-center">
            <h1 className="neon-glow-title font-heading text-4xl md:text-6xl font-bold mb-4">
              NeuroJuice After Dark
            </h1>
            <p className="neon-glow-subtitle text-xl md:text-2xl">
              Exotic Blends
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Dragonfruit Elixir Card */}
          <Card className="exotic-card">
            <CardHeader>
              <div className="w-full h-48 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl opacity-50">🐉</div>
              </div>
              <CardTitle className="neon-pink text-2xl font-heading">
                Dragonfruit Elixir
              </CardTitle>
              <CardDescription className="text-cyan-300">
                A mystical blend of exotic dragonfruit with ancient adaptogenic herbs for enhanced focus and vitality.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Size Selector */}
              <div className="space-y-3">
                <Label className="text-white font-semibold">Select Size:</Label>
                <RadioGroup 
                  value={dragonfuitSize} 
                  onValueChange={setDragonfruitSize}
                  className="space-y-2"
                >
                  {sizes.map((size) => (
                    <div key={size.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={size.value} 
                        id={`dragonfruit-${size.value}`}
                        className="border-cyan-400 text-pink-500"
                      />
                      <Label 
                        htmlFor={`dragonfruit-${size.value}`}
                        className="text-white cursor-pointer flex-1"
                      >
                        {size.label} <span className="text-cyan-300">({size.description})</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Price */}
              <div className="text-center py-2">
                <span className="text-lg font-semibold neon-cyan">Price: TBD</span>
              </div>

              {/* Order Button */}
              <Button 
                onClick={() => handleOrder("Dragonfruit Elixir", dragonfuitSize)}
                className="w-full neon-button-pink font-semibold py-3"
              >
                Order Now
              </Button>
            </CardContent>
          </Card>

          {/* Starfruit Essence Card */}
          <Card className="exotic-card">
            <CardHeader>
              <div className="w-full h-48 bg-gradient-to-br from-yellow-400/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl opacity-50">⭐</div>
              </div>
              <CardTitle className="neon-cyan text-2xl font-heading">
                Starfruit Essence
              </CardTitle>
              <CardDescription className="text-pink-300">
                Celestial starfruit infused with rare nootropics for heightened cognitive enhancement and mental clarity.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Size Selector */}
              <div className="space-y-3">
                <Label className="text-white font-semibold">Select Size:</Label>
                <RadioGroup 
                  value={starfruitSize} 
                  onValueChange={setStarfruitSize}
                  className="space-y-2"
                >
                  {sizes.map((size) => (
                    <div key={size.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={size.value} 
                        id={`starfruit-${size.value}`}
                        className="border-pink-400 text-cyan-500"
                      />
                      <Label 
                        htmlFor={`starfruit-${size.value}`}
                        className="text-white cursor-pointer flex-1"
                      >
                        {size.label} <span className="text-pink-300">({size.description})</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Price */}
              <div className="text-center py-2">
                <span className="text-lg font-semibold neon-pink">Price: TBD</span>
              </div>

              {/* Order Button */}
              <Button 
                onClick={() => handleOrder("Starfruit Essence", starfruitSize)}
                className="w-full neon-button-cyan font-semibold py-3"
              >
                Order Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
/* EXOTIC MENU END */

export default ExoticMenu;