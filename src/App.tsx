
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServiceDetail from "./pages/ServiceDetail";
import WalletPage from "./pages/WalletPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import CreateService from "./pages/CreateService";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/service/:id" element={<Layout><ServiceDetail /></Layout>} />
          <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
          <Route path="/booking-confirmation/:id" element={<Layout><BookingConfirmation /></Layout>} />
          <Route path="/create-service" element={<Layout><CreateService /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
