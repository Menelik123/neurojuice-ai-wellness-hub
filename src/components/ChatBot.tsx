import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm Dr. Vital, your AI nutrition expert. I'm ready to find your perfect juice blend based on your goals, preferences, and health needs. What would you like to achieve today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickResponses = [
    "I need more energy",
    "Help with immune support", 
    "Looking for detox",
    "Improve my focus",
    "Post-workout recovery"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateBotResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("energy")) {
      return "Perfect! For natural energy, I recommend our Tropical Boost or Energy Blast. The Tropical Boost combines pineapple and mango for quick energy, while Energy Blast has carrot and turmeric for sustained power. Which sounds better to you?";
    }
    
    if (input.includes("immune")) {
      return "Great choice! Our Immune Shield is packed with vitamin C from citrus fruits, plus elderberry and zinc for extra protection. Would you like me to customize the blend based on any specific health concerns?";
    }
    
    if (input.includes("detox")) {
      return "Excellent! Green Vitality is our signature detox blend with cucumber, spinach, and green apple. It's alkalizing and helps flush toxins naturally. How familiar are you with green juices?";
    }
    
    if (input.includes("focus")) {
      return "Brain Boost is perfect for cognitive enhancement! It contains blueberries and grape for antioxidants, plus walnut extract for omega-3s. This blend supports memory and concentration. Would you like to add any adaptogens?";
    }
    
    return "That's interesting! Based on your needs, I can create a personalized blend recommendation. Could you tell me more about your health goals, any dietary restrictions, or ingredients you particularly enjoy?";
  };

  const handleQuickResponse = (response: string) => {
    setInputValue(response);
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-full w-14 h-14 shadow-button hover:shadow-soft transition-all duration-300",
            isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-button"
          )}
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "fixed bottom-24 right-6 z-40 w-96 h-[500px] transition-all duration-300 transform",
        isOpen 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-8 scale-95 pointer-events-none"
      )}>
        <Card className="h-full shadow-soft border-0 overflow-hidden">
          <CardHeader className="bg-gradient-hero text-white p-4">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span className="font-heading">Dr. Vital AI</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 font-body text-sm",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "bot" && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <p className="leading-relaxed">{message.content}</p>
                      {message.type === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Responses */}
            {messages.length === 1 && (
              <div className="p-4 bg-muted/50 border-t">
                <p className="font-body text-xs text-muted-foreground mb-2">Quick options:</p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickResponse(response)}
                      className="text-xs"
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-background border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about juice recommendations..."
                  className="flex-1 font-body"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  variant="default"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Section for scrolling */}
      <section id="chat" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-heading font-bold text-4xl text-foreground">
              Meet Dr. Vital AI
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Your personal nutrition assistant is ready to help you discover the perfect juice blend 
              for your unique needs. Click the chat button in the bottom right to get started!
            </p>
            <Button
              onClick={() => setIsOpen(true)}
              variant="hero"
              size="lg"
              className="mt-6"
            >
              <MessageCircle className="w-5 h-5" />
              Start Conversation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatBot;