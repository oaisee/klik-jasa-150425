
import { Mail } from 'lucide-react';

interface EmailSuggestionsProps {
  previousEmails: string[];
  onSelect: (email: string) => void;
}

const EmailSuggestions = ({ previousEmails, onSelect }: EmailSuggestionsProps) => {
  if (!previousEmails.length) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
      <ul className="py-1 max-h-48 overflow-auto">
        {previousEmails.map((prevEmail, index) => (
          <li 
            key={index}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={() => onSelect(prevEmail)}
          >
            <Mail size={16} className="mr-2 text-gray-400" />
            <span>{prevEmail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailSuggestions;
