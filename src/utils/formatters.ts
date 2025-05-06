
import { format } from 'date-fns';

export const formatDate = (
  date: Date | string | number | null | undefined, 
  formatString: string = 'dd MMM yyyy, HH:mm'
): string => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date instanceof Date ? date : new Date(date);
    return format(dateObj, formatString);
  } catch (err) {
    console.error('Error formatting date:', err);
    return String(date) || '-';
  }
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
