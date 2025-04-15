
import { 
  Wrench, Book, Scissors, Bus, Music, Briefcase, 
  Car, Dog, Key, Home, Paintbrush 
} from 'lucide-react';
import { BroomAndDust, Oil } from './icons/CustomIcons';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from 'react';

// Complete category list with translations
const categories = [
  { name: 'Perbaikan', englishName: 'Home & Repairs', icon: Wrench, color: 'bg-amber-100 text-amber-600' },
  { name: 'Kebersihan', englishName: 'Cleaning & Laundry', icon: BroomAndDust, color: 'bg-blue-100 text-blue-600' },
  { name: 'Transportasi', englishName: 'Transport & Moving', icon: Bus, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Kendaraan', englishName: 'Service & Maintenance', icon: Car, color: 'bg-slate-100 text-slate-600' },
  { name: 'Kecantikan', englishName: 'Beauty & Wellness', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { name: 'Pendidikan', englishName: 'Education & Learning', icon: Book, color: 'bg-purple-100 text-purple-600' },
  { name: 'Acara', englishName: 'Events & Entertainment', icon: Music, color: 'bg-red-100 text-red-600' },
  { name: 'Kreatif', englishName: 'Professional & Creative Services', icon: Paintbrush, color: 'bg-green-100 text-green-600' },
  { name: 'Otomotif', englishName: 'Automotive', icon: Oil, color: 'bg-gray-100 text-gray-600' },
  { name: 'Hewan', englishName: 'Pets', icon: Dog, color: 'bg-orange-100 text-orange-600' },
  { name: 'Sewa', englishName: 'Miscellaneous', icon: Key, color: 'bg-teal-100 text-teal-600' },
];

// Create a function component for the combined rows
const CategoryList = () => {
  // Split categories evenly between two rows
  const { firstRow, secondRow } = useMemo(() => {
    const halfLength = Math.ceil(categories.length / 2);
    return {
      firstRow: categories.slice(0, halfLength),
      secondRow: categories.slice(halfLength)
    };
  }, []);

  return (
    <div className="space-y-6">
      <ScrollArea className="w-full rounded-lg">
        <div className="grid grid-rows-2 gap-y-6 pb-4">
          {/* First row */}
          <div className="flex space-x-4 px-4">
            {firstRow.map((category) => (
              <Link 
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                key={category.name} 
                className="flex flex-col items-center min-w-[80px] flex-shrink-0 transition-transform duration-200 hover:scale-105"
              >
                <div className={`${category.color} p-4 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300`}>
                  <category.icon size={24} />
                </div>
                <span className="text-xs text-center font-medium">{category.name}</span>
                <span className="text-[10px] text-gray-500 text-center">{category.englishName}</span>
              </Link>
            ))}
          </div>
          
          {/* Second row */}
          <div className="flex space-x-4 px-4">
            {secondRow.map((category) => (
              <Link 
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                key={category.name} 
                className="flex flex-col items-center min-w-[80px] flex-shrink-0 transition-transform duration-200 hover:scale-105"
              >
                <div className={`${category.color} p-4 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300`}>
                  <category.icon size={24} />
                </div>
                <span className="text-xs text-center font-medium">{category.name}</span>
                <span className="text-[10px] text-gray-500 text-center">{category.englishName}</span>
              </Link>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="h-2 bg-gray-100" />
      </ScrollArea>
    </div>
  );
};

export default CategoryList;
