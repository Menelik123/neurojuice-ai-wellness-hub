import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
  hasButtons?: boolean;
  buttons?: Array<{ text: string; action: string }>;
}

const quickResponses = [
  "I need more energy",
  "Help with immune support",
  "Looking for detox",
  "Improve my focus",
  "Post-workout recovery",
  "Better sleep quality",
  "Reduce stress levels",
  "Digestive health",
];

const juiceBlends: Record<string, { name: string; ingredients: string; why: string }> = {
  energy: { name: "Energy Blast", ingredients: "Carrot, Orange, Ginger, Turmeric", why: "Vitamin A and C deliver sustained energy while ginger ignites metabolism without the crash." },
  immune: { name: "Immune Shield", ingredients: "Orange, Lemon, Elderberry, Ginger", why: "High vitamin C boosts white blood cells; elderberry provides antioxidants." },
  focus: { name: "Brain Boost", ingredients: "Blueberry, Grape, Green Apple, Lemon", why: "Anthocyanins improve cognitive function and memory recall." },
  detox: { name: "Green Vitality", ingredients: "Cucumber, Spinach, Green Apple, Lemon", why: "Chlorophyll aids liver detox; cucumber hydrates deep at the cellular level." },
  stress: { name: "Calm & Restore", ingredients: "Watermelon, Mint, Coconut Water", why: "Natural sugars provide gentle energy; mint activates the parasympathetic system." },
  sleep: { name: "Twilight Elixir", ingredients: "Tart Cherry, Banana, Almond Milk", why: "Tart cherries contain natural melatonin; potassium supports overnight muscle recovery." },
  recovery: { name: "Beet Flow", ingredients: "Beet, Carrot, Lemon, Ginger", why: "Nitrates in beet support blood flow and reduce inflammation post-workout." },
  digestion: { name: "Mint Condition", ingredients: "Mint, Pineapple, Ginger, Apple", why: "Bromelain from pineapple and mint calm the gut lining for smooth digestion." },
};

const getPersonalizedBlends = (responses: string[]) => {
  const combined = responses.join(" ").toLowerCase();
  const selected: typeof juiceBlends[string][] = [];
  if (combined.match(/energy|tired|fatigue|coffee/)) selected.push(juiceBlends.energy);
  if (combined.match(/immune|sick|cold|flu/)) selected.push(juiceBlends.immune);
  if (combined.match(/focus|concentrat|work|study/)) selected.push(juiceBlends.focus);
  if (combined.match(/detox|cleanse|bloat|heavy/)) selected.push(juiceBlends.detox);
  if (combined.match(/stress|anxi|overwhelm|tension/)) selected.push(juiceBlends.stress);
  if (combined.match(/sleep|insomnia|rest|tired/)) selected.push(juiceBlends.sleep);
  if (combined.match(/workout|recover|gym|muscle/)) selected.push(juiceBlends.recovery);
  if (combined.match(/digest|gut|stomach|bloat/)) selected.push(juiceBlends.digestion);
  if (selected.length === 0) selected.push(juiceBlends.energy, juiceBlends.immune, juiceBlends.focus);
  return [...new Map(selected.map((b) => [b.name, b])).values()].slice(0, 3);
};

const getHolisticTip = (responses: string[]) => {
  const combined = responses.join(" ").toLowerCase();
  if (combined.match(/sleep|tired/)) return "Try the 4-7-8 breathing technique before bed — inhale 4, hold 7, exhale 8. It activates your parasympathetic system within minutes.";
  if (combined.match(/stress|work/)) return "A 2-minute hydration break every hour lowers cortisol. Dehydration amplifies your body's stress response by up to 30%.";
  if (combined.match(/energy|morning/)) return "10 minutes of morning sunlight regulates your circadian rhythm and naturally amplifies your energy without caffeine.";
  if (combined.match(/digest|gut/)) return "Chew each bite 20 times. Digestion starts in the mouth — this alone can reduce bloating by 40%.";
  return "Start your morning with 16oz of water before anything else. Overnight your body loses nearly a liter — rehydrating first sets the tone for everything that follows.";
};

