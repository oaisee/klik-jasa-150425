
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
}

const TransactionFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  typeFilter, 
  setTypeFilter 
}: TransactionFiltersProps) => {
  return (
    <div className="flex items-center mb-4 gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari transaksi berdasarkan pengguna atau deskripsi..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select
        value={typeFilter}
        onValueChange={setTypeFilter}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter Tipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tipe</SelectItem>
          <SelectItem value="topup">Top Up</SelectItem>
          <SelectItem value="withdrawal">Penarikan</SelectItem>
          <SelectItem value="commission">Komisi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransactionFilters;
