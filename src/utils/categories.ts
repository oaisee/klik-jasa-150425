
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Consistent categories across the application
export const CATEGORIES: Category[] = [
  {
    id: 'rumah-tangga',
    name: 'Rumah Tangga',
    icon: 'Home',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'elektronik',
    name: 'Elektronik',
    icon: 'Zap',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'kendaraan',
    name: 'Kendaraan',
    icon: 'Car',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'kebersihan',
    name: 'Kebersihan',
    icon: 'Droplets',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan',
    icon: 'HeartPulse',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'kecantikan',
    name: 'Kecantikan',
    icon: 'Scissors',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'pendidikan',
    name: 'Pendidikan',
    icon: 'GraduationCap',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'teknologi',
    name: 'Teknologi',
    icon: 'Laptop',
    color: 'bg-slate-100 text-slate-800'
  },
  {
    id: 'lainnya',
    name: 'Lainnya',
    icon: 'MoreHorizontal',
    color: 'bg-gray-100 text-gray-800'
  }
];

// Get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

// Get category by name
export const getCategoryByName = (name: string): Category | undefined => {
  return CATEGORIES.find(category => 
    category.name.toLowerCase() === name.toLowerCase()
  );
};

// Get all category names
export const getCategoryNames = (): string[] => {
  return CATEGORIES.map(category => category.name);
};
