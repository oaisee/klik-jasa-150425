
import { useState } from 'react';
import DocumentUploader from './DocumentUploader';

interface KtpFileManagerProps {
  onFileSelect: (file: File) => void;
  setErrorMessage: (message: string | null) => void;
}

const KtpFileManager = ({ onFileSelect, setErrorMessage }: KtpFileManagerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file terlalu besar. Maksimum 5MB.");
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Format file tidak valid. Gunakan JPG, PNG, atau PDF.");
        return;
      }
      
      console.log('File selected:', file.name, 'type:', file.type, 'size:', file.size);
      
      setSelectedFile(file);
      onFileSelect(file);
      
      // Create preview (for images only)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            setPreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files (like PDFs), show a generic icon or message
        setPreview(null);
      }
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setErrorMessage(null);
  };

  return (
    <DocumentUploader 
      selectedFile={selectedFile}
      preview={preview}
      onFileChange={handleFileChange}
      onClearSelection={clearSelection}
    />
  );
};

export default KtpFileManager;
