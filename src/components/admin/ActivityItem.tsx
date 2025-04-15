
import { FileText, Users, Briefcase, AlertCircle } from 'lucide-react';

interface ActivityItemProps {
  type: 'booking' | 'registration' | 'service' | string;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ type, title, description, time }: ActivityItemProps) => {
  const getBgColor = () => {
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-500';
      case 'registration': return 'bg-green-100 text-green-500';
      case 'service': return 'bg-purple-100 text-purple-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'booking': return <FileText className="h-4 w-4" />;
      case 'registration': return <Users className="h-4 w-4" />;
      case 'service': return <Briefcase className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <li className="flex items-start space-x-3">
      <div className={`p-2 rounded-full ${getBgColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <p className="text-xs text-gray-400">{time}</p>
    </li>
  );
};

export default ActivityItem;
