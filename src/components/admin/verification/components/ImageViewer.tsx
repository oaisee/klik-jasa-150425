
import { useState, useEffect, useRef } from 'react';
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
  const [containerHeight, setContainerHeight] = useState(300);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { imageData, loading, error, retryCount, handleRetry } = useSupabaseImage(imageUrl);

  // Reset zoom and load state when image changes
  useEffect(() => {
    setZoom(100);
    setLoadedSuccessfully(false);
    setContainerHeight(300); // Reset to default height
  }, [imageUrl, retryCount]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Image loaded successfully", e.currentTarget.naturalHeight, e.currentTarget.naturalWidth);
    setLoadedSuccessfully(true);
    
    // Set container height based on image size
    const imgElement = e.currentTarget;
    if (imgElement.naturalHeight) {
      // Set minimum height of 300px or the image height, whichever is larger
      const newHeight = Math.max(imgElement.naturalHeight, 300);
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
        minHeight: `${containerHeight}px`, 
        maxHeight: '70vh' 
      }}
    >
      {!loadedSuccessfully && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingIndicator size="lg" text="Memproses gambar..." />
        </div>
      )}
      
      <div className="flex justify-center items-center min-h-[300px] p-4">
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
