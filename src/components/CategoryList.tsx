
import { 
  Home, Book, Wrench, Camera, Scissors, Briefcase, Car, 
  Paintbrush, Bus, Dog, Key, Music, Sparkles
} from 'lucide-react';
import { BroomAndDust, Oil } from './icons/CustomIcons';
import { Link } from 'react-router-dom';
import { 
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  { name: 'Perbaikan', description: 'Home & Repairs', icon: Wrench, color: 'bg-amber-100 text-amber-600' },
  { name: 'Kebersihan', description: 'Cleaning & Laundry', icon: BroomAndDust, color: 'bg-blue-100 text-blue-600' },
  { name: 'Transportasi', description: 'Transport & Moving', icon: Bus, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Kendaraan', description: 'Service & Maintenance', icon: Car, color: 'bg-slate-100 text-slate-600' },
  { name: 'Kecantikan', description: 'Beauty & Wellness', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { name: 'Pendidikan', description: 'Education & Learning', icon: Book, color: 'bg-purple-100 text-purple-600' },
  { name: 'Acara', description: 'Events & Entertainment', icon: Music, color: 'bg-red-100 text-red-600' },
  { name: 'Kreatif', description: 'Professional & Creative', icon: Briefcase, color: 'bg-green-100 text-green-600' },
  { name: 'Otomotif', description: 'Automotive', icon: Oil, color: 'bg-gray-100 text-gray-600' },
  { name: 'Hewan', description: 'Pets', icon: Dog, color: 'bg-orange-100 text-orange-600' },
  { name: 'Sewa', description: 'Miscellaneous', icon: Key, color: 'bg-teal-100 text-teal-600' },
];

// Split categories into two rows
const firstRowCategories = categories.slice(0, 6);
const secondRowCategories = categories.slice(6);

const CategoryRow = ({ rowCategories }: { rowCategories: typeof categories }) => {
  return (
    <ScrollArea className="w-full pb-4">
      <div className="flex space-x-4 px-1 py-1">
        {rowCategories.map((category) => (
          <Link 
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
            key={category.name} 
            className="flex flex-col items-center min-w-[80px]"
          >
            <div className={`${category.color} p-3.5 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow transition-all`}>
              <category.icon size={22} />
            </div>
            <span className="text-xs text-center font-medium whitespace-nowrap">{category.name}</span>
            <span className="text-[10px] text-center text-gray-500 whitespace-nowrap">{category.description}</span>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};

const CategoryList = () => {
  return (
    <div className="space-y-6">
      <CategoryRow rowCategories={firstRowCategories} />
      <CategoryRow rowCategories={secondRowCategories} />
    </div>
  );
};

export default CategoryList;
