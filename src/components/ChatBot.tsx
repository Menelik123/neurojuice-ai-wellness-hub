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
  isSystemMessage?: boolean;
  hasButtons?: boolean;
  buttons?: Array<{
    text: string;
    action: "order" | "subscribe" | "diy" | "quick-response";
    value?: string;
  }>;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
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
  };

  const quickResponses = [
    "I need more energy",
    "Help with immune support", 
    "Looking for detox",
    "Improve my focus",
    "Post-workout recovery"
  ];

  return (
    <>
      {/* Chat Section for scrolling */}
      <section id="chat" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-heading font-bold text-4xl text-foreground">
              Meet Dr. Vital AI
            </h2>
            <div className="space-y-4 font-body text-lg text-muted-foreground leading-relaxed">
              <p>
                Meet Dr. Vital, your on-site AI wellness guide. Dr. Vital engages you with simple questions about your current symptoms and health aspirations.
              </p>
              <p>
                Leveraging real-time nutritional data, Dr. Vital instantly generates three personalized juice blends designed to meet your specific goals, then guides you on how to order them or even make them yourself.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/dr-vital'}
              variant="hero"
              size="lg"
              className="mt-6"
            >
              <MessageCircle className="w-5 h-5" />
              Start Full Conversation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatBot;