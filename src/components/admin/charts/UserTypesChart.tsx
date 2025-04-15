
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface UserTypesChartProps {
  providers: number;
  consumers: number;
}

const UserTypesChart = ({ providers, consumers }: UserTypesChartProps) => {
  // Chart config
  const chartConfig = {
    userType: { label: 'Jenis Pengguna' }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jenis Pengguna</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Penyedia Jasa', value: providers },
                  { name: 'Pengguna Biasa', value: consumers }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#00C49F" />
                <Cell fill="#0088FE" />
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UserTypesChart;
