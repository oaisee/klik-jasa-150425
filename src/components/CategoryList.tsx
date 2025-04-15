
import { 
  Wrench, Book, Scissors, Bus, Music, Briefcase, 
  Car, Dog, Key 
} from 'lucide-react';
import { BroomAndDust, Oil } from './icons/CustomIcons';
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  { name: 'Perbaikan', icon: Wrench, color: 'bg-amber-100 text-amber-600' },
  { name: 'Kebersihan', icon: BroomAndDust, color: 'bg-blue-100 text-blue-600' },
  { name: 'Transportasi', icon: Bus, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Kendaraan', icon: Car, color: 'bg-slate-100 text-slate-600' },
  { name: 'Kecantikan', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { name: 'Pendidikan', icon: Book, color: 'bg-purple-100 text-purple-600' },
  { name: 'Acara', icon: Music, color: 'bg-red-100 text-red-600' },
  { name: 'Kreatif', icon: Briefcase, color: 'bg-green-100 text-green-600' },
  { name: 'Otomotif', icon: Oil, color: 'bg-gray-100 text-gray-600' },
  { name: 'Hewan', icon: Dog, color: 'bg-orange-100 text-orange-600' },
  { name: 'Sewa', icon: Key, color: 'bg-teal-100 text-teal-600' },
];

const firstRowCategories = categories.slice(0, 6);
const secondRowCategories = categories.slice(6);

const CategoryRow = ({ rowCategories }: { rowCategories: typeof categories }) => {
  return (
    <ScrollArea 
      className="w-full pb-2" 
      scrollHideDelay={400}
    >
      <div className="flex space-x-4 px-4 py-1 min-w-full overflow-x-auto">
        {rowCategories.map((category) => (
          <Link 
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
            key={category.name} 
            className="flex flex-col items-center min-w-[75px] flex-shrink-0 transition-transform duration-200 hover:scale-105"
          >
            <div className={`${category.color} p-4 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300`}>
              <category.icon size={24} />
            </div>
            <span className="text-xs text-center font-medium whitespace-nowrap">{category.name}</span>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};

const CategoryList = () => {
  return (
    <div className="space-y-4">
      <CategoryRow rowCategories={firstRowCategories} />
      <CategoryRow rowCategories={secondRowCategories} />
    </div>
  );
};

export default CategoryList;
