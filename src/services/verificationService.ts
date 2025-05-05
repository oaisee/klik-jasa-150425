
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Check if a user has existing verification requests
 * @param userId User ID to check
 * @returns Object containing verification status information
 */
export const checkExistingVerifications = async (userId: string) => {
  try {
    console.log('Checking for existing verification requests for user:', userId);
    
    const { data: existingVerifications, error: fetchError } = await supabase
      .from('verification_requests')
      .select('id, status')
      .eq('user_id', userId);
    
    if (fetchError) {
      console.error('Error checking existing verification requests:', fetchError);
      throw new Error('Gagal memeriksa verifikasi yang sudah ada. Silakan coba lagi.');
    }
    
    console.log('Existing verification requests:', existingVerifications);
    
    // Filter for pending or approved verifications
    const pendingOrApprovedVerifications = existingVerifications?.filter(v => 
      v.status === 'pending' || v.status === 'approved'
    ) || [];
    
    const hasApproved = pendingOrApprovedVerifications.some(v => v.status === 'approved');
    const hasPending = pendingOrApprovedVerifications.some(v => v.status === 'pending');
    
    return { 
      hasExisting: pendingOrApprovedVerifications.length > 0,
      hasApproved,
      hasPending
    };
  } catch (error) {
    console.error('Error in checkExistingVerifications:', error);
    throw error;
  }
};

/**
 * Creates a verification request record in the database
 * @param userId User ID
 * @param documentUrl URL of the uploaded document
 * @returns Boolean indicating success
 */
export const createVerificationRequest = async (
  userId: string,
  documentUrl: string
): Promise<boolean> => {
  try {
    const { error: dbError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: userId,
        document_url: documentUrl,
        status: 'pending',
        document_type: 'ktp'
      });
      
    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating verification request:', error);
    return false;
  }
};
