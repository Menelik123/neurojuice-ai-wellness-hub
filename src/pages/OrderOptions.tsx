import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, Calendar, Navigation, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const OrderOptions = () => {
  const { toast } = useToast();
  const [deliveryForm, setDeliveryForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });
  const [notifyEmail, setNotifyEmail] = useState("");

  const handleDeliveryClick = () => {
    document.querySelector("#delivery-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePickupClick = () => {
    document.querySelector("#popup-locations")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryForm.street || !deliveryForm.city || !deliveryForm.state || !deliveryForm.zip) {
      toast({
        title: "Missing Information",
        description: "Please fill in all address fields",
        variant: "destructive"
      });
      return;
    }
    
    window.location.href = "/fuel";
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Successfully Subscribed!",
      description: "We'll notify you when we're in your area",
    });
    setNotifyEmail("");
  };

  const popupLocations = [
    {
      id: 1,
      name: "Piedmont Park Farmers Market",
      date: "Saturday, August 10th",
      time: "9:00 AM - 2:00 PM",
      address: "400 Park Dr NE, Atlanta, GA 30309",
      mapsUrl: "https://maps.google.com?q=400+Park+Dr+NE,+Atlanta,+GA+30309"
    },
    {
      id: 2,
      name: "Little Five Points Community Center",
      date: "Sunday, August 11th", 
      time: "11:00 AM - 4:00 PM",
      address: "1083 Austin Ave NE, Atlanta, GA 30307",
      mapsUrl: "https://maps.google.com?q=1083+Austin+Ave+NE,+Atlanta,+GA+30307"
    },
    {
      id: 3,
      name: "Ponce City Market",
      date: "Friday, August 16th",
      time: "12:00 PM - 7:00 PM", 
      address: "675 Ponce De Leon Ave NE, Atlanta, GA 30308",
      mapsUrl: "https://maps.google.com?q=675+Ponce+De+Leon+Ave+NE,+Atlanta,+GA+30308"
    },
    {
      id: 4,
      name: "Grant Park Summer Festival",
      date: "Saturday, August 17th",
      time: "10:00 AM - 6:00 PM",
      address: "840 Cherokee Ave SE, Atlanta, GA 30315", 
      mapsUrl: "https://maps.google.com?q=840+Cherokee+Ave+SE,+Atlanta,+GA+30315"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">
              How would you like to receive your NeuroJuice?
            </h1>
            <p className="font-body text-xl text-white/90 max-w-2xl mx-auto">
              Choose your preferred way to get fresh, AI-optimized nutrition delivered to you.
            </p>
          </div>
        </section>

        {/* Order Options Cards */}
        <section className="py-16 bg-gradient-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Delivery Option */}
              <Card 
                className="overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-card hover:shadow-soft cursor-pointer"
                onClick={handleDeliveryClick}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center">
                    <Truck className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Deliver to Your Door</h3>
                    <p className="font-body text-muted-foreground">
                      Fresh juice delivered right to your doorstep.
                    </p>
                  </div>
                  <Button size="lg" className="w-full">
                    Choose Delivery
                  </Button>
                </CardContent>
              </Card>

              {/* Pickup Option */}
              <Card 
                className="overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-card hover:shadow-soft cursor-pointer"
                onClick={handlePickupClick}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Pick Up at Pop-Up Shop</h3>
                    <p className="font-body text-muted-foreground">
                      Grab yours at our neighborhood pop-ups.
                    </p>
                  </div>
                  <Button size="lg" className="w-full">
                    Find Pop-Ups
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Delivery Form Section */}
        <section id="delivery-form" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                  Enter Your Address
                </h2>
                <p className="font-body text-lg text-muted-foreground">
                  We'll deliver fresh NeuroJuice right to your door.
                </p>
              </div>

              <Card className="shadow-card">
                <CardContent className="p-8">
                  <form onSubmit={handleDeliverySubmit} className="space-y-6">
                    <div>
                      <label htmlFor="street" className="block font-body font-medium text-foreground mb-2">
                        Street Address
                      </label>
                      <Input
                        id="street"
                        type="text"
                        placeholder="123 Main Street"
                        value={deliveryForm.street}
                        onChange={(e) => setDeliveryForm(prev => ({ ...prev, street: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block font-body font-medium text-foreground mb-2">
                          City
                        </label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Atlanta"
                          value={deliveryForm.city}
                          onChange={(e) => setDeliveryForm(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block font-body font-medium text-foreground mb-2">
                          State
                        </label>
                        <Select value={deliveryForm.state} onValueChange={(value) => setDeliveryForm(prev => ({ ...prev, state: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="NC">North Carolina</SelectItem>
                            <SelectItem value="SC">South Carolina</SelectItem>
                            <SelectItem value="TN">Tennessee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="zip" className="block font-body font-medium text-foreground mb-2">
                        ZIP Code
                      </label>
                      <Input
                        id="zip"
                        type="text"
                        placeholder="30309"
                        value={deliveryForm.zip}
                        onChange={(e) => setDeliveryForm(prev => ({ ...prev, zip: e.target.value }))}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Continue to Checkout
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pop-Up Locations Section */}
        <section id="popup-locations" className="py-20 bg-gradient-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                  Find Us at These Pop-Up Shops
                </h2>
                <p className="font-body text-lg text-muted-foreground">
                  Join us at these upcoming Atlanta locations for fresh NeuroJuice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {popupLocations.map((location) => (
                  <Card key={location.id} className="shadow-card hover:shadow-soft transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-heading font-bold text-lg text-foreground">
                            {location.name}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{location.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="w-4 h-4 flex items-center justify-center">⏰</span>
                              <span>{location.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{location.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(location.mapsUrl, "_blank")}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Calendar Event",
                              description: "Added to your calendar!",
                            });
                          }}
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Email Notification Form */}
              <Card className="shadow-card">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                        Notify Me When We're Near You
                      </h3>
                      <p className="font-body text-muted-foreground">
                        Get alerts when NeuroJuice pop-ups are happening in your area.
                      </p>
                    </div>
                    
                    <form onSubmit={handleNotifySubmit} className="max-w-md mx-auto">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={notifyEmail}
                            onChange={(e) => setNotifyEmail(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit">
                          <Mail className="w-4 h-4 mr-2" />
                          Subscribe
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderOptions;