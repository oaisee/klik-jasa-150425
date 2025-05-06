
/**
 * Format a date string to a localized string format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

/**
 * Format a number as Rupiah currency
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
