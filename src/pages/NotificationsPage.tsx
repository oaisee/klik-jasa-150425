
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Notifikasi | KlikJasa';
  }, []);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Notifikasi</h1>
      </div>

      <div className="p-4 text-center text-gray-500">
        <p>Belum ada notifikasi untuk ditampilkan.</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
