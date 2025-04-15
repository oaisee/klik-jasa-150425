
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import FormField from './FormField';

interface LoginFormProps {
  redirectToAdmin?: boolean;
}

const LoginForm = ({ redirectToAdmin = false }: LoginFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Kata sandi wajib diisi";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // If admin login is attempted from regular login page, redirect
    if (email === 'admin@klikjasa.com' && !redirectToAdmin) {
      navigate('/admin');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login berhasil");
      console.log("Login successful, redirecting to home page...");
      
      // Force navigation to home page with replace to prevent back button issues
      navigate('/', { replace: true });
    } catch (err: any) {
      // Clear specific field errors
      setErrors({});
      
      if (err.message.includes('Invalid login credentials')) {
        toast.error("Email atau kata sandi salah");
      } else if (err.code === 'email_not_confirmed') {
        toast.error("Email belum dikonfirmasi. Silakan cek kotak masuk email Anda.");
      } else {
        toast.error(err.message || "Terjadi kesalahan, silakan coba lagi");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const rightElement = (
    <button 
      type="button"
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <form onSubmit={handleLogin} className="space-y-6 animate-fade-in" style={{animationDelay: "100ms"}}>
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="nama@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail size={18} />}
        required={true}
      />
      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-gray-700">Kata Sandi</Label>
          <Link to="/forgot-password" className="text-sm text-marketplace-primary hover:underline">
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Lock size={18} />
          </div>
          <Input 
            id="password"
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            className={`pl-10 border-gray-200 focus:border-marketplace-primary focus:ring focus:ring-marketplace-primary/10 ${errors.password ? 'border-red-500' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {rightElement}
        </div>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-marketplace-primary hover:bg-marketplace-primary/90 text-white font-medium transition-all shadow-sm hover:shadow-md"
        disabled={loading}
        size="lg"
      >
        {loading ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  );
};

export default LoginForm;
