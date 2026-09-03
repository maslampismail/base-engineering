import { getAdminSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import '@/styles/admin.css';

export const metadata = {
  title: 'Base Engineering Admin Control Center',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();

  // If not authenticated, the child (or login page) will handle redirection,
  // or if rendered directly without session, provide login screen
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar user={session} />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-page-title">Management Console</div>
          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Base Engineering Works &bull; Active Production
          </div>
        </header>
        <main className="admin-body">
          {children}
        </main>
      </div>
    </div>
  );
}
