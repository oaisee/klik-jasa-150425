
import { AlertTriangle } from 'lucide-react';

interface RejectionNotesProps {
  notes: string;
}

const RejectionNotes = ({ notes }: RejectionNotesProps) => {
  if (!notes) return null;
  
  return (
    <div className="mt-2 mb-3 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-700">
      <div className="flex gap-1 items-start">
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>{notes}</p>
      </div>
    </div>
  );
};

export default RejectionNotes;
