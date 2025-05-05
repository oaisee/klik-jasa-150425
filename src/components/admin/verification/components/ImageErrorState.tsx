
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageErrorStateProps {
  onRetry: () => void;
  retryCount: number;
  publicUrl: string | null;
}

const ImageErrorState = ({ onRetry, retryCount, publicUrl }: ImageErrorStateProps) => {
  const handleOpenInNewTab = () => {
    if (publicUrl) {
      // Add cache busting parameter to force fresh image load
      const timestamp = Date.now();
      const url = publicUrl.includes('?') 
        ? `${publicUrl}&_=${timestamp}` 
        : `${publicUrl}?_=${timestamp}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] w-full text-red-500 p-6">
      <AlertTriangle size={32} />
      <p className="mt-2 font-medium">Gagal memuat gambar</p>
      <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
        Sistem gagal memuat gambar KTP. Kemungkinan bucket storage belum dibuat atau masalah akses file.
      </p>
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="default" 
          className="flex items-center gap-1"
          onClick={onRetry}
        >
          <RefreshCw size={16} /> Coba Lagi ({retryCount + 1})
        </Button>
        
        {publicUrl && (
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink size={16} /> Buka di Tab Baru
          </Button>
        )}
      </div>
      
      <Alert className="mt-4 w-full max-w-md bg-gray-50">
        <AlertDescription className="text-xs">
          <p className="text-gray-600 text-wrap break-all">URL: {publicUrl || "Tidak tersedia"}</p>
          <p className="text-gray-600">Percobaan ke-{retryCount + 1}</p>
          <p className="text-gray-600 mt-1">
            Pastikan bucket 'verifications' sudah dibuat di Supabase Storage dan memiliki akses publik
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ImageErrorState;
