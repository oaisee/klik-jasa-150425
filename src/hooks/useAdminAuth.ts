
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = 'KlikJasa Admin Dashboard';
    
    // Check user authentication
    const checkAdmin = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (!data.session || data.session.user?.email !== 'admin@klikjasa.com') {
        toast.error("Akses tidak diizinkan");
        navigate('/admin');
        return;
      }
      
      // Check Supabase connection
      const status = await checkSupabaseConnection();
      setConnectionStatus(status);
      setLoading(false);
    };
    
    checkAdmin();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("Logout berhasil");
      
      // Add a slight delay before navigation to ensure session is cleared
      setTimeout(() => {
        navigate('/login', { replace: true });
        window.location.reload(); // Force reload to clear any cached state
      }, 300);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Gagal logout");
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
