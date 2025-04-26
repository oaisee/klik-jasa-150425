
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSupabaseConnection, performLogout } from '@/integrations/supabase/client';
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
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session || data.session.user?.email !== 'admin@klikjasa.com') {
          toast.error("Akses tidak diizinkan");
          navigate('/admin');
          return;
        }
        
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
  }, [navigate]);

  const handleSignOut = async () => {
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
