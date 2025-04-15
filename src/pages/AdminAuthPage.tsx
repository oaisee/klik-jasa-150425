
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminAuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  
  useEffect(() => {
    // Check if admin is already logged in
    const checkAdminSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session && data.session.user?.email === 'admin@klikjasa.com') {
        // Already logged in as admin, redirect to dashboard
        navigate('/admin-dashboard');
      }
      
      setCheckingSession(false);
    };
    
    checkAdminSession();
  }, [navigate]);
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Silakan isi email dan password");
      return;
    }
    
    // Check if this is the specific admin account
    if (email !== 'admin@klikjasa.com') {
      setError("Email ini tidak memiliki akses admin");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (loginError) {
        throw loginError;
      }
      
      // Verify it's the admin account
      if (data.user && data.user.email === 'admin@klikjasa.com') {
        toast.success("Login admin berhasil");
        navigate('/admin-dashboard');
      } else {
        await supabase.auth.signOut();
        setError("Akun ini tidak memiliki akses admin");
      }
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message || "Gagal login, silakan periksa kredensial Anda");
      toast.error("Login gagal");
    } finally {
      setLoading(false);
    }
  };
  
  if (checkingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marketplace-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4">
            <img
              src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
              alt="KlikJasa Logo"
              className="w-20 h-20"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-marketplace-dark">Admin Dashboard</CardTitle>
          <CardDescription>Login untuk mengakses panel admin KlikJasa</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="admin@klikjasa.com" 
                  className="pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-marketplace-primary hover:bg-marketplace-primary/90"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Login Admin'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-sm text-marketplace-primary"
          >
            Kembali ke Halaman Utama
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuthPage;
