import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToBucket, ensureBucketExists } from '@/utils/supabaseStorage';
import { v4 as uuidv4 } from 'uuid';

export const useKtpVerification = (userId: string) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const uploadKtpDocument = async (): Promise<boolean> => {
    if (!selectedFile) {
      setError('Silakan pilih file KTP terlebih dahulu');
      return false;
    }

    if (!userId) {
      setError('User ID tidak valid');
      return false;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Ensure the KTP documents bucket exists
      const bucketExists = await ensureBucketExists('ktp_documents');
      if (!bucketExists) {
        setError('Gagal mempersiapkan penyimpanan untuk dokumen');
        setUploading(false);
        return false;
      }

      // Generate a unique filename with user ID and timestamp
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}_${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload the file to Supabase Storage
      const fileUrl = await uploadFileToBucket('ktp_documents', filePath, selectedFile);

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

      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Error in KTP verification process:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses verifikasi');
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    success,
    selectedFile,
    handleFileSelect,
    uploadKtpDocument,
    setError
  };
};
