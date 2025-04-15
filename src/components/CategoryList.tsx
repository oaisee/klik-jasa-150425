
import { Home, Book, Wrench, Camera, Scissors, PaintBucket, Car, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Bersih Rumah', icon: Home, color: 'bg-blue-100 text-blue-500' },
  { name: 'Bimbel', icon: Book, color: 'bg-purple-100 text-purple-500' },
  { name: 'Tukang', icon: Wrench, color: 'bg-amber-100 text-amber-500' },
  { name: 'Fotografi', icon: Camera, color: 'bg-pink-100 text-pink-500' },
  { name: 'Salon', icon: Scissors, color: 'bg-red-100 text-red-500' },
  { name: 'Cat Rumah', icon: PaintBucket, color: 'bg-green-100 text-green-500' },
  { name: 'Servis Mobil', icon: Car, color: 'bg-slate-100 text-slate-500' },
  { name: 'Bisnis', icon: Briefcase, color: 'bg-indigo-100 text-indigo-500' },
];

const CategoryList = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} key={category.name} className="flex flex-col items-center">
          <div className={`${category.color} p-3.5 rounded-full mb-2 flex items-center justify-center shadow-sm`}>
            <category.icon size={22} />
          </div>
          <span className="text-xs text-center font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
