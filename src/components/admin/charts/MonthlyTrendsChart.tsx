
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MonthlyTrendsChartProps {
  monthlyData: Array<{ name: string; bookings: number; revenue: number }>;
}

const MonthlyTrendsChart = ({ monthlyData }: MonthlyTrendsChartProps) => {
  // Chart config
  const chartConfig = {
    bookings: { label: 'Booking Bulanan' },
    revenue: { label: 'Pendapatan Bulanan' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Bulanan</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="bookings" 
                name="Booking" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                name="Pendapatan (Rp)" 
                stroke="#82ca9d" 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendsChart;
