import { AuthProvider } from '@/hooks/use-auth';
import AdminLayoutContent from './layout-content';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
