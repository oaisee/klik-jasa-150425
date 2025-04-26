
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PasswordInputProps {
  password: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
  error?: string;
}

const PasswordInput = ({
  password,
  showPassword,
  onChange,
  onToggleVisibility,
  error
}: PasswordInputProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Lock size={18} />
      </div>
      <Input 
        id="password"
        type={showPassword ? "text" : "password"} 
        placeholder="••••••••" 
        className={`pl-10 border-gray-200 focus:border-marketplace-primary focus:ring focus:ring-marketplace-primary/10 ${error ? 'border-red-500' : ''}`}
        value={password}
        onChange={onChange}
      />
      <button 
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        onClick={onToggleVisibility}
        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
