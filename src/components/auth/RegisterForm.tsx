
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import TermsAndConditions from './TermsAndConditions';
import FormField from './FormField';
import PasswordInputs from './PasswordInputs';

interface RegisterFormProps {
  isProvider: boolean;
}

const RegisterForm = ({ isProvider }: RegisterFormProps) => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("Mohon isi semua kolom");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Kata sandi tidak cocok");
      return;
    }
    
    if (!agreeTerms) {
      toast.error("Anda harus menyetujui syarat dan ketentuan");
      return;
    }
    
    setLoading(true);
    
    try {
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            is_provider: isProvider,
            created_at: new Date().toISOString() // Add creation timestamp
          }
        }
      });
      
      if (error) throw error;
      
      console.log("Registration successful:", data);
      
      // Note: We won't manually insert into profiles table as this should be handled
      // by a database trigger that creates profiles when users are created
      
      toast.success("Pendaftaran berhasil! Silakan masuk dengan akun Anda");
      
      // Redirect to the login page after successful registration
      navigate('/login', { replace: true });
      
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan, silakan coba lagi");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in" style={{animationDelay: "100ms"}}>
      <FormField
        id="name"
        label="Nama Lengkap"
        type="text"
        placeholder="Nama lengkap"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<User size={18} />}
        required
      />
      
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="nama@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail size={18} />}
        required
      />
      
      <FormField
        id="phone"
        label="Nomor Telepon"
        type="tel"
        placeholder="08xxxxxxxxxx"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        icon={<Phone size={18} />}
        required
      />
      
      <PasswordInputs 
        password={password}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        setShowPassword={setShowPassword}
      />
      
      <div className="flex items-start space-x-3 mt-4">
        <Checkbox 
          id="terms" 
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          className="mt-1 data-[state=checked]:bg-marketplace-primary data-[state=checked]:border-marketplace-primary"
        />
        <TermsAndConditions />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 mt-6 bg-marketplace-primary hover:bg-marketplace-primary/90 text-white font-medium transition-all shadow-sm hover:shadow-md"
        disabled={loading}
        size="lg"
      >
        {loading ? 'Memproses...' : 'Daftar Sekarang'}
      </Button>
      
      <div className="text-center mt-6">
        <p className="text-gray-500">
          Sudah memiliki akun?{' '}
          <a href="/login" className="text-marketplace-primary font-medium hover:underline">
            Masuk
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
