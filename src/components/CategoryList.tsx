import React from 'react';
import Icon from '@/components/Icon';

import { CATEGORIES } from '@/utils/categories';

interface CategoryListProps {
  onCategoryClick: (category: string) => void;
  selectedCategory: string | null;
}

const CategoryList = ({ onCategoryClick, selectedCategory }: CategoryListProps) => {
  
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-3">Kategori</h2>
      <div className="flex overflow-x-auto pb-2 no-scrollbar">
        <div className="flex space-x-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.name)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[80px] ${
                selectedCategory === category.name
                  ? 'bg-marketplace-primary text-white'
                  : `${category.color} bg-opacity-20`
              }`}
            >
              <div className={`p-2 rounded-full ${
                selectedCategory === category.name
                  ? 'bg-white bg-opacity-20'
                  : category.color
              }`}>
                <Icon name={category.icon} className="w-5 h-5" />
              </div>
              <span className="text-xs mt-2 whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
