
import { supabase } from '@/integrations/supabase/client';
import { VerificationRequest } from '@/types/database';
import { toast } from 'sonner';

export const fetchVerificationRequestsApi = async () => {
  console.log('Fetching verification requests');
  
  try {
    // First fetch the verification requests
    const { data: requestsData, error: requestsError } = await supabase
      .from('verification_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (requestsError) {
      throw requestsError;
    }

    // Then fetch the profiles separately to get user information
    const userIds = requestsData.map(req => req.user_id);
    
    // Only fetch profiles if there are verification requests
    if (userIds.length === 0) {
      return [];
    }
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .in('id', userIds);

    if (profilesError) {
      throw profilesError;
    }

    // Create a map of profiles by user_id for easy access
    const profileMap = (profilesData || []).reduce((acc: Record<string, any>, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});

    // Transform the data to match our VerificationRequest type
    const mappedData: VerificationRequest[] = (requestsData || []).map(req => {
      // Ensure we have a valid document URL
      let documentUrl = req.document_url || '';
      
      // Add cache busting parameter to force reload of images
      if (documentUrl) {
        documentUrl = documentUrl.includes('?') 
          ? `${documentUrl}&t=${Date.now()}` 
          : `${documentUrl}?t=${Date.now()}`;
      }
      
      return {
        id: req.id,
        user_id: req.user_id || '',
        document_url: documentUrl,
        document_type: req.document_type,
        status: (req.status as 'pending' | 'approved' | 'rejected'),
        notes: req.notes || undefined,
        created_at: req.created_at || undefined,
        updated_at: req.updated_at || undefined,
        profile: profileMap[req.user_id] || {
          id: req.user_id,
          full_name: 'Unknown User',
          phone: ''
        }
      };
    });
    
    return mappedData;
  } catch (error) {
    console.error('Error fetching verification requests:', error);
    throw error;
  }
};

export const approveVerificationApi = async (id: string, userId: string) => {
  console.log('Approving verification request:', id);
  
  // Update verification request status to approved
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
