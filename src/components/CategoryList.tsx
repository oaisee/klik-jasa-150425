
import { 
  Home, Book, Wrench, Camera, Scissors, Briefcase, Car, 
  Paintbrush, Bus, Dog, Key, Music, Sparkles
} from 'lucide-react';
import { BroomAndDust, Oil } from './icons/CustomIcons';
import { Link } from 'react-router-dom';

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

const CategoryList = () => {
  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-5 lg:grid-cols-6">
      {categories.map((category) => (
        <Link 
          to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
          key={category.name} 
          className="flex flex-col items-center"
        >
          <div className={`${category.color} p-3.5 rounded-full mb-2 flex items-center justify-center shadow-sm hover:shadow transition-all`}>
            <category.icon size={22} />
          </div>
          <span className="text-xs text-center font-medium">{category.name}</span>
          <span className="text-[10px] text-center text-gray-500">{category.description}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
