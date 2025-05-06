
import { useState, useEffect, useRef } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import ImageViewerControls from './ImageViewerControls';
import ImageErrorState from './ImageErrorState';
import { useSupabaseImage } from '@/hooks/useSupabaseImage';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageViewerProps {
  imageUrl: string | null;
}

const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [loadedSuccessfully, setLoadedSuccessfully] = useState(false);
  const [containerHeight, setContainerHeight] = useState(400);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { imageData, loading, error, retryCount, handleRetry } = useSupabaseImage(imageUrl);

  // Reset zoom and load state when image changes
  useEffect(() => {
    setZoom(100);
    setLoadedSuccessfully(false);
    setContainerHeight(400); // Reset to default height
  }, [imageUrl, retryCount]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Image loaded successfully");
    setLoadedSuccessfully(true);
    
    // Set container height based on image size
    const imgElement = e.currentTarget;
    if (imgElement.naturalHeight) {
      // Set minimum height of 400px or the image height + padding, whichever is larger
      const newHeight = Math.max(imgElement.naturalHeight + 80, 400);
      setContainerHeight(newHeight);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load in component:", e);
    setLoadedSuccessfully(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 60));
  };

  if (!imageUrl) {
    return (
      <div className="flex flex-col justify-center items-center h-[400px] w-full text-gray-500">
        <p>Tidak ada URL gambar yang valid</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <div className="text-center">
          <LoadingIndicator size="lg" text="Memuat gambar..." />
          <p className="text-xs text-gray-500 mt-4">Memuat dari URL yang diberikan...</p>
        </div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <ImageErrorState 
        onRetry={handleRetry} 
        retryCount={retryCount}
        publicUrl={imageData || imageUrl}
      />
    );
  }

  return (
    <div 
      className="relative overflow-auto bg-gray-100"
      style={{ 
        height: `${containerHeight}px`, 
        minHeight: '400px',
        maxHeight: '70vh' 
      }}
    >
      {!loadedSuccessfully && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <LoadingIndicator size="lg" text="Memproses gambar..." />
        </div>
      )}
      
      <div className="flex justify-center items-center min-h-[400px] p-4">
        {!loadedSuccessfully && (
          <Skeleton className="w-4/5 h-4/5 max-w-xl" />
        )}
        
        <img 
          ref={imgRef}
          src={imageData}
          alt="Dokumen KTP" 
          className={`max-w-full transition-all duration-200 ${!loadedSuccessfully ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            transform: `scale(${zoom / 100})`, 
            transformOrigin: 'center',
            maxHeight: '60vh'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
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
