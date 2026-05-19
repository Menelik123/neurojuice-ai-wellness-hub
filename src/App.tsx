import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import OrderOptions from "./pages/OrderOptions";
import ExoticMenu from "./pages/ExoticMenu";
import DrVital from "./pages/DrVital";
import Menu from "./pages/Menu";
import OrderPage from "./pages/OrderPage";
import VitalPass from "./pages/VitalPass";
import JuiceDetail from "./pages/JuiceDetail";
import BundleDetail from "./pages/BundleDetail";
import Fuel from "./pages/Fuel";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminOrders from "./pages/AdminOrders";
import AdminAnalytics from "./pages/AdminAnalytics";
import MemberProfile from "./pages/MemberProfile";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminTest from "./pages/AdminTest";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <CartDrawer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/order-options" element={<OrderOptions />} />
            <Route path="/exotic-menu" element={<ExoticMenu />} />
            <Route path="/dr-vital" element={<DrVital />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/vitalpass" element={<VitalPass />} />
            <Route path="/vital-pass" element={<VitalPass />} />
            <Route path="/order/:slug" element={<OrderPage />} />
            <Route path="/juice/:slug" element={<JuiceDetail />} />
            <Route path="/bundle/:slug" element={<BundleDetail />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/profile" element={<MemberProfile />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/admin/test" element={<AdminTest />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