// ── Animated Dr. Vital Avatar ──────────────────────────────────────────────
const DrVitalAvatar = ({ speaking }: { speaking: boolean }) => (
  <div className="relative flex items-center justify-center">
    {/* Outer pulse rings */}
    <div className={cn("absolute w-36 h-36 rounded-full border border-emerald-400/20 animate-ping", speaking && "border-emerald-400/40")} style={{ animationDuration: "2.5s" }} />
    <div className={cn("absolute w-28 h-28 rounded-full border border-emerald-400/30 animate-ping")} style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
    {/* Rotating ring */}
    <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/40 animate-spin" style={{ animationDuration: "12s" }} />
    {/* Glow base */}
    <div className={cn(
      "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
      "bg-gradient-to-br from-emerald-600 to-emerald-900 shadow-2xl",
      speaking ? "shadow-emerald-400/60" : "shadow-emerald-900/60"
    )}>
      {/* Inner glow when speaking */}
      {speaking && <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-pulse" />}
      {/* Face */}
      <div className="relative z-10 flex flex-col items-center gap-0.5">
        {/* Head */}
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center relative">
          {/* Eyes */}
          <div className="flex gap-1.5">
            <div className={cn("w-1 h-1 rounded-full bg-emerald-700", speaking && "animate-pulse")} />
            <div className={cn("w-1 h-1 rounded-full bg-emerald-700", speaking && "animate-pulse")} />
          </div>
          {/* Stethoscope hint */}
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-emerald-600 rounded-full" />
        </div>
        {/* Body / coat */}
        <div className="w-5 h-3 rounded-t-sm bg-white/80 flex items-center justify-center">
          <div className="w-1 h-2 bg-emerald-600 rounded-full" />
        </div>
      </div>
    </div>
    {/* Status dot */}
    <div className={cn(
      "absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-gray-900 transition-colors",
      speaking ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
    )} />
  </div>
);

// ── Typing indicator ───────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

const DrVital = () => {
  const [conversationStep, setConversationStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello, I'm Dr. Vital 👋\n\nI'm your personal holistic juice specialist. Tell me how you're feeling today — your energy, mood, symptoms, or wellness goals — and I'll prescribe the exact blends your body needs.\n\n*Not medical advice. Always consult a healthcare professional.*",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const followUpQuestions = [
    "Tell me more — what does your typical morning look like? Do you skip breakfast, rely on coffee, or eat clean?",
    "And how are your sleep and stress levels lately? Any tension, restless nights, or feeling mentally cloudy?",
  ];

  const addBotMessage = (content: string, hasButtons = false, buttons?: Message["buttons"]) => {
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        content,
        timestamp: new Date(),
        hasButtons,
        buttons,
      }]);
    }, 1200 + Math.random() * 600);
  };

  const generateBotResponse = (userInput: string, step: number) => {
    if (step === 0) {
      addBotMessage(followUpQuestions[0]);
    } else if (step === 1) {
      addBotMessage(followUpQuestions[1]);
    } else if (step === 2) {
      const allResponses = [...userResponses, userInput];
      const blends = getPersonalizedBlends(allResponses);
      const tip = getHolisticTip(allResponses);

      let content = "Based on everything you've shared, here are your **personalized NeuroJuice prescriptions**:\n\n";
      blends.forEach((blend, i) => {
        content += `**${i + 1}. ${blend.name}**\n`;
        content += `Ingredients: ${blend.ingredients}\n`;
        content += `Why it works for you: ${blend.why}\n\n`;
      });
      content += `---\n💡 **Holistic Tip:** ${tip}\n\n`;
      content += `_Ready to order these or have more questions?_`;

      addBotMessage(content, true, [
        { text: "Order These Now", action: "order" },
        { text: "Learn More About Vital Pass", action: "subscribe" },
        { text: "Ask Another Question", action: "continue" },
      ]);
    } else {
      addBotMessage("Great question! I'm always here. What else can I help you with — energy, recovery, sleep, focus? Just ask. 🌿");
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserResponses((prev) => [...prev, inputValue]);
    const currentStep = conversationStep;
    setConversationStep((s) => s + 1);
    setInputValue("");

    generateBotResponse(inputValue, currentStep);
  };

  const handleButtonClick = (action: string) => {
    if (action === "order") window.location.href = "/fuel";
    else if (action === "subscribe") window.location.href = "/vitalpass";
    else if (action === "continue") {
      setInputValue("");
      addBotMessage("Of course! What else is going on with your body or wellness goals? I'm listening.");
    }
  };

  const handleQuickResponse = (response: string) => {
    setInputValue(response);
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const italic = bold.replace(/\*(.*?)\*/g, "<em>$1</em>");
      if (line === "---") return <hr key={i} className="border-gray-600 my-2" />;
      return <p key={i} className={cn("leading-relaxed", line === "" && "h-2")} dangerouslySetInnerHTML={{ __html: italic }} />;
    });
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex-none border-b border-gray-800/80 bg-gray-950/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 z-20">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors p-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <DrVitalAvatar speaking={isBotTyping} />
          <div>
            <p className="font-bold text-white text-sm leading-tight">Dr. Vital</p>
            <p className="text-emerald-400 text-xs">{isBotTyping ? "Composing your prescription..." : "Online · Holistic Juice Specialist"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Quick-start chips — shown before first user message */}
      {userResponses.length === 0 && (
        <div className="flex-none px-4 py-3 bg-gray-950 border-b border-gray-800/50">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Quick start — tap to begin</p>
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((r) => (
              <button
                key={r}
                onClick={() => handleQuickResponse(r)}
                className="text-xs px-3 py-1.5 rounded-full border border-emerald-700/60 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 transition-colors active:scale-95"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ overscrollBehavior: "contain" }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex items-end gap-2", message.type === "user" ? "justify-end" : "justify-start")}
          >
            {message.type === "bot" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shrink-0 mb-1">
                <span className="text-white text-xs font-bold">V</span>
              </div>
            )}
            <div
              className={cn(
                "max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm space-y-1",
                message.type === "user"
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : "bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none"
              )}
            >
              <div className="space-y-1">{formatMessage(message.content)}</div>
              {message.hasButtons && message.buttons && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-700 mt-2">
                  {message.buttons.map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => handleButtonClick(btn.action)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full font-medium transition-all active:scale-95",
                        i === 0 ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "border border-gray-600 text-gray-300 hover:border-emerald-500 hover:text-emerald-300"
                      )}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.type === "user" && (
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mb-1">
                <User className="w-3.5 h-3.5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {isBotTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex-none border-t border-gray-800 bg-gray-950 px-4 py-3 pb-safe">
        <div className="flex gap-2 items-center max-w-2xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Tell Dr. Vital how you're feeling…"
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500 rounded-full h-11 px-4 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0",
              inputValue.trim() ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">Not medical advice · For wellness guidance only</p>
      </div>
    </div>
  );
};

export default DrVital;
