import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasscodeModal = ({ isOpen, onClose }: PasscodeModalProps) => {
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a brief loading state for UX
    setTimeout(() => {
      if (passcode === "EXOTICJUICE") {
        // Store access in session storage
        sessionStorage.setItem("exotic-access", "granted");
        toast({
          title: "Access Granted",
          description: "Welcome to the Exotic Menu!",
        });
        onClose();
        navigate("/exotic-menu");
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid passcode. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      setPasscode("");
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-heading">
            🔒 Exotic Menu Access
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter the secret passcode to unlock our exclusive exotic blends.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passcode">Passcode</Label>
            <Input
              id="passcode"
              type="password"
              placeholder="Enter passcode..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="text-center font-mono tracking-wider"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !passcode.trim()}
            >
              {isLoading ? "Verifying..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasscodeModal;