
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/utils/adminUtils';

const BookingsGrowthChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookingsGrowth = async () => {
      setLoading(true);
      try {
        // Fetch bookings data
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at');

        if (error) throw error;

        // Group by month
        const bookingsByMonth: Record<string, { 
          month: string; 
          bookings: number; 
          revenue: number;
          commissions: number;
          growth: number;
        }> = {};
        
        bookings?.forEach(booking => {
          if (!booking.created_at) return;
          
          const date = new Date(booking.created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          
          if (!bookingsByMonth[monthYear]) {
            bookingsByMonth[monthYear] = { 
              month: monthYear, 
              bookings: 0, 
              revenue: 0,
              commissions: 0,
              growth: 0
            };
          }
          
          bookingsByMonth[monthYear].bookings += 1;
          bookingsByMonth[monthYear].revenue += Number(booking.price) || 0;
          bookingsByMonth[monthYear].commissions += Number(booking.commission) || 0;
        });

        // Calculate growth compared to previous month
        const sortedMonths = Object.keys(bookingsByMonth).sort((a, b) => {
          const [aMonth, aYear] = a.split('/').map(Number);
          const [bMonth, bYear] = b.split('/').map(Number);
          return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
        });

        sortedMonths.forEach((month, index) => {
          if (index > 0) {
            const prevMonth = sortedMonths[index - 1];
            const currentBookings = bookingsByMonth[month].bookings;
            const previousBookings = bookingsByMonth[prevMonth].bookings;
            
            if (previousBookings > 0) {
              bookingsByMonth[month].growth = 
                ((currentBookings - previousBookings) / previousBookings) * 100;
            }
          }
        });

        const chartData = sortedMonths.map(month => ({
          ...bookingsByMonth[month],
          revenue: Math.round(bookingsByMonth[month].revenue),
          commissions: Math.round(bookingsByMonth[month].commissions),
          growth: Math.round(bookingsByMonth[month].growth)
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching bookings growth:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsGrowth();
  }, []);

  // Chart config
  const chartConfig = {
    bookings: { label: 'Jumlah Booking' },
    revenue: { label: 'Pendapatan' },
    commissions: { label: 'Komisi (5%)' },
    growth: { label: 'Pertumbuhan (%)' }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pertumbuhan Booking</CardTitle>
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
        <CardTitle>Pertumbuhan Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="bookings" 
                name="Jumlah Booking" 
                fill="#8884d8" 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="growth" 
                name="Pertumbuhan (%)" 
                stroke="#ff7300" 
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="commissions" 
                name="Komisi (Rp)" 
                stroke="#82ca9d" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BookingsGrowthChart;
