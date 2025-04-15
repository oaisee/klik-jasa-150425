
import { Eye, EyeOff, Lock, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordInputsProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setShowPassword: (value: boolean) => void;
}

const PasswordInputs = ({
  password,
  confirmPassword,
  showPassword,
  setPassword,
  setConfirmPassword,
  setShowPassword
}: PasswordInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Kata Sandi</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Lock size={18} />
          </div>
          <Input 
            id="password"
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            className="pl-10 border-gray-200" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700">Konfirmasi Kata Sandi</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <UserCheck size={18} />
          </div>
          <Input 
            id="confirmPassword"
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            className="pl-10 border-gray-200" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>
    </>
  );
};

export default PasswordInputs;
