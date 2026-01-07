import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OrderOptions from "./pages/OrderOptions";
import ExoticMenu from "./pages/ExoticMenu";
import DrVital from "./pages/DrVital";
import Menu from "./pages/Menu";
import OrderPage from "./pages/OrderPage";
import VitalPass from "./pages/VitalPass";
import JuiceDetail from "./pages/JuiceDetail";
import BundleDetail from "./pages/BundleDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order-options" element={<OrderOptions />} />
          <Route path="/exotic-menu" element={<ExoticMenu />} />
          <Route path="/dr-vital" element={<DrVital />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/vitalpass" element={<VitalPass />} />
          <Route path="/order/:slug" element={<OrderPage />} />
          <Route path="/juice/:slug" element={<JuiceDetail />} />
          <Route path="/bundle/:slug" element={<BundleDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
