
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface CategoryDistributionChartProps {
  categoryData: Array<{ name: string; value: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CategoryDistributionChart = ({ categoryData }: CategoryDistributionChartProps) => {
  // Chart config
  const chartConfig = {
    categories: { label: 'Kategori Layanan' }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Kategori Layanan</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <ChartContainer className="h-80" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex justify-center items-center h-80 text-gray-500">
            Tidak ada data kategori layanan
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionChart;
