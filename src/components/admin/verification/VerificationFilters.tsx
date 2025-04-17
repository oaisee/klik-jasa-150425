
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VerificationFiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const VerificationFilters = ({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters
}: VerificationFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan nama atau nomor telepon..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="w-full sm:w-48">
        <Select 
          value={statusFilter}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          onClick={onClearFilters}
          className="w-full sm:w-auto"
        >
          Reset Filter
        </Button>
      )}
    </div>
  );
};

export default VerificationFilters;
