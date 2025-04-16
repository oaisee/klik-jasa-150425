
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewDialog = ({ isOpen, onClose, imageUrl }: ImagePreviewDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  // Reset loading and error state when dialog opens or image changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    } else {
      setLoading(true);
      setError(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Dokumen KTP</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          {imageUrl && (
            <>
              {loading && (
                <div className="flex justify-center items-center h-[70vh] w-full">
                  <LoadingIndicator size="lg" text="Memuat gambar..." />
                </div>
              )}
              {error ? (
                <div className="flex flex-col justify-center items-center h-[70vh] w-full text-red-500">
                  <span className="text-xl">⚠️</span>
                  <p className="mt-2">Gagal memuat gambar. URL mungkin tidak valid.</p>
                </div>
              ) : (
                <img 
                  src={imageUrl} 
                  alt="KTP Document" 
                  className={`max-w-full max-h-[70vh] object-contain ${loading ? 'hidden' : 'block'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
