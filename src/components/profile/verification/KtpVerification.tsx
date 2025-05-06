
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import VerificationInstructions from './VerificationInstructions';
import ErrorDisplay from './ErrorDisplay';
import KtpFileManager from './KtpFileManager';
import { useKtpVerification } from '@/hooks/useKtpVerification';
import { KtpVerificationProps } from '@/types/verification';

const KtpVerification = ({ 
  userId,
  onVerificationSubmitted,
  onClose 
}: KtpVerificationProps) => {
  const {
    uploading,
    errorMessage,
    setErrorMessage,
    handleUpload
  } = useKtpVerification({ userId, onVerificationSubmitted, onClose });

  const [selectedFileForUpload, setSelectedFileForUpload] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFileForUpload(file);
  };

  const handleSubmit = () => {
    if (selectedFileForUpload) {
      handleUpload(selectedFileForUpload);
    }
  };

  return (
    <div className="space-y-4 py-3">
      <VerificationInstructions />
      <ErrorDisplay message={errorMessage} />
      
      <KtpFileManager 
        onFileSelect={handleFileSelect}
        setErrorMessage={setErrorMessage}
      />
      
      <DialogFooter className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Batal
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFileForUpload || uploading}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengunggah...
            </>
          ) : (
            'Kirim Verifikasi'
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default KtpVerification;
