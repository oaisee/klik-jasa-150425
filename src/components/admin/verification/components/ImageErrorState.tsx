
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageErrorStateProps {
  onRetry: () => void;
  retryCount: number;
  publicUrl: string | null;
}

const ImageErrorState = ({ onRetry, retryCount, publicUrl }: ImageErrorStateProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-[70vh] w-full text-red-500">
      <AlertTriangle size={32} />
      <p className="mt-2 font-medium">Gagal memuat gambar</p>
      <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
        Coba muat ulang gambar atau periksa URL gambar.
      </p>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-1 mt-4"
        onClick={onRetry}
      >
        <RefreshCw size={16} /> Coba Lagi
      </Button>
      
      <Alert className="mt-4 w-full max-w-md bg-gray-50">
        <AlertDescription>
          <p className="text-xs text-gray-600 truncate">URL: {publicUrl}</p>
          <p className="text-xs text-gray-600">Percobaan ke-{retryCount + 1}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ImageErrorState;
