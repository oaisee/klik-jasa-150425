
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date with configurable output format
export const formatDate = (dateString?: string, format: 'short' | 'long' = 'long') => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (format === 'short') {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format relative time (time ago)
export const formatTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 30) {
      return formatDate(dateString, 'short');
    } else if (diffDay > 0) {
      return `${diffDay} hari lalu`;
    } else if (diffHour > 0) {
      return `${diffHour} jam lalu`;
    } else if (diffMin > 0) {
      return `${diffMin} menit lalu`;
    } else {
      return 'Baru saja';
    }
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return dateString;
  }
};
