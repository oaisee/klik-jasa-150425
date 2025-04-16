
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

const Icon = ({ name, className, size = 24, color }: IconProps) => {
  // @ts-ignore - Dynamic icon name access
  const LucideIcon = LucideIcons[name] || LucideIcons.HelpCircle;

  return <LucideIcon className={className} size={size} color={color} />;
};

export default Icon;
