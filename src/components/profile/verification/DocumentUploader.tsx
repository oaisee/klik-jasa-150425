
import { useState } from 'react';
import { Upload, FileCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface DocumentUploaderProps {
  selectedFile: File | null;
  preview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSelection: () => void;
}

const DocumentUploader = ({
  selectedFile,
  preview,
  onFileChange,
  onClearSelection
}: DocumentUploaderProps) => {
  if (!preview && !selectedFile) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Label htmlFor="ktp-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              Klik untuk mengunggah KTP
            </span>
            <span className="text-xs text-gray-500">
              Format: JPG, PNG, atau PDF (maks. 5MB)
            </span>
          </div>
          <input 
            id="ktp-upload" 
            type="file" 
            accept="image/jpeg,image/png,application/pdf"
            className="hidden"
            onChange={onFileChange}
          />
        </Label>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg overflow-hidden">
      {preview ? (
        <img src={preview} alt="Preview KTP" className="w-full h-auto" />
      ) : (
        <div className="flex items-center justify-center p-6 bg-gray-50">
          <div className="flex flex-col items-center">
            <FileCheck className="h-12 w-12 text-blue-500 mb-2" />
            <p className="text-sm font-medium">{selectedFile?.name}</p>
            <p className="text-xs text-gray-500">
              {Math.round(selectedFile?.size ? selectedFile.size / 1024 : 0)} KB
            </p>
          </div>
        </div>
      )}
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 w-8 h-8 rounded-full"
        onClick={onClearSelection}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DocumentUploader;
