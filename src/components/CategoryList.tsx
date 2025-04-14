
import { Home, Book, Wrench, Camera, Scissors, PaintBucket, Car, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Home Cleaning', icon: Home, color: 'bg-blue-100 text-blue-500' },
  { name: 'Tutoring', icon: Book, color: 'bg-purple-100 text-purple-500' },
  { name: 'Handyman', icon: Wrench, color: 'bg-amber-100 text-amber-500' },
  { name: 'Photography', icon: Camera, color: 'bg-pink-100 text-pink-500' },
  { name: 'Hair & Beauty', icon: Scissors, color: 'bg-red-100 text-red-500' },
  { name: 'Painting', icon: PaintBucket, color: 'bg-green-100 text-green-500' },
  { name: 'Car Service', icon: Car, color: 'bg-slate-100 text-slate-500' },
  { name: 'Business', icon: Briefcase, color: 'bg-indigo-100 text-indigo-500' },
];

const CategoryList = () => {
  return (
    <div className="grid grid-cols-4 gap-3 px-2">
      {categories.map((category) => (
        <Link to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} key={category.name} className="flex flex-col items-center">
          <div className={`${category.color} p-3 rounded-full mb-1 flex items-center justify-center`}>
            <category.icon size={20} />
          </div>
          <span className="text-xs text-center font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
