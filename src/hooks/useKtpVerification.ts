
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToBucket, ensureBucketExists } from '@/utils/supabaseStorage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { KtpVerificationProps } from '@/types/verification';

export const useKtpVerification = ({ userId, onVerificationSubmitted, onClose }: KtpVerificationProps) => {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (file: File): Promise<boolean> => {
    if (!file) {
      setErrorMessage('Silakan pilih file KTP terlebih dahulu');
      return false;
    }

    if (!userId) {
      setErrorMessage('User ID tidak valid');
      return false;
    }

    setUploading(true);
    setErrorMessage(null);
    setSuccess(false);

    try {
      // Ensure the KTP documents bucket exists
      const bucketExists = await ensureBucketExists('ktp_documents');
      if (!bucketExists) {
        setErrorMessage('Gagal mempersiapkan penyimpanan untuk dokumen');
        setUploading(false);
        return false;
      }

      // Generate a unique filename with user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload the file to Supabase Storage
      const fileUrl = await uploadFileToBucket('ktp_documents', filePath, file);

      if (!fileUrl) {
        throw new Error('Gagal mengupload dokumen KTP');
      }

      console.log('KTP document uploaded successfully:', fileUrl);

      // Create a verification request in the database
      const { error: insertError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: userId,
          document_url: fileUrl,
          document_type: 'ktp',
          status: 'pending'
        });

      if (insertError) {
        console.error('Error creating verification request:', insertError);
        throw new Error('Gagal membuat permintaan verifikasi');
      }

      toast.success('Verifikasi KTP berhasil dikirim');
      setSuccess(true);
      onVerificationSubmitted();
      onClose();
      return true;
    } catch (err) {
      console.error('Error in KTP verification process:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses verifikasi');
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    errorMessage,
    setErrorMessage,
    success,
    handleUpload
  };
};
