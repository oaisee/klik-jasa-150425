
import React from 'react';
import * as LucideIcons from 'lucide-react';

import { CATEGORIES } from '@/utils/categories';

interface CategoryListProps {
  onCategoryClick: (category: string) => void;
  selectedCategory: string | null;
  layout?: string;
}

const CategoryList = ({ onCategoryClick, selectedCategory, layout }: CategoryListProps) => {
  return (
    <div className="mb-4">
      {layout !== 'row' && (
        <h2 className="text-lg font-semibold mb-3 text-left">Kategori</h2>
      )}
      <div className="flex overflow-x-auto pb-2 no-scrollbar">
        <div className="flex space-x-3">
          {CATEGORIES.map((category) => {
            // Dynamic icon retrieval from lucide-react
            // @ts-ignore - Dynamic icon reference
            const IconComponent = LucideIcons[category.icon] || LucideIcons.HelpCircle;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.name)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[80px] ${
                  selectedCategory === category.name
                    ? 'bg-green-500 text-white'
                    : `${category.color} bg-opacity-20`
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    selectedCategory === category.name
                      ? 'bg-white bg-opacity-20'
                      : category.color
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs mt-2 whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
