
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const UserActivityChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserActivity = async () => {
      setLoading(true);
      try {
        // This would ideally use a database function to aggregate user registration data by month
        // For now we'll simulate with profiles table created_at field
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('created_at, is_provider');

        if (error) throw error;

        // Group by month and count users
        const activityByMonth: Record<string, { month: string; consumers: number; providers: number }> = {};
        
        profiles?.forEach(profile => {
          if (!profile.created_at) return;
          
          const date = new Date(profile.created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          
          if (!activityByMonth[monthYear]) {
            activityByMonth[monthYear] = { 
              month: monthYear, 
              consumers: 0, 
              providers: 0 
            };
          }
          
          if (profile.is_provider) {
            activityByMonth[monthYear].providers += 1;
          } else {
            activityByMonth[monthYear].consumers += 1;
          }
        });

        // Convert to array and sort by date
        const chartData = Object.values(activityByMonth)
          .sort((a, b) => {
            const [aMonth, aYear] = a.month.split('/').map(Number);
            const [bMonth, bYear] = b.month.split('/').map(Number);
            return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
          });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching user activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  // Chart config
  const chartConfig = {
    consumers: { label: 'Pengguna Biasa' },
    providers: { label: 'Penyedia Jasa' },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Pengguna</CardTitle>
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
        <CardTitle>Aktivitas Pengguna</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="consumers" 
                name="Pengguna Biasa" 
                stroke="#0088FE" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="providers" 
                name="Penyedia Jasa" 
                stroke="#00C49F" 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
