
import { Alert } from '@/components/ui/alert';

const VerificationInstructions = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 space-y-2">
      <p className="font-medium">Petunjuk Verifikasi KTP:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Pastikan foto KTP jelas dan semua informasi dapat terbaca</li>
        <li>File dalam format JPG, PNG, atau PDF (maksimal 5MB)</li>
        <li>Verifikasi biasanya membutuhkan waktu 1x24 jam</li>
        <li>Anda akan menerima notifikasi setelah verifikasi selesai</li>
      </ul>
    </div>
  );
};

export default VerificationInstructions;
