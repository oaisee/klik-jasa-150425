
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useEmailStorage } from '@/hooks/useEmailStorage';
import { useLoginValidation } from '@/hooks/useLoginValidation';
import EmailSuggestions from './EmailSuggestions';
import PasswordInput from './PasswordInput';

interface LoginFormProps {
  redirectToAdmin?: boolean;
}

const LoginForm = ({ redirectToAdmin = false }: LoginFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { 
    previousEmails, 
    showEmailSuggestions, 
    setShowEmailSuggestions, 
    saveEmailToStorage 
  } = useEmailStorage();
  
  const { errors, setErrors, validateForm } = useLoginValidation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(email, password)) {
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
      
      saveEmailToStorage(email);
      
      if (email === 'admin@klikjasa.com') {
        console.log('Admin login successful, redirecting to admin dashboard...');
        toast.success("Login admin berhasil");
        navigate('/admin-dashboard', { replace: true });
        return;
      }
      
      toast.success("Login berhasil");
      console.log("Login successful, redirecting to home page...");
      navigate('/', { replace: true });
    } catch (err: any) {
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

  return (
    <form onSubmit={handleLogin} className="space-y-6 animate-fade-in" style={{animationDelay: "100ms"}}>
      <div className="space-y-2 relative">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Mail size={18} />
          </div>
          <Input 
            id="email"
            type="email" 
            placeholder="nama@email.com" 
            className={`pl-10 border-gray-200 focus:border-marketplace-primary focus:ring focus:ring-marketplace-primary/10 ${errors.email ? 'border-red-500' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => previousEmails.length > 0 && setShowEmailSuggestions(true)}
            onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 200)}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        
        {showEmailSuggestions && (
          <EmailSuggestions 
            previousEmails={previousEmails}
            onSelect={(selectedEmail) => {
              setEmail(selectedEmail);
              setShowEmailSuggestions(false);
            }}
          />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-gray-700">Kata Sandi</Label>
          <Link to="/forgot-password" className="text-sm text-marketplace-primary hover:underline">
            Lupa kata sandi?
          </Link>
        </div>
        <PasswordInput 
          password={password}
          showPassword={showPassword}
          onChange={(e) => setPassword(e.target.value)}
          onToggleVisibility={() => setShowPassword(!showPassword)}
          error={errors.password}
        />
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
