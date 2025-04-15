
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/utils/adminUtils';

const RevenueAnalysisChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRevenueAnalysis = async () => {
      setLoading(true);
      try {
        // Fetch transactions data
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('type', 'commission')
          .order('created_at');

        if (error) throw error;

        // Group by month
        const revenueByMonth: Record<string, { 
          month: string; 
          revenue: number;
          accumulatedRevenue: number;
        }> = {};
        
        let accumulatedTotal = 0;
        
        transactions?.forEach(transaction => {
          if (!transaction.created_at) return;
          
          const date = new Date(transaction.created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          
          if (!revenueByMonth[monthYear]) {
            revenueByMonth[monthYear] = { 
              month: monthYear, 
              revenue: 0,
              accumulatedRevenue: 0
            };
          }
          
          const amount = Number(transaction.amount) || 0;
          revenueByMonth[monthYear].revenue += amount;
          accumulatedTotal += amount;
        });

        // Update accumulated revenue
        Object.keys(revenueByMonth).sort((a, b) => {
          const [aMonth, aYear] = a.split('/').map(Number);
          const [bMonth, bYear] = b.split('/').map(Number);
          return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
        }).reduce((acc, month) => {
          revenueByMonth[month].accumulatedRevenue = acc + revenueByMonth[month].revenue;
          return revenueByMonth[month].accumulatedRevenue;
        }, 0);

        // Convert to array and sort by date
        const chartData = Object.values(revenueByMonth)
          .sort((a, b) => {
            const [aMonth, aYear] = a.month.split('/').map(Number);
            const [bMonth, bYear] = b.month.split('/').map(Number);
            return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
          })
          .map(item => ({
            ...item,
            revenue: Math.round(item.revenue),
            accumulatedRevenue: Math.round(item.accumulatedRevenue)
          }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching revenue analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueAnalysis();
  }, []);

  // Chart config
  const chartConfig = {
    revenue: { label: 'Pendapatan Bulanan' },
    accumulatedRevenue: { label: 'Pendapatan Akumulatif' }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analisis Pendapatan</CardTitle>
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
        <CardTitle>Analisis Pendapatan</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Pendapatan Bulanan" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="accumulatedRevenue" 
                name="Pendapatan Akumulatif" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueAnalysisChart;
