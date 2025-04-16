import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah, generateMonthlyData } from '@/utils/admin';

const BookingsGrowthChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookingsGrowth = async () => {
      setLoading(true);
      try {
        // Use the generateMonthlyData function to get simulated data
        const monthlyData = await generateMonthlyData();
        
        // Add growth calculation
        const chartData = monthlyData.map((item, index, array) => {
          const growth = index > 0 
            ? ((item.bookings - array[index - 1].bookings) / array[index - 1].bookings) * 100 
            : 0;
          
          return {
            ...item,
            growth: Math.round(growth),
            commissions: Math.round(item.revenue * 0.05) // 5% commission
          };
        });

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
              <XAxis dataKey="name" />
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
