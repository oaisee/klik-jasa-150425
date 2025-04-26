
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import DocumentUploader from './DocumentUploader';
import VerificationInstructions from './VerificationInstructions';
import ErrorDisplay from './ErrorDisplay';

interface KtpVerificationProps {
  userId: string;
  onVerificationSubmitted: () => void;
  onClose: () => void;
}

const KtpVerification = ({ 
  userId,
  onVerificationSubmitted,
  onClose 
}: KtpVerificationProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file terlalu besar. Maksimum 5MB.");
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Format file tidak valid. Gunakan JPG, PNG, atau PDF.");
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview (for images only)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDF, just show an icon or placeholder
        setPreview(null);
      }
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setErrorMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;
    
    setUploading(true);
    setErrorMessage(null);
    
    try {
      // Periksa verification_requests table saja, tanpa mengakses auth.users
      const { data: existingVerifications, error: fetchError } = await supabase
        .from('verification_requests')
        .select('status')
        .eq('user_id', userId)
        .in('status', ['pending', 'approved']);
      
      if (fetchError) {
        console.error('Error checking verification requests:', fetchError);
        throw fetchError;
      }
      
      console.log('Existing verification requests:', existingVerifications);
      
      if (existingVerifications && existingVerifications.length > 0) {
        const hasApproved = existingVerifications.some(v => v.status === 'approved');
        const hasPending = existingVerifications.some(v => v.status === 'pending');
        
        if (hasApproved) {
          throw new Error("Anda sudah terverifikasi sebagai penyedia jasa.");
        }
        
        if (hasPending) {
          throw new Error("Anda sudah memiliki permintaan verifikasi yang sedang diproses.");
        }
      }
      
      // Upload KTP to verifications storage bucket in Supabase
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `ktp/${fileName}`;
      
      console.log('Uploading to bucket: verifications, path:', filePath);
      
      // Upload to verifications bucket
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
      
      // Get public URL for admin review
      const { data: urlData } = supabase.storage
        .from('verifications')
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        throw new Error("Gagal mendapatkan URL publik untuk file.");
      }
      
      console.log('Public URL:', urlData.publicUrl);
      
      // Create verification request record in database with pending status
      const { error: dbError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: userId,
          document_url: urlData.publicUrl,
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

  return (
    <div className="space-y-4 py-3">
      <VerificationInstructions />
      <ErrorDisplay message={errorMessage} />
      
      <DocumentUploader 
        selectedFile={selectedFile}
        preview={preview}
        onFileChange={handleFileChange}
        onClearSelection={clearSelection}
      />
      
      <DialogFooter className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Batal
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengunggah...
            </>
          ) : (
            'Kirim Verifikasi'
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default KtpVerification;
