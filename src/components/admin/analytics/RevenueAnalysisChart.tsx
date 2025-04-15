
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/utils/adminUtils';
import { generateMonthlyData } from '@/utils/adminUtils';

const RevenueAnalysisChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRevenueAnalysis = async () => {
      setLoading(true);
      try {
        // Use generated data
        const monthlyData = await generateMonthlyData();
        
        // Calculate accumulated revenue
        let accumulatedTotal = 0;
        const chartData = monthlyData.map(item => {
          accumulatedTotal += item.revenue;
          return {
            month: item.name,
            revenue: item.revenue,
            accumulatedRevenue: accumulatedTotal
          };
        });

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
