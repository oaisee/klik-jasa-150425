
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConnectionStatusAlertProps {
  connectionStatus: { success: boolean; message: string } | null;
}

const ConnectionStatusAlert = ({ connectionStatus }: ConnectionStatusAlertProps) => {
  if (!connectionStatus) return null;

  return (
    <Alert variant={connectionStatus.success ? "default" : "destructive"}>
      <div className="flex items-center">
        {connectionStatus.success ? (
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 mr-2" />
        )}
        <AlertTitle>
          {connectionStatus.success ? "Supabase Terhubung" : "Koneksi Supabase Gagal"}
        </AlertTitle>
      </div>
      <AlertDescription className="mt-2">
        {connectionStatus.message}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatusAlert;
