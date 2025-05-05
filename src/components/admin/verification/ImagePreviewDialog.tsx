
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ImageViewer from './components/ImageViewer';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, X } from 'lucide-react';

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
      // Add cache busting parameter to force fresh image load
      const url = imageUrl.includes('?') 
        ? `${imageUrl}&_=${Date.now()}` 
        : `${imageUrl}?_=${Date.now()}`;
      
      setProcessingUrl(url);
    }
  }, [isOpen, imageUrl, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    
    // Generate a new URL with updated timestamp
    if (imageUrl) {
      const baseUrl = imageUrl.split('?')[0];
      const refreshedUrl = `${baseUrl}?_=${Date.now()}`;
      setProcessingUrl(refreshedUrl);
    }
    
    toast.info("Mencoba memuat ulang gambar...");
  };
  
  const handleDownload = async () => {
    if (!processingUrl) return;
    
    try {
      // Fetch the image
      const response = await fetch(processingUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Extract filename from URL or use default
      const filename = processingUrl.split('/').pop() || 'ktp-document.jpg';
      a.download = filename;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Dokumen berhasil diunduh");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Gagal mengunduh dokumen");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Dokumen KTP</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="flex items-center gap-1"
              >
                <RefreshCw size={14} className="mr-1" />
                Muat Ulang
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1"
                disabled={!processingUrl}
              >
                <Download size={14} className="mr-1" />
                Unduh
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative overflow-hidden border-t border-b bg-gray-50">
          <ImageViewer 
            imageUrl={processingUrl} 
            key={`image-viewer-${retryCount}`} 
          />
        </div>
        
        <div className="p-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X size={14} className="mr-2" /> Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
