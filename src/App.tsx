
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
      try {
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
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
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
        <Routes>
          {/* Public routes */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAuthPage />} />
          <Route path="/admin-dashboard/*" element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin" />} />
          
          {/* Protected user routes */}
          <Route path="/" element={
            authenticated ? <Layout><Index /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/search" element={
            authenticated ? <Layout><SearchPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/bookings" element={
            authenticated ? <Layout><BookingsPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/chat" element={
            authenticated ? <Layout><ChatPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/profile" element={
            authenticated ? <Layout><ProfilePage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/service/:id" element={
            authenticated ? <Layout><ServiceDetail /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/wallet" element={
            authenticated ? <Layout><WalletPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/booking-confirmation/:id" element={
            authenticated ? <Layout><BookingConfirmation /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/create-service" element={
            authenticated ? <Layout><CreateService /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/notifications" element={
            authenticated ? <Layout><NotificationsPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/security" element={
            authenticated ? <Layout><SecurityPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/payment-methods" element={
            authenticated ? <Layout><PaymentMethodsPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/settings" element={
            authenticated ? <Layout><SettingsPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/help" element={
            authenticated ? <Layout><HelpPage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/edit-profile" element={
            authenticated ? <Layout><EditProfilePage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="/provider-mode" element={
            authenticated ? <Layout><ProviderModePage /></Layout> : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<NotFound />} />
          
          {/* Default route - redirect based on authentication status */}
          <Route index element={<Navigate to={authenticated ? "/" : "/login"} replace />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
