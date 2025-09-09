import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Copy, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const EmailCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has seen welcome modal before
    const hasSeenModal = localStorage.getItem('nj_seen_welcome_modal');
    const isFirstVisit = !hasSeenModal;
    
    if (isFirstVisit) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !consent) {
      toast({
        title: "Missing Information",
        description: "Please enter your email and accept the terms.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to newsletter endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store email and mark as seen
      localStorage.setItem('nj_memberEmail', email);
      localStorage.setItem('nj_seen_welcome_modal', 'true');
      
      // Set expiry date (30 days)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      localStorage.setItem('nj_welcome_modal_expiry', expiryDate.toISOString());
      
      // Update global state
      if (window.NJ) {
        window.NJ.memberEmail = email;
      }
      
      setShowCode(true);
      
      toast({
        title: "Welcome to NeuroJuice!",
        description: "Your discount code is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    toast({
      title: "Code Copied!",
      description: "Your discount code has been copied to clipboard.",
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    
    // Mark as seen even if they close without submitting
    localStorage.setItem('nj_seen_welcome_modal', 'true');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem('nj_welcome_modal_expiry', expiryDate.toISOString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showCode ? "Your Discount Code!" : "Welcome! Get 10% off your first order"}
          </DialogTitle>
        </DialogHeader>
        
        {!showCode ? (
          <div className="space-y-6 p-2">
            <p className="text-center text-muted-foreground">
              Join our wellness community for personalized tips and exclusive Dr. Vital updates.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground">
                  I agree to receive wellness tips and product updates from NeuroJuice
                </Label>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={isLoading || !email || !consent}
                  className="flex-1"
                >
                  {isLoading ? "Processing..." : "Get My Code"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6 p-2 text-center">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-success" />
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">Your discount code:</p>
              <div className="flex items-center justify-center space-x-2 p-3 bg-secondary rounded-lg">
                <code className="font-mono text-xl font-bold">WELCOME10</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyCode}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Use this code at checkout for 10% off your first order. Welcome to the NeuroJuice family!
            </p>
            
            <Button onClick={handleClose} className="w-full">
              Start Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;