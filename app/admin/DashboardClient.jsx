'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Layers, Inbox, CheckCircle2, ArrowRight, Eye, Phone, Mail } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function DashboardClient({ stats, recentEnquiries: initialEnquiries, recentProducts }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Products</div>
            <div className="kpi-value">{stats.totalProducts}</div>
          </div>
          <div className="kpi-icon-wrap">
            <Package size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Products</div>
            <div className="kpi-value">{stats.activeProducts}</div>
          </div>
          <div className="kpi-icon-wrap" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Categories</div>
            <div className="kpi-value">{stats.totalCategories}</div>
          </div>
          <div className="kpi-icon-wrap" style={{ backgroundColor: '#E0E7FF', color: '#4338CA' }}>
            <Layers size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">New Enquiries</div>
            <div className="kpi-value">{stats.newEnquiries}</div>
          </div>
          <div className="kpi-icon-wrap" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <Inbox size={24} />
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">
          + Add New Product
        </Link>
        <Link href="/admin/enquiries" className="btn btn-secondary btn-sm">
          View All Enquiries
        </Link>
        <Link href="/admin/company" className="btn btn-secondary btn-sm">
          Edit Company Profile
        </Link>
        <Link href="/admin/media" className="btn btn-secondary btn-sm">
          Upload Assets
        </Link>
      </div>

      {/* Recent Enquiries */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Recent Inquiries & Quotation Requests</div>
          <Link href="/admin/enquiries" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All ({stats.totalEnquiries}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-table-container">
          {enquiries.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
              No inquiries received yet.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client / Contractor</th>
                  <th>Product</th>
                  <th>Contact Info</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{item.name}</div>
                      {item.company && (
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.company}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>
                        {item.product?.name || 'General Requirement'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} color="var(--accent-primary)" /> {item.phone}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} /> {item.email}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{formatDateTime(item.createdAt)}</td>
                    <td>
                      <span className={`badge-status ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        {item.status === 'NEW' && (
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleStatusChange(item.id, 'CONTACTED')}
                            className="action-btn action-btn-primary"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {item.status === 'CONTACTED' && (
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleStatusChange(item.id, 'CLOSED')}
                            className="action-btn"
                          >
                            Close
                          </button>
                        )}
                        {item.status === 'CLOSED' && (
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleStatusChange(item.id, 'NEW')}
                            className="action-btn"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Products */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Production Catalog Overview</div>
          <Link href="/admin/products" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Manage Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Material</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{prod.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>slug: {prod.slug}</div>
                  </td>
                  <td>{prod.category?.name || 'Unassigned'}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: prod.active ? '#15803D' : '#94A3B8' }}>
                      {prod.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {prod.material || 'Standard Grade Steel'}
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <Link href={`/admin/products/${prod.id}`} className="action-btn">
                        Edit
                      </Link>
                      <Link href={`/products/${prod.slug}`} target="_blank" className="action-btn">
                        <Eye size={12} /> View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
