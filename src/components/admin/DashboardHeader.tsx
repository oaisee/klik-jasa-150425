
import { Briefcase, Calendar, FileText, LayoutDashboard, UserCheck } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col space-y-2 md:space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-marketplace-primary" />
          <span>Dashboard Admin KlikJasa</span>
        </div>
      </h2>
      <div className="text-muted-foreground">
        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>Manajemen Platform</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Laporan Kondisi Sistem</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="h-4 w-4" />
            <span>Verifikasi Penyedia Jasa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
