
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

    // Process each verification request and create signed URLs for images
    const mappedData: VerificationRequest[] = [];
    
    for (const req of requestsData || []) {
      let documentUrl = req.document_url || '';
      
      // If this is not already a signed URL, create one
      if (documentUrl && !documentUrl.includes('token=')) {
        try {
          // Extract bucket and path from URL
          if (documentUrl.includes('/storage/v1/object/public/')) {
            const urlParts = documentUrl.split('/storage/v1/object/public/');
            if (urlParts.length === 2) {
              const pathWithParams = urlParts[1].split('?')[0];
              const pathParts = pathWithParams.split('/');
              const bucket = pathParts[0];
              const filePath = pathParts.slice(1).join('/');
              
              console.log('Creating signed URL for document', bucket, filePath);
              
              // Get a signed URL with 24 hour expiry
              const { data: signedData, error: signedError } = await supabase.storage
                .from(bucket)
                .createSignedUrl(filePath, 60 * 60 * 24);
                
              if (!signedError && signedData?.signedUrl) {
                documentUrl = signedData.signedUrl;
                console.log('Created signed URL successfully');
              } else if (signedError) {
                console.error('Error creating signed URL:', signedError);
              }
            }
          }
        } catch (e) {
          console.error('Error processing document URL:', e);
        }
      }
      
      mappedData.push({
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
      });
    }
    
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
