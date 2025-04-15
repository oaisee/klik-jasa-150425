
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import PopularServiceItem from './PopularServiceItem';
import { Service } from '@/types/database';

const PopularServicesList = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  
  useEffect(() => {
    const fetchServices = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layanan Populer</CardTitle>
        <CardDescription>Layanan paling banyak dicari di platform</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-marketplace-primary"></div>
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
          <p className="text-center py-8 text-gray-500">
            Belum ada layanan tersedia
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Lihat Semua Layanan</Button>
      </CardFooter>
    </Card>
  );
};

export default PopularServicesList;
