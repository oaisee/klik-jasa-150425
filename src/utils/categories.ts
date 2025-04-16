
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
    id: 'perbaikan',
    name: 'Perbaikan',
    icon: 'Wrench',
    color: 'bg-zinc-100 text-zinc-800'
  },
  {
    id: 'kebersihan',
    name: 'Kebersihan',
    icon: 'Droplets',
    color: 'bg-sky-100 text-sky-800'
  },
  {
    id: 'transportasi',
    name: 'Transportasi',
    icon: 'Bus',
    color: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'kendaraan',
    name: 'Kendaraan',
    icon: 'Car',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'kecantikan',
    name: 'Kecantikan',
    icon: 'Scissors',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'pendidikan',
    name: 'Pendidikan',
    icon: 'GraduationCap',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'acara',
    name: 'Acara',
    icon: 'Calendar',
    color: 'bg-violet-100 text-violet-800'
  },
  {
    id: 'kreatif',
    name: 'Kreatif',
    icon: 'Palette',
    color: 'bg-fuchsia-100 text-fuchsia-800'
  },
  {
    id: 'otomotif',
    name: 'Otomotif',
    icon: 'Engine',
    color: 'bg-stone-100 text-stone-800'
  },
  {
    id: 'hewan',
    name: 'Hewan',
    icon: 'Cat',
    color: 'bg-lime-100 text-lime-800'
  },
  {
    id: 'sewa',
    name: 'Sewa',
    icon: 'Key',
    color: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'elektronik',
    name: 'Elektronik',
    icon: 'Zap',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan',
    icon: 'HeartPulse',
    color: 'bg-rose-100 text-rose-800'
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
