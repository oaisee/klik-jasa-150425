
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useProviderAuth = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return null;
      }
      
      // Set user ID
      setUserId(session.user.id);
      
      // Check if user is a provider
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_provider')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      // Check if user is a provider
      if (!profile.is_provider) {
        navigate('/profile');
        return null;
      }
      
      return session.user.id;
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
      return null;
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, [navigate]);

  return {
    userId,
    checkAuth
  };
};
