import { Toaster } from 'sonner';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-slate-50 dark:bg-slate-950">
        {children}
        <Toaster position="top-center" richColors dir="rtl" />
      </main>
    </div>
  );
}