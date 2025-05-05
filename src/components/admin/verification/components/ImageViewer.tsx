
import { useState } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import ImageViewerControls from './ImageViewerControls';
import ImageErrorState from './ImageErrorState';
import { useSupabaseImage } from '@/hooks/useSupabaseImage';

interface ImageViewerProps {
  imageUrl: string | null;
}

const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const { imageData, loading, error, retryCount, handleRetry } = useSupabaseImage(imageUrl);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageData);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 60));
  };

  if (!imageUrl) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] w-full text-gray-500">
        <p>Tidak ada URL gambar yang valid</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] w-full">
        <LoadingIndicator size="lg" text="Memuat gambar..." />
      </div>
    );
  }

  if (error) {
    return <ImageErrorState 
      onRetry={handleRetry} 
      retryCount={retryCount}
      publicUrl={imageData || imageUrl}
    />;
  }

  return (
    <div className="overflow-auto max-h-[70vh] relative">
      {imageData && (
        <img 
          src={imageData}
          alt="KTP Document" 
          className="mx-auto object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      <ImageViewerControls 
        zoom={zoom} 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
      />
    </div>
  );
};

export default ImageViewer;
