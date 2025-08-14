import AdminLayoutContent from './layout-content';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // No auth provider needed
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
