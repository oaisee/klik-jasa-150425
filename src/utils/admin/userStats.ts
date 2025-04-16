
import { supabase } from '@/integrations/supabase/client';

export const fetchUserStats = async () => {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    
    const totalUsers = profiles.length;
    const providers = profiles.filter(profile => profile.is_provider).length;
    const consumers = totalUsers - providers;
    
    return { totalUsers, providers, consumers };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { totalUsers: 0, providers: 0, consumers: 0 };
  }
};
