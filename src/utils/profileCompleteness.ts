
import { supabase } from '@/integrations/supabase/client';

export const checkProfileCompleteness = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, phone, address, bio, avatar_url')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Check if essential fields are filled
    const isComplete = !!(
      data.full_name &&
      data.phone &&
      data.address &&
      data.bio
    );

    return {
      isComplete,
      profileData: data
    };
  } catch (error) {
    console.error('Error checking profile:', error);
    return {
      isComplete: false,
      profileData: null
    };
  }
};
