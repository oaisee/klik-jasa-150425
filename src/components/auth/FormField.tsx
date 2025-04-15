
import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ReactNode;
  required?: boolean;
  rightElement?: ReactNode;
}

const FormField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  rightElement
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          {icon}
        </div>
        <Input 
          id={id}
          type={type} 
          placeholder={placeholder} 
          className="pl-10 border-gray-200" 
          value={value}
          onChange={onChange}
          required={required}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField;
