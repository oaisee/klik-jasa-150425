
import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ImageViewerControls = ({ zoom, onZoomIn, onZoomOut }: ImageViewerControlsProps) => {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2 bg-white/80 rounded-lg p-1 shadow-md">
      <Button variant="ghost" size="icon" onClick={onZoomOut} disabled={zoom <= 60}>
        <ZoomOut size={18} />
      </Button>
      <span className="flex items-center text-sm font-medium px-1">
        {zoom}%
      </span>
      <Button variant="ghost" size="icon" onClick={onZoomIn} disabled={zoom >= 200}>
        <ZoomIn size={18} />
      </Button>
    </div>
  );
};

export default ImageViewerControls;
