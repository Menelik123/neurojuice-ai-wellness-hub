import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MemberPricingProps {
  regularPrice?: number;
  showJoinLink?: boolean;
  size?: "sm" | "md" | "lg";
}

const MemberPricing = ({ 
  regularPrice = 6, 
  showJoinLink = true, 
  size = "md" 
}: MemberPricingProps) => {
  const config = window.NJ_CONFIG;
  const state = window.NJ;
  
  const memberPrice = config ? 
    (regularPrice * (1 - config.MEMBER_DISCOUNT_PCT)).toFixed(2) : 
    (regularPrice * 0.8).toFixed(2);
  
  const isMember = state?.isMember || false;
  
  const priceClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };
  
  const memberPriceClasses = {
    sm: "text-base font-bold",
    md: "text-lg font-bold",
    lg: "text-xl font-bold"
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <span className={`line-through text-muted-foreground ${priceClasses[size]}`}>
          ${regularPrice.toFixed(2)}
        </span>
        <div className="flex items-center space-x-2">
          <span className={`text-primary ${memberPriceClasses[size]}`}>
            ${memberPrice}
          </span>
          {isMember ? (
            <Badge className="bg-success text-success-foreground text-xs">
              Active Member
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              with NeuroRoutine
            </Badge>
          )}
        </div>
      </div>
      
      {!isMember && showJoinLink && (
        <Button
          variant="link"
          size="sm"
          onClick={() => window.location.href = '/vitalpass'}
          className="h-auto p-0 text-xs text-primary hover:text-primary-glow"
        >
          Join NeuroRoutine – Save
        </Button>
      )}
    </div>
  );
};

export default MemberPricing;