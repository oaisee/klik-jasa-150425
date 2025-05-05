
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
  const [imgHeight, setImgHeight] = useState<number | null>(null);
  const { imageData, loading, error, retryCount, handleRetry } = useSupabaseImage(imageUrl);

  // Reset zoom and load state when image changes
  useEffect(() => {
    setZoom(100);
    setLoadedSuccessfully(false);
    setImgHeight(null);
  }, [imageUrl, retryCount]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Image loaded successfully", e.currentTarget.naturalHeight);
    setLoadedSuccessfully(true);
    
    // Set a minimum height for the image container based on the loaded image
    const imgElement = e.currentTarget;
    if (imgElement.naturalHeight) {
      const minHeight = Math.min(imgElement.naturalHeight, 500);
      setImgHeight(minHeight);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load in component:", e);
    setLoadedSuccessfully(false);
    // We don't call handleRetry here to avoid infinite loops
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
    <div 
      className="relative max-h-[70vh] overflow-auto bg-gray-100"
      style={{ minHeight: imgHeight ? `${imgHeight}px` : '300px' }}
    >
      {!loadedSuccessfully && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingIndicator size="lg" text="Memproses gambar..." />
        </div>
      )}
      
      <div className="flex justify-center items-center min-h-[300px]">
        <img 
          src={imageData}
          alt="KTP Document" 
          className={`max-w-full object-contain transition-all duration-200 ${!loadedSuccessfully ? 'opacity-0' : 'opacity-100'}`}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center', maxHeight: '60vh' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      {loadedSuccessfully && (
        <ImageViewerControls 
          zoom={zoom} 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut} 
        />
      )}
    </div>
  );
};

export default ImageViewer;
