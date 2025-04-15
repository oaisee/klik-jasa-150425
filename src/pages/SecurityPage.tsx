
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

const SecurityPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    document.title = 'Keamanan | KlikJasa';
  }, []);

  const handleChangePassword = () => {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Kata Sandi Tidak Cocok",
        description: "Kata sandi baru dan konfirmasi kata sandi harus sama.",
        variant: "destructive",
      });
      return;
    }

    // Here would be the actual password change logic
    toast({
      title: "Kata Sandi Diubah",
      description: "Kata sandi Anda telah berhasil diubah.",
    });
    
    // Close dialog and reset form
    setChangePasswordOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Keamanan</h1>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Ubah Kata Sandi</h2>
          <p className="text-sm text-gray-500 mb-4">Ubah kata sandi akun KlikJasa Anda untuk menjaga keamanan.</p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setChangePasswordOpen(true)}
          >
            Ubah Kata Sandi
          </Button>
        </CardContent>
      </Card>

      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Kata Sandi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium" htmlFor="old-password">
                Kata Sandi Lama
              </label>
              <Input 
                id="old-password"
                type="password" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="new-password">
                Kata Sandi Baru
              </label>
              <Input 
                id="new-password"
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="confirm-password">
                Konfirmasi Kata Sandi Baru
              </label>
              <Input 
                id="confirm-password"
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setChangePasswordOpen(false)} className="mr-2">
              Batal
            </Button>
            <Button onClick={handleChangePassword}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityPage;
