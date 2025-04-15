
// Add verification request type to existing types
export interface VerificationRequest {
  id: string;
  user_id: string;
  document_url: string;
  document_type: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  profile?: {
    full_name?: string;
    phone?: string;
  };
}
