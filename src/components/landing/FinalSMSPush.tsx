import { MessageSquare } from "lucide-react";
import SMSOptInForm from "./SMSOptInForm";

const FinalSMSPush = () => {
  return (
    <section id="sms-signup" className="py-20 px-4 bg-foreground text-background">
      <div className="max-w-xl mx-auto text-center space-y-8">
        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl">
            Don't Miss the Next Drop
          </h2>
          <p className="text-background/70 text-lg">
            Fresh batches sell out fast. Get notified first.
          </p>
        </div>

        <div className="flex justify-center">
          <SMSOptInForm variant="compact" showEmail={false} />
        </div>
        
        <p className="text-xs text-background/50">
          By signing up, you agree to receive SMS updates from NeuroJuice. 
          Msg & data rates may apply. Reply STOP to unsubscribe.
        </p>
      </div>
    </section>
  );
};

export default FinalSMSPush;
