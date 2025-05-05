
import { useState } from 'react';
import { toast } from 'sonner';
import { ensureBucketExists, uploadFileToBucket } from '@/utils/supabaseStorage';
import { checkExistingVerifications, createVerificationRequest } from '@/services/verificationService';

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
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        throw new Error("Format file tidak valid. Gunakan file JPG atau PNG.");
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");
      }
      
      console.log("File selected for upload:", selectedFile.name, "Size:", selectedFile.size, "Type:", selectedFile.type);
      
      // Step 1: Check for existing verification requests
      const { hasApproved, hasPending } = await checkExistingVerifications(userId);
      
      if (hasApproved) {
        throw new Error("Anda sudah terverifikasi sebagai penyedia jasa.");
      }
      
      if (hasPending) {
        throw new Error("Anda sudah memiliki permintaan verifikasi yang sedang diproses.");
      }
      
      // Step 2: Generate a unique filename with timestamp and user ID
      const fileExt = selectedFile.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const fileName = `ktp/${userId}-${timestamp}.${fileExt}`;
      
      console.log("Uploading file:", fileName);
      
      // Step 3: Ensure the verifications bucket exists
      const bucketReady = await ensureBucketExists('verifications');
      if (!bucketReady) {
        throw new Error('Gagal membuat bucket untuk verifikasi. Silakan coba lagi.');
      }
      
      // Step 4: Upload KTP to verifications storage bucket
      const documentUrl = await uploadFileToBucket('verifications', fileName, selectedFile);
      if (!documentUrl) {
        throw new Error("Gagal mendapatkan URL untuk file. Pastikan file dapat diupload.");
      }
      
      console.log("Successfully uploaded to URL:", documentUrl);
      
      // Step 5: Create verification request record in database
      const requestCreated = await createVerificationRequest(userId, documentUrl);
      if (!requestCreated) {
        throw new Error("Gagal membuat permintaan verifikasi. Silakan coba lagi.");
      }
      
      toast.success("Dokumen KTP berhasil diunggah. Tim kami akan memverifikasi dalam 1x24 jam.");
      console.log("KTP verification submitted successfully:", documentUrl);
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
