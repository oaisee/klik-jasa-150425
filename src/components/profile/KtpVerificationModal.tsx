
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;
    
    setUploading(true);
    try {
      // Upload KTP to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `ktp/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
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
    } catch (error) {
      console.error('Error uploading KTP:', error);
      toast.error("Gagal mengunggah KTP. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Verifikasi KTP</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <p className="text-sm text-gray-600">
            Untuk menjadi penyedia jasa, Anda perlu memverifikasi identitas dengan mengunggah foto KTP Anda.
            Pastikan foto KTP jelas dan semua informasi dapat terbaca.
          </p>
          
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Label htmlFor="ktp-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-2">
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
              <img src={preview} alt="Preview KTP" className="w-full h-auto" />
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Batal
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
              className="flex items-center gap-2"
            >
              {uploading ? 'Mengunggah...' : 'Kirim Verifikasi'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KtpVerificationModal;
