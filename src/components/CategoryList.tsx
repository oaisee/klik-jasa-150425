
import { 
  Wrench, Book, Scissors, Bus, Music, Briefcase, 
  Car, Dog, Key, Home, Paintbrush 
} from 'lucide-react';
import { BroomAndDust, Oil } from './icons/CustomIcons';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from 'react';

// Complete category list
export const categories = [
  { name: 'Perbaikan', icon: Wrench, color: 'bg-amber-100 text-amber-600' },
  { name: 'Kebersihan', icon: BroomAndDust, color: 'bg-blue-100 text-blue-600' },
  { name: 'Transportasi', icon: Bus, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Kendaraan', icon: Car, color: 'bg-slate-100 text-slate-600' },
  { name: 'Kecantikan', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { name: 'Pendidikan', icon: Book, color: 'bg-purple-100 text-purple-600' },
  { name: 'Acara', icon: Music, color: 'bg-red-100 text-red-600' },
  { name: 'Kreatif', icon: Paintbrush, color: 'bg-green-100 text-green-600' },
  { name: 'Otomotif', icon: Oil, color: 'bg-gray-100 text-gray-600' },
  { name: 'Hewan', icon: Dog, color: 'bg-orange-100 text-orange-600' },
  { name: 'Sewa', icon: Key, color: 'bg-teal-100 text-teal-600' },
];

interface CategoryListProps {
  layout?: 'grid' | 'row';
  onCategoryClick?: (category: string) => void;
}

const CategoryList = ({ layout = 'grid', onCategoryClick }: CategoryListProps) => {
  const { firstRow, secondRow } = useMemo(() => {
    const halfLength = Math.ceil(categories.length / 2);
    return {
      firstRow: categories.slice(0, halfLength),
      secondRow: categories.slice(halfLength)
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
  };

  if (layout === 'row') {
    return (
      <ScrollArea className="w-full">
        <div className="flex space-x-4 px-4 pb-4">
          {categories.map((category) => (
            <div 
              key={category.name}
              className="flex flex-col items-center min-w-[80px] flex-shrink-0 transition-transform duration-200 hover:scale-105 cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className={`${category.color} p-4 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300`}>
                <category.icon size={24} />
              </div>
              <span className="text-xs text-center font-medium">{category.name}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2 bg-gray-100" />
      </ScrollArea>
    );
  }

  return (
    <div className="space-y-6">
      <ScrollArea className="w-full rounded-lg">
        <div className="grid grid-rows-2 gap-y-6 pb-4">
          {/* First row */}
          <div className="flex space-x-4 px-4">
            {firstRow.map((category) => (
              <div 
                key={category.name}
                className="flex flex-col items-center min-w-[80px] flex-shrink-0 transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className={`${category.color} p-4 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300`}>
                  <category.icon size={24} />
                </div>
                <span className="text-xs text-center font-medium">{category.name}</span>
              </div>
            ))}
          </div>
          
          {/* Second row */}
          <div className="flex space-x-4 px-4">
            {secondRow.map((category) => (
              <div 
                key={category.name}
                className="flex flex-col items-center min-w-[80px] flex-shrink-0 transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className={`${category.color} p-4 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300`}>
                  <category.icon size={24} />
                </div>
                <span className="text-xs text-center font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="h-2 bg-gray-100" />
      </ScrollArea>
    </div>
  );
};

export default CategoryList;
