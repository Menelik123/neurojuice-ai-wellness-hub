import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VitalPaywall from "@/components/VitalPaywall";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
  hasButtons?: boolean;
  buttons?: Array<{
    text: string;
    action: "order" | "subscribe" | "diy" | "quick-response";
    value?: string;
  }>;
}

const DrVital = () => {
  const [userName, setUserName] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system",
      type: "bot",
      content: "You are Dr. Vital, a certified holistic juice specialist and AI health coach. Speak warmly and professionally. Always ask clarifying questions before recommending blends. Include: 'Not medical advice; consult a healthcare professional.'",
      timestamp: new Date(),
      isSystemMessage: true
    },
    {
      id: "1",
      type: "bot",
      content: "Hello, I'm Dr. Vital. How are you feeling today? Tell me about your symptoms, energy levels, mood, or wellness goals.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  // Check access permissions
  const checkAccess = () => {
    const config = window.NJ_CONFIG;
    const state = window.NJ;

    // Free mode - everyone has access
    if (config?.VITAL_PAYWALL_MODE === "free") {
      return true;
    }

    // Member access
    if (state?.isMember) {
      return true;
    }

    // Trial access - check if trial is active and not expired
    if (state?.hasVitalTrial && state?.trialEndsAt) {
      return new Date() < state.trialEndsAt;
    }

    return false;
  };

  const hasAccess = checkAccess();
  const trialEndsAt = window.NJ?.trialEndsAt;
  const isTrialActive = window.NJ?.hasVitalTrial && trialEndsAt && new Date() < trialEndsAt;

  const handleTrialStart = () => {
    setShowPaywall(false);
  };

  const quickResponses = [
    "I need more energy",
    "Help with immune support", 
    "Looking for detox",
    "Improve my focus",
    "Post-workout recovery",
    "Better sleep quality",
    "Reduce stress levels",
    "Digestive health"
  ];

  const followUpQuestions = [
    "Can you walk me through your typical morning routine and diet?",
    "How are your sleep quality and stress levels lately?"
  ];

  const juiceBlends = {
    energy: {
      name: "Energy Blast",
      ingredients: "Carrot (1 cup), Orange (¾ cup), Ginger (1 tsp), Turmeric (½ tsp)",
      why: "Vitamin A from carrots supports sustained energy, while vitamin C and ginger provide natural stimulation without caffeine crashes."
    },
    immune: {
      name: "Immune Shield", 
      ingredients: "Orange (1 cup), Lemon (½ cup), Elderberry (¼ cup), Zinc supplement",
      why: "High vitamin C content boosts white blood cell production, elderberry provides antioxidants, and zinc supports immune function."
    },
    focus: {
      name: "Brain Boost",
      ingredients: "Blueberry (¾ cup), Grape (¾ cup), Walnut extract (1 tsp), Lion's Mane (optional)",
      why: "Anthocyanins from berries improve cognitive function, while omega-3s from walnut extract support brain health and memory."
    },
    detox: {
      name: "Green Vitality",
      ingredients: "Cucumber (1 cup), Spinach (1 cup), Green Apple (½ cup), Lemon (¼ cup)",
      why: "Chlorophyll aids liver detoxification, cucumber provides hydration, and apple adds natural sweetness while supporting digestion."
    },
    stress: {
      name: "Calm & Restore",
      ingredients: "Watermelon (1 cup), Mint (fresh), Magnesium powder (optional), Coconut water (½ cup)",
      why: "Natural sugars provide gentle energy, mint has calming properties, and magnesium helps reduce cortisol levels."
    },
    sleep: {
      name: "Twilight Elixir",
      ingredients: "Tart Cherry (¾ cup), Chamomile tea (cooled), Banana (½), Almond milk (½ cup)",
      why: "Tart cherries naturally contain melatonin, chamomile promotes relaxation, and potassium from banana supports muscle recovery."
    }
  };

  const getPersonalizedBlends = (responses: string[]) => {
    const combined = responses.join(" ").toLowerCase();
    const selectedBlends = [];
    
    if (combined.includes("energy") || combined.includes("tired") || combined.includes("coffee")) {
      selectedBlends.push(juiceBlends.energy);
    }
    if (combined.includes("immune") || combined.includes("sick") || combined.includes("cold")) {
      selectedBlends.push(juiceBlends.immune);
    }
    if (combined.includes("focus") || combined.includes("concentration") || combined.includes("work")) {
      selectedBlends.push(juiceBlends.focus);
    }
    if (combined.includes("detox") || combined.includes("cleanse") || combined.includes("bloat")) {
      selectedBlends.push(juiceBlends.detox);
    }
    if (combined.includes("stress") || combined.includes("anxious") || combined.includes("overwhelm")) {
      selectedBlends.push(juiceBlends.stress);
    }
    if (combined.includes("sleep") || combined.includes("insomnia") || combined.includes("rest")) {
      selectedBlends.push(juiceBlends.sleep);
    }
    
    // Default to energy, immune, and focus if no specific matches
    if (selectedBlends.length === 0) {
      selectedBlends.push(juiceBlends.energy, juiceBlends.immune, juiceBlends.focus);
    }
    
    return selectedBlends.slice(0, 3);
  };

  const getHolisticTip = (responses: string[]) => {
    const combined = responses.join(" ").toLowerCase();
    
    if (combined.includes("sleep") || combined.includes("tired")) {
      return "Holistic tip: Try the 4-7-8 breathing technique before bed - inhale for 4, hold for 7, exhale for 8. This activates your parasympathetic nervous system for better sleep.";
    }
    if (combined.includes("stress") || combined.includes("work")) {
      return "Holistic tip: Take a 2-minute hydration break every hour. Dehydration increases cortisol levels and can amplify stress responses.";
    }
    if (combined.includes("energy") || combined.includes("morning")) {
      return "Holistic tip: Start your day with 10 minutes of sunlight exposure. This helps regulate your circadian rhythm and naturally boosts energy.";
    }
    
    return "Holistic tip: Remember to drink at least 8 glasses of water daily. Proper hydration is the foundation of cellular energy and mental clarity.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserResponses(prev => [...prev, inputValue]);
    setInputValue("");

    // Generate bot response based on conversation step
    setTimeout(() => {
      generateBotResponse(inputValue, conversationStep);
      setConversationStep(prev => prev + 1);
    }, 1000);
  };

  const generateBotResponse = (userInput: string, step: number) => {
    let botContent = "";
    let hasButtons = false;
    let buttons: Array<{text: string, action: "order" | "subscribe" | "diy" | "quick-response", value?: string}> = [];

    if (step === 0) {
      // First response - ask follow-up question
      botContent = followUpQuestions[0];
    } else if (step === 1) {
      // Second response - ask second follow-up
      botContent = followUpQuestions[1];
    } else if (step === 2) {
      // Third response - provide personalized recommendations
      const blends = getPersonalizedBlends([...userResponses, userInput]);
      const holisticTip = getHolisticTip([...userResponses, userInput]);
      
      botContent = `Based on your responses, here are three personalized NeuroJuice blends for you:\n\n`;
      
      blends.forEach((blend, index) => {
        botContent += `**${index + 1}. ${blend.name}**\n`;
        botContent += `Ingredients: ${blend.ingredients}\n`;
        botContent += `Why it works: ${blend.why}\n\n`;
      });
      
      botContent += `${holisticTip}\n\n`;
      botContent += `Unlock NeuroJuice Pro: unlimited Dr. Vital access, 20% off bundles, monthly wellness check-ins. First two months are free; cancel anytime.\n\n`;
      botContent += `*Not medical advice; consult a healthcare professional.*`;
      
      hasButtons = true;
      buttons = [
        { text: "Order Now", action: "order" },
        { text: "Subscribe & Save", action: "subscribe" },
        { text: "DIY at Home", action: "diy" }
      ];
    } else {
      // Final response
      const name = userName || "friend";
      botContent = `I'm here anytime, ${name}. Drink well, feel well! 🧃✨`;
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: botContent,
      timestamp: new Date(),
      hasButtons,
      buttons
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleButtonClick = (action: string) => {
    if (action === "order") {
      window.location.href = "/order-options";
    } else if (action === "subscribe") {
      // Add subscription logic here
      console.log("Redirect to subscription checkout");
    } else if (action === "diy") {
      const finalMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "bot", 
        content: "Perfect! Screenshot those recipes and enjoy making your personalized blends at home. Remember to use fresh, organic ingredients when possible. Cheers to your health journey! 🥤✨",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, finalMessage]);
    }
  };

  const handleQuickResponse = (response: string) => {
    setInputValue(response);
    setChatStarted(true);
  };

  const startConversation = () => {
    setChatStarted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      
      {/* Paywall Check */}
      {!hasAccess && showPaywall && (
        <VitalPaywall onTrialStart={handleTrialStart} />
      )}
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading font-bold text-5xl text-foreground">
                  Dr. Vital AI
                </h1>
                {isTrialActive && trialEndsAt && (
                  <Badge variant="outline" className="ml-4">
                    Trial ends {trialEndsAt.toLocaleDateString()}
                  </Badge>
                )}
              </div>
              
              <p className="font-body text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Your personal holistic juice specialist and AI health coach. Get personalized blend recommendations 
                based on your unique symptoms, goals, and lifestyle through our advanced wellness conversation.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="text-center p-6">
                  <CardHeader>
                    <CardTitle className="text-primary">🧠 Personalized Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Advanced AI analyzes your responses to create custom juice blends</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center p-6">
                  <CardHeader>
                    <CardTitle className="text-primary">🌿 Holistic Approach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Combines nutrition science with wellness lifestyle recommendations</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center p-6">
                  <CardHeader>
                    <CardTitle className="text-primary">⚡ Instant Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Get tailored juice recipes and health tips in minutes</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Interface Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {!chatStarted ? (
                <Card className="shadow-soft border-0">
                  <CardHeader className="bg-gradient-hero text-white text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <Bot className="w-6 h-6" />
                      <span className="font-heading text-2xl">Start Your Wellness Journey</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <p className="font-body text-lg text-muted-foreground">
                        Dr. Vital will ask you a few questions about your health, lifestyle, and goals 
                        to create personalized juice blends just for you.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {quickResponses.map((response, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickResponse(response)}
                            className="text-xs h-auto py-3 px-2"
                          >
                            {response}
                          </Button>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={startConversation}
                        variant="hero"
                        size="lg"
                        className="mt-8"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Start Conversation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-soft border-0 h-[600px]">
                  <CardHeader className="bg-gradient-hero text-white">
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="w-5 h-5" />
                      <span className="font-heading">Dr. Vital AI</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                      {messages.filter(m => !m.isSystemMessage).map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.type === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-4 font-body",
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            )}
                          >
                            <div className="flex items-start space-x-3">
                              {message.type === "bot" && <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                              <div className="space-y-3">
                                <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
                                {message.hasButtons && message.buttons && (
                                  <div className="flex flex-wrap gap-2">
                                    {message.buttons.map((button, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleButtonClick(button.action)}
                                        className="text-xs"
                                      >
                                        {button.text}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {message.type === "user" && <User className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-background border-t">
                      <div className="flex space-x-3">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Tell Dr. Vital how you're feeling..."
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
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DrVital;