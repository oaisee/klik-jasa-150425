
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ImageViewer from './components/ImageViewer';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewDialog = ({ isOpen, onClose, imageUrl }: ImagePreviewDialogProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [processingUrl, setProcessingUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen && imageUrl) {
      setProcessingUrl(imageUrl);
    }
  }, [isOpen, imageUrl]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Mencoba memuat ulang gambar...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Dokumen KTP</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="flex items-center gap-1"
            >
              <RefreshCw size={14} className="mr-1" />
              Muat Ulang
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <ImageViewer 
            imageUrl={processingUrl} 
            key={`image-viewer-${retryCount}`} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
