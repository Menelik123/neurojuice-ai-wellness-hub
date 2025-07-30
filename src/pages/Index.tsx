import Header from "@/components/Header";
import Hero from "@/components/Hero";
import JuiceMenu from "@/components/JuiceMenu";
import ChatBot from "@/components/ChatBot";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import EmailCapture from "@/components/EmailCapture";
import OrderBanner from "@/components/OrderBanner";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import CookieNotice from "@/components/CookieNotice";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Juice Menu Section */}
        <JuiceMenu />
        
        {/* ChatBot Section (includes floating widget) */}
        <ChatBot />
        
        {/* Reviews Section */}
        <Reviews />
        
        {/* About Section */}
        <About />
        
        {/* Email Capture Section */}
        <EmailCapture />
        
        {/* Video Section */}
        <VideoSection />
        
        {/* Order Banner */}
        <OrderBanner />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Cookie Notice */}
      <CookieNotice />
    </div>
  );
};

export default Index;