
export interface VerificationStatus {
  hasExisting: boolean;
  hasApproved: boolean;
  hasPending: boolean;
}

export interface KtpVerificationProps {
  userId: string;
  onVerificationSubmitted: () => void;
  onClose: () => void;
}

export interface KtpFileManagerProps {
  onFileSelect: (file: File) => void;
  setErrorMessage: (message: string | null) => void;
}
