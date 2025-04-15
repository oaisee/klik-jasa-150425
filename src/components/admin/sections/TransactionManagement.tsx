
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Search, 
  Eye, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  ReceiptText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/utils/adminUtils';

interface Transaction {
  id: string;
  profile_id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  booking_id?: string;
  created_at?: string;
  profile?: {
    full_name: string;
  };
}

const TransactionManagement = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Since we don't have real transactions data yet, let's create mock data
    // In a real app, we'd fetch from the database
    const createMockTransactions = () => {
      setLoading(true);
      const types = ['topup', 'commission', 'withdrawal'];
      const statuses = ['completed', 'pending', 'failed'];
      const descriptions = [
        'Top up wallet via Midtrans', 
        'Commission fee for booking #', 
        'Withdrawal to bank account'
      ];
      
      const mockData: Transaction[] = Array.from({ length: 15 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const typeIndex = types.indexOf(type);
        
        return {
          id: `trans-${i + 1}`,
          profile_id: `user-${Math.floor(Math.random() * 10) + 1}`,
          amount: Math.floor(Math.random() * 1000000) + 50000,
          type,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          description: `${descriptions[typeIndex]}${typeIndex === 1 ? Math.floor(Math.random() * 1000) : ''}`,
          booking_id: typeIndex === 1 ? `booking-${Math.floor(Math.random() * 100) + 1}` : undefined,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          profile: {
            full_name: `User ${Math.floor(Math.random() * 10) + 1}`
          }
        };
      });
      
      setTransactions(mockData);
      setLoading(false);
    };

    createMockTransactions();
  }, []);

  // Filter transactions based on search query and type filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case 'commission':
        return <ReceiptText className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'topup':
        return 'Top Up';
      case 'withdrawal':
        return 'Penarikan';
      case 'commission':
        return 'Komisi';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Transaksi</CardTitle>
        <CardDescription>Kelola semua transaksi yang terjadi di platform KlikJasa</CardDescription>
      </CardHeader>
      <CardContent>
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

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32">
                      {searchQuery || typeFilter !== 'all' ? 'Tidak ada transaksi yang sesuai dengan filter' : 'Belum ada transaksi'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.profile?.full_name || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTransactionIcon(transaction.type)}
                          {getTransactionTypeLabel(transaction.type)}
                        </div>
                      </TableCell>
                      <TableCell className={transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}>
                        {transaction.type === 'withdrawal' ? '-' : ''}{formatRupiah(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'completed' ? 'Selesai' : 
                           transaction.status === 'pending' ? 'Menunggu' : 'Gagal'}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(transaction.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Lihat Detail</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4" />
                              <span>Unduh Invoice</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionManagement;
