
import { useState, useEffect } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import ImageViewerControls from './ImageViewerControls';
import ImageErrorState from './ImageErrorState';
import { useSupabaseImage } from '@/hooks/useSupabaseImage';

interface ImageViewerProps {
  imageUrl: string | null;
}

const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [loadedSuccessfully, setLoadedSuccessfully] = useState(false);
  const { imageData, loading, error, retryCount, handleRetry } = useSupabaseImage(imageUrl);

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(100);
    setLoadedSuccessfully(false);
  }, [imageUrl, retryCount]);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setLoadedSuccessfully(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load in component:", e);
    // We don't call handleRetry here to avoid infinite loops
    // The user can click the retry button instead
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

  if (error || !imageData) {
    return <ImageErrorState 
      onRetry={handleRetry} 
      retryCount={retryCount}
      publicUrl={imageData || imageUrl}
    />;
  }

  return (
    <div className="overflow-auto max-h-[70vh] relative">
      <img 
        src={imageData}
        alt="KTP Document" 
        className={`mx-auto object-contain transition-transform duration-200 ${!loadedSuccessfully ? 'opacity-0' : 'opacity-100'}`}
        style={{ transform: `scale(${zoom / 100})` }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {loadedSuccessfully && (
        <ImageViewerControls 
          zoom={zoom} 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut} 
        />
      )}
      
      {!loadedSuccessfully && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingIndicator size="lg" text="Sedang memproses gambar..." />
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
