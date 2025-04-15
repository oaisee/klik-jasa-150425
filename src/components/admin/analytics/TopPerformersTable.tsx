
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/utils/adminUtils';
import { User, Star } from 'lucide-react';

interface ProviderStats {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
  services: number;
}

const TopPerformersTable = () => {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderStats[]>([]);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      setLoading(true);
      try {
        // Fetch providers who are service providers
        const { data: providerProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('is_provider', true);

        if (profilesError) throw profilesError;

        // Fetch services count per provider
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('provider_id, id');

        if (servicesError) throw servicesError;

        // Generate mock stats for providers
        const providersStats: ProviderStats[] = providerProfiles?.map(profile => {
          // Count services for this provider
          const serviceCount = services?.filter(
            service => service.provider_id === profile.id
          ).length || 0;
          
          // Generate random booking and revenue data for demonstration
          const bookingsCount = Math.floor(Math.random() * 50) + 1;
          const revenueAmount = bookingsCount * (Math.floor(Math.random() * 500000) + 100000);
          
          return {
            id: profile.id,
            name: profile.full_name || 'Unknown Provider',
            bookings: bookingsCount,
            revenue: revenueAmount,
            services: serviceCount
          };
        }) || [];

        // Sort by bookings count
        const topProviders = providersStats
          .sort((a, b) => b.bookings - a.bookings || b.revenue - a.revenue)
          .slice(0, 10);

        setProviders(topProviders);
      } catch (error) {
        console.error('Error fetching top performers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPerformers();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Penyedia Jasa Terbaik</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penyedia Jasa Terbaik</CardTitle>
      </CardHeader>
      <CardContent>
        {providers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Peringkat</TableHead>
                <TableHead>Nama Penyedia</TableHead>
                <TableHead>Jumlah Booking</TableHead>
                <TableHead>Pendapatan</TableHead>
                <TableHead>Layanan Aktif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider, index) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">
                    {index < 3 ? (
                      <Star className={`h-5 w-5 inline-block mr-1 ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400' : 
                        'text-amber-700'
                      }`} />
                    ) : null}
                    #{index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-slate-400" />
                      {provider.name}
                    </div>
                  </TableCell>
                  <TableCell>{provider.bookings}</TableCell>
                  <TableCell>{formatRupiah(provider.revenue)}</TableCell>
                  <TableCell>{provider.services}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Tidak ada data penyedia jasa yang tersedia
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPerformersTable;
