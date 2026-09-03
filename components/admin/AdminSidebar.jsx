'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Building2,
  Sliders,
  Sparkles,
  Compass,
  Inbox,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Company Info', href: '/admin/company', icon: Building2 },
    { label: 'Homepage', href: '/admin/homepage', icon: Sliders },
    { label: 'Highlights', href: '/admin/highlights', icon: Sparkles },
    { label: 'Applications', href: '/admin/applications', icon: Compass },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
    { label: 'Media Files', href: '/admin/media', icon: ImageIcon },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-brand">
          <ShieldCheck size={24} color="var(--accent-primary)" />
          <span>BASE</span> ENG
        </div>
        <span className="admin-sidebar-badge">Control Center</span>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '12px 0' }} />

        <Link
          href="/"
          target="_blank"
          className="admin-nav-link"
          style={{ color: '#60A5FA' }}
        >
          <ExternalLink size={18} />
          <span>View Public Site</span>
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-name">{user?.name || 'Administrator'}</div>
          <div className="admin-user-role">{user?.email || 'admin@baseengineering.com'}</div>
        </div>

        <button
          onClick={handleLogout}
          className="admin-logout-btn"
          title="Sign Out"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
