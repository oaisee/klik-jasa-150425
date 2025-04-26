
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: 'verification' | 'transaction' | 'system';
  link?: string;
}

const NotificationsPopover = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // For demo purposes, let's create some mock notifications with links
  useEffect(() => {
    setLoading(true);
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Permintaan Verifikasi Baru',
        message: 'Ada 3 permintaan verifikasi KTP baru yang menunggu persetujuan',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
        type: 'verification',
        link: '/admin/dashboard?tab=verifications'
      },
      {
        id: '2',
        title: 'Transaksi Baru',
        message: 'Ada 5 transaksi baru dalam 24 jam terakhir',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
        type: 'transaction',
        link: '/admin/dashboard?tab=transactions'
      },
      {
        id: '3',
        title: 'Pembaruan Sistem',
        message: 'Sistem telah diperbarui ke versi terbaru',
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        read: true,
        type: 'system',
        link: '/admin/dashboard?tab=settings'
      }
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Baru saja';
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const getNotificationBgColor = (notification: Notification) => {
    if (!notification.read) {
      return 'bg-blue-50';
    }
    return '';
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    // In a real app, you would update the read status in Supabase
  };

  const markAsRead = (id: string, link?: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    
    // Close the popover
    setOpen(false);
    
    // Navigate to the linked page if provided
    if (link) {
      navigate(link);
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate('/admin/dashboard?tab=notifications');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 h-5 min-w-5 bg-red-500 text-white"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Notifikasi</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2" 
              onClick={markAllAsRead}
            >
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Memuat notifikasi...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Tidak ada notifikasi</div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${getNotificationBgColor(notification)}`}
                onClick={() => markAsRead(notification.id, notification.link)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
              </div>
            ))
          )}
        </div>
        <Separator />
        <div className="p-2 text-center">
          <Button variant="ghost" size="sm" className="text-xs" onClick={handleViewAll}>
            Lihat Semua Notifikasi
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
