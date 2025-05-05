
import { Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewButtonProps {
  onPreviewImage: () => void;
  isPreviewLoading?: boolean;
  isDisabled: boolean;
  documentUrl?: string;
}

const PreviewButton = ({ 
  onPreviewImage, 
  isPreviewLoading, 
  isDisabled,
  documentUrl 
}: PreviewButtonProps) => {
  const hasDocument = documentUrl && documentUrl.trim() !== '';

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-xs flex items-center gap-1 hover:bg-blue-50"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPreviewImage();
      }}
      disabled={isPreviewLoading || isDisabled || !hasDocument}
      title={!hasDocument ? "Dokumen tidak tersedia" : "Lihat dokumen KTP"}
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
