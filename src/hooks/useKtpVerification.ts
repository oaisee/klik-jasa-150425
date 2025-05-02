
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseKtpVerificationProps {
  userId: string;
  onVerificationSubmitted: () => void;
  onClose: () => void;
}

export const useKtpVerification = ({ 
  userId, 
  onVerificationSubmitted, 
  onClose 
}: UseKtpVerificationProps) => {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile || !userId) return;
    
    setUploading(true);
    setErrorMessage(null);
    
    try {
      // Check for existing verification requests
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
      
      if (pendingOrApprovedVerifications.length > 0) {
        const hasApproved = pendingOrApprovedVerifications.some(v => v.status === 'approved');
        const hasPending = pendingOrApprovedVerifications.some(v => v.status === 'pending');
        
        if (hasApproved) {
          throw new Error("Anda sudah terverifikasi sebagai penyedia jasa.");
        }
        
        if (hasPending) {
          throw new Error("Anda sudah memiliki permintaan verifikasi yang sedang diproses.");
        }
      }
      
      // Check if the 'verifications' bucket exists
      console.log('Checking if verifications bucket exists...');
      const { data: buckets, error: bucketListError } = await supabase.storage
        .listBuckets();
        
      if (bucketListError) {
        console.error('Error checking buckets:', bucketListError);
        throw new Error('Gagal memeriksa storage bucket. Silakan coba lagi.');
      }
      
      const verificationsBucketExists = buckets?.some(bucket => bucket.name === 'verifications');
      
      if (!verificationsBucketExists) {
        console.error('Verifications bucket does not exist, this should have been created during setup');
        throw new Error('Bucket penyimpanan verifikasi tidak tersedia. Silakan hubungi administrator.');
      }
      
      // Upload KTP to verifications storage bucket
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `ktp/${fileName}`;
      
      console.log('Uploading to bucket: verifications, path:', filePath);
      
      // Proceed with upload
      const { error: storageError, data: uploadData } = await supabase.storage
        .from('verifications')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (storageError) {
        console.error('Storage upload error:', storageError);
        throw storageError;
      }
      
      console.log('Upload successful, getting public URL');
      
      // Try to get a signed URL first (for better security and guaranteed access)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('verifications')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
        
      let documentUrl;
      if (signedUrlData && !signedUrlError) {
        documentUrl = signedUrlData.signedUrl;
        console.log('Using signed URL for verification record:', documentUrl);
      } else {
        // Fall back to public URL if signed URL fails
        const { data: publicUrlData } = supabase.storage
          .from('verifications')
          .getPublicUrl(filePath);
        
        documentUrl = publicUrlData?.publicUrl;
        console.log('Using public URL for verification record:', documentUrl);
      }
      
      if (!documentUrl) {
        throw new Error("Gagal mendapatkan URL untuk file.");
      }
      
      // Create verification request record
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
      
      toast.success("Dokumen KTP berhasil diunggah. Tim kami akan memverifikasi dalam 1x24 jam.");
      onVerificationSubmitted();
      onClose();
    } catch (error: any) {
      console.error('Error uploading KTP:', error);
      setErrorMessage(error.message || "Gagal mengunggah KTP. Silakan coba lagi.");
      toast.error(error.message || "Gagal mengunggah KTP. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    errorMessage,
    setErrorMessage,
    handleUpload
  };
};
