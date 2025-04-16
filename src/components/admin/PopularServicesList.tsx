
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import PopularServiceItem from './PopularServiceItem';
import { Service } from '@/types/database';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { RefreshCw, Package } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '@/components/shared/EmptyState';

const PopularServicesList = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
          
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching popular services:', error);
      toast.error('Gagal memuat data layanan populer');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchServices();
      toast.success('Data layanan berhasil disegarkan');
    } catch (error) {
      console.error('Error refreshing services:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Layanan Populer</CardTitle>
          <CardDescription>Layanan paling banyak dicari di platform</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingIndicator />
          </div>
        ) : services.length > 0 ? (
          <ul className="space-y-4">
            {services.map(service => (
              <PopularServiceItem
                key={service.id}
                title={service.title}
                category={service.category || 'Umum'}
                price={service.price.toString()}
                location={service.location || 'Tidak tersedia'}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Package}
            title="Tidak ada layanan tersedia"
            description="Belum ada layanan yang ditambahkan di platform"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Lihat Semua Layanan</Button>
      </CardFooter>
    </Card>
  );
};

export default PopularServicesList;
