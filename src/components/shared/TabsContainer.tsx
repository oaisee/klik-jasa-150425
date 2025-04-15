
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsContainerProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const TabsContainer = ({ 
  tabs, 
  defaultValue, 
  value, 
  onValueChange,
  className 
}: TabsContainerProps) => {
  return (
    <Tabs 
      defaultValue={defaultValue || tabs[0].id} 
      className={`w-full ${className || ''}`}
      value={value}
      onValueChange={onValueChange}
    >
      <TabsList className={`grid w-full grid-cols-${tabs.length} mb-4`}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsContainer;
