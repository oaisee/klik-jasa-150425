
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, performLogout } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProviderAuth = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const checkAuth = async () => {
    try {
      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        navigate('/login');
        return null;
      }
      
      if (!session) {
        console.log("No active session found");
        navigate('/login');
        return null;
      }
      
      console.log("Provider auth - session active:", session.user.id);
      
      // Set user ID
      setUserId(session.user.id);
      
      // Check if user is a provider
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_provider')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      // Check if user is a provider
      if (!profile?.is_provider) {
        console.log("User is not a provider");
        toast.error("Anda perlu mengaktifkan mode penyedia layanan terlebih dahulu");
        navigate('/profile');
        return null;
      }
      
      return session.user.id;
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error("Terjadi kesalahan saat memeriksa autentikasi");
      navigate('/login');
      return null;
    }
  };
  
  useEffect(() => {
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Provider auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    try {
      toast.loading("Sedang keluar...");
      
      const result = await performLogout(navigate);
      
      if (!result.success) {
        throw new Error(result.error || "Gagal logout");
      }
      
      toast.success("Berhasil keluar");
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Gagal keluar");
      setIsLoggingOut(false);
    }
  };

  return {
    userId,
    checkAuth,
    handleLogout
  };
};
