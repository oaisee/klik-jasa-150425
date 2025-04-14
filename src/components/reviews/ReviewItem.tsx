
import { Star } from 'lucide-react';

interface ReviewItemProps {
  name: string;
  date: string;
  rating: number;
  content: string;
}

const ReviewItem = ({ name, date, rating, content }: ReviewItemProps) => {
  return (
    <div className="border-b border-gray-100 py-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm">{content}</p>
    </div>
  );
};

export default ReviewItem;
