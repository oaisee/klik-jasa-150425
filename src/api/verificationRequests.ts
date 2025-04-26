
import { supabase } from '@/integrations/supabase/client';
import { VerificationRequest } from '@/types/database';
import { toast } from 'sonner';

export const fetchVerificationRequestsApi = async () => {
  console.log('Fetching verification requests');
  
  const { data, error } = await supabase
    .from('verification_requests')
    .select(`
      *,
      profile:profiles(id, full_name, phone)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching verification requests:', error);
    throw error;
  }
  
  return (data || []).map(req => ({
    ...req,
    profile: req.profile || undefined
  })) as VerificationRequest[];
};

export const approveVerificationApi = async (id: string, userId: string) => {
  console.log('Approving verification request:', id);
  
  // Update verification status to approved
  const { error: verificationError } = await supabase
    .from('verification_requests')
    .update({ 
      status: 'approved', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (verificationError) {
    console.error('Error updating verification status:', verificationError);
    throw verificationError;
  }
  
  // Update profile table to mark user as provider
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_provider: true })
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating user profile:', profileError);
    throw profileError;
  }
};

export const rejectVerificationApi = async (id: string, notes?: string) => {
  console.log('Rejecting verification request:', id);
  
  const { error } = await supabase
    .from('verification_requests')
    .update({ 
      status: 'rejected', 
      notes: notes || null,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) {
    console.error('Error rejecting verification:', error);
    throw error;
  }
};
