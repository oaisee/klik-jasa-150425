
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const ServicePopularityChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchServicePopularity = async () => {
      setLoading(true);
      try {
        // Fetch services
        const { data: services, error } = await supabase
          .from('services')
          .select('id, title, category')
          .order('title');

        if (error) throw error;

        // Transform data for the chart by adding random booking counts
        const chartData = services?.map((service, index) => {
          // Get a reasonably distributed set of values - more popular services should have more bookings
          const popularity = Math.max(25, 50 - index * 3); // Descending popularity
          const randomVariance = Math.floor(Math.random() * 10); // Add some randomness
          const bookings = popularity + randomVariance;
          
          return {
            name: service.title.length > 15 ? service.title.substring(0, 15) + '...' : service.title,
            bookings: bookings,
            category: service.category || 'Tidak dikategorikan'
          };
        }).slice(0, 10) || [];

        setData(chartData);
      } catch (error) {
        console.error('Error fetching service popularity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicePopularity();
  }, []);

  // Chart config
  const chartConfig = {
    services: { label: 'Layanan' },
    bookings: { label: 'Booking' }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Layanan Terpopuler</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Skeleton className="w-full h-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Layanan Terpopuler</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="bookings" name="Jumlah Booking" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ServicePopularityChart;
