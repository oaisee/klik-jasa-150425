
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServiceDetail from "./pages/ServiceDetail";
import WalletPage from "./pages/WalletPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import CreateService from "./pages/CreateService";
import SearchPage from "./pages/SearchPage";
import BookingsPage from "./pages/BookingsPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";
import NotificationsPage from "./pages/NotificationsPage";
import SecurityPage from "./pages/SecurityPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import EditProfilePage from "./pages/EditProfilePage";
import ProviderModePage from "./pages/ProviderModePage";
import SplashScreen from "./components/SplashScreen";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminAuthPage from "./pages/AdminAuthPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      // Check if user is logged in
      if (data.session) {
        setAuthenticated(true);
        
        // Check if user is admin
        if (data.session.user?.email === 'admin@klikjasa.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setAuthenticated(false);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };
    
    checkUserSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (session) {
        setAuthenticated(true);
        setIsAdmin(session.user?.email === 'admin@klikjasa.com');
      } else {
        setAuthenticated(false);
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Show loading indicator while checking session
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAuthPage />} />
          <Route path="/admin-dashboard/*" element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin" />} />
          
          {/* User Routes */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/search" element={<Layout><SearchPage /></Layout>} />
          <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
          <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/service/:id" element={<Layout><ServiceDetail /></Layout>} />
          <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
          <Route path="/booking-confirmation/:id" element={<Layout><BookingConfirmation /></Layout>} />
          <Route path="/create-service" element={<Layout><CreateService /></Layout>} />
          <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
          <Route path="/security" element={<Layout><SecurityPage /></Layout>} />
          <Route path="/payment-methods" element={<Layout><PaymentMethodsPage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="/help" element={<Layout><HelpPage /></Layout>} />
          <Route path="/edit-profile" element={<Layout><EditProfilePage /></Layout>} />
          <Route path="/provider-mode" element={<Layout><ProviderModePage /></Layout>} />
          <Route path="*" element={<NotFound />} />
          {/* Default route redirecting to home or splash screen based on authentication */}
          <Route index element={<Navigate to={authenticated ? "/" : "/splash"} replace />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
