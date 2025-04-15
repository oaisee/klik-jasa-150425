
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth:", error);
          return;
        }
        
        if (data.session) {
          console.log("User already authenticated, redirecting...");
          setIsAuthenticated(true);
          // Redirect to home page if already authenticated
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error("Error in auth check:", err);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Mohon isi semua kolom");
      return;
    }
    
    // If admin login is attempted from regular login page, redirect
    if (email === 'admin@klikjasa.com') {
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
      const errorMessage = err.message || "Terjadi kesalahan, silakan coba lagi";
      
      // Display friendly error message for email not confirmed
      if (err.code === 'email_not_confirmed') {
        toast.error("Email belum dikonfirmasi. Silakan cek kotak masuk email Anda.");
      } else {
        toast.error(errorMessage);
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center p-4">
        <button 
          onClick={() => navigate('/onboarding')}
          className="p-2 text-gray-500 hover:text-marketplace-primary transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8 animate-fade-in">
            <img 
              src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" 
              alt="KlikJasa Logo" 
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-marketplace-dark">Masuk ke KlikJasa</h1>
            <p className="text-gray-500 mt-2">Lanjutkan untuk mengakses layanan</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 animate-fade-in" style={{animationDelay: "100ms"}}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="nama@email.com" 
                  className="pl-10 border-gray-200 focus:border-marketplace-primary focus:ring focus:ring-marketplace-primary/10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
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
                  className="pl-10 border-gray-200 focus:border-marketplace-primary focus:ring focus:ring-marketplace-primary/10" 
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
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-marketplace-primary hover:bg-marketplace-primary/90 text-white font-medium transition-all shadow-sm hover:shadow-md"
              disabled={loading}
              size="lg"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Belum punya akun?</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-block w-full py-3 px-4 border border-marketplace-primary text-marketplace-primary hover:bg-marketplace-primary/5 text-center rounded-md font-medium transition-colors"
              >
                Daftar Sekarang
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                to="/admin" 
                className="inline-flex items-center justify-center text-sm text-gray-500 hover:text-marketplace-primary"
              >
                <Shield size={16} className="mr-1" />
                Login Admin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
