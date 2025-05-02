
import { Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewButtonProps {
  onPreviewImage: () => void;
  isPreviewLoading?: boolean;
  isDisabled: boolean;
}

const PreviewButton = ({ onPreviewImage, isPreviewLoading, isDisabled }: PreviewButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-xs flex items-center gap-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPreviewImage();
      }}
      disabled={isPreviewLoading || isDisabled}
    >
      {isPreviewLoading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Memuat...
        </>
      ) : (
        <>
          <Eye className="h-3 w-3" /> Lihat Dokumen
        </>
      )}
    </Button>
  );
};

export default PreviewButton;
