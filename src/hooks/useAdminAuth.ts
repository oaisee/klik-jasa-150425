
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSupabaseConnection, performLogout } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    document.title = 'KlikJasa Admin Dashboard';
    
    // Check user authentication
    const checkAdmin = async () => {
      setLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!session || session.user?.email !== 'admin@klikjasa.com') {
          console.log("Admin auth failed - no session or not admin email");
          toast.error("Akses tidak diizinkan");
          navigate('/admin');
          return;
        }
        
        console.log("Admin session active:", session.user.email);
        
        // Check Supabase connection
        const status = await checkSupabaseConnection();
        setConnectionStatus(status);
      } catch (error) {
        console.error('Error checking admin session:', error);
        toast.error("Terjadi kesalahan saat memeriksa akses");
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        navigate('/admin');
      }
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple logout attempts
    
    setIsSigningOut(true);
    try {
      toast.loading("Sedang keluar...");
      
      const result = await performLogout(navigate);
      
      if (!result.success) {
        throw new Error(result.error || "Gagal logout");
      }
      
      toast.success("Logout berhasil");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Gagal logout");
      setIsSigningOut(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Check Supabase connection
      const status = await checkSupabaseConnection();
      setConnectionStatus(status);
      toast.success("Data berhasil disegarkan");
    } catch (error) {
      toast.error("Gagal menyegarkan data");
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return { 
    connectionStatus, 
    loading, 
    refreshing, 
    handleSignOut, 
    handleRefresh 
  };
};
