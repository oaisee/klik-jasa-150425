
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Upload, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface KtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onVerificationSubmitted: () => void;
}

const KtpVerificationModal = ({ 
  isOpen, 
  onClose, 
  userId,
  onVerificationSubmitted 
}: KtpVerificationModalProps) => {
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

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;
    
    setUploading(true);
    setErrorMessage(null);
    
    try {
      // Check if user already has a pending verification - directly access verification_requests
      const { data: existingVerifications, error: fetchError } = await supabase
        .from('verification_requests')
        .select('status')
        .eq('user_id', userId)
        .in('status', ['pending', 'approved']);
      
      if (fetchError) throw fetchError;
      
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
      
      // Upload KTP to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `ktp/${fileName}`;
      
      // Ensure the verifications bucket exists
      const { error: storageError } = await supabase.storage
        .from('verifications')
        .upload(filePath, selectedFile);
        
      if (storageError) throw storageError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('verifications')
        .getPublicUrl(filePath);
      
      // Create verification request in database
      const { error: dbError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: userId,
          document_url: urlData.publicUrl,
          status: 'pending',
          document_type: 'ktp'
        });
        
      if (dbError) throw dbError;
      
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

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setErrorMessage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Verifikasi KTP</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 space-y-2">
            <p className="font-medium">Petunjuk Verifikasi KTP:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pastikan foto KTP jelas dan semua informasi dapat terbaca</li>
              <li>File dalam format JPG, PNG, atau PDF (maksimal 5MB)</li>
              <li>Verifikasi biasanya membutuhkan waktu 1x24 jam</li>
              <li>Anda akan menerima notifikasi setelah verifikasi selesai</li>
            </ul>
          </div>
          
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {!preview && !selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Label htmlFor="ktp-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Klik untuk mengunggah KTP
                  </span>
                  <span className="text-xs text-gray-500">
                    Format: JPG, PNG, atau PDF (maks. 5MB)
                  </span>
                </div>
                <input 
                  id="ktp-upload" 
                  type="file" 
                  accept="image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
          ) : (
            <div className="relative border rounded-lg overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview KTP" className="w-full h-auto" />
              ) : (
                <div className="flex items-center justify-center p-6 bg-gray-50">
                  <div className="flex flex-col items-center">
                    <FileCheck className="h-12 w-12 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">{selectedFile?.name}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round(selectedFile?.size ? selectedFile.size / 1024 : 0)} KB
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-8 h-8 rounded-full"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
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
      </DialogContent>
    </Dialog>
  );
};

export default KtpVerificationModal;
