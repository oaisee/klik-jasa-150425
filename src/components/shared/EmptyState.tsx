
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={48} className="mb-2 opacity-50 text-gray-500" />
      <h3 className="font-medium text-gray-700 mt-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mt-1 mb-4">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
