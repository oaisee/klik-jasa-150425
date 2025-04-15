
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
}

const StatCard = ({ icon, title, value, trend, trendPositive }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            {icon}
          </div>
        </div>
        <p className={`text-xs mt-2 ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
