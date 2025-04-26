
import { VerificationRequest } from '@/types/database';

export const filterVerificationRequests = (
  requests: VerificationRequest[],
  searchQuery: string,
  statusFilter: string
): VerificationRequest[] => {
  let filtered = [...requests];
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(req => req.status === statusFilter);
  }
  
  // Apply search filter (case insensitive)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(req => 
      (req.profile?.full_name?.toLowerCase().includes(query) || false) ||
      (req.profile?.phone?.toLowerCase().includes(query) || false)
    );
  }
  
  return filtered;
};
