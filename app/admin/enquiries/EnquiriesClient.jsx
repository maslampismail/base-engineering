'use client';

import { useState } from 'react';
import { Phone, Mail, Trash2, Eye, X, CheckCircle, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function EnquiriesClient({ initialEnquiries }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeModalEnquiry, setActiveModalEnquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
        if (activeModalEnquiry && activeModalEnquiry.id === id) {
          setActiveModalEnquiry((prev) => ({ ...prev, status }));
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;

    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (activeModalEnquiry?.id === id) setActiveModalEnquiry(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = filterStatus === 'ALL'
    ? enquiries
    : enquiries.filter((e) => e.status === filterStatus);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Product Quotations & Inquiries</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Direct leads submitted by contractors, builders, and procurement officers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`category-tab-btn ${filterStatus === s ? 'active' : ''}`}
            >
              {s} ({s === 'ALL' ? enquiries.length : enquiries.filter((e) => e.status === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              No enquiries match the selected filter.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client / Contractor</th>
                  <th>Product Requested</th>
                  <th>Contact Details</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Message Preview</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{item.name}</div>
                      {item.company && (
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.company}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>
                        {item.product?.name || 'General Inquiry'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} color="var(--accent-primary)" />
                        <a href={`tel:${item.phone}`}>{item.phone}</a>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} />
                        <a href={`mailto:${item.email}`}>{item.email}</a>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{formatDateTime(item.createdAt)}</td>
                    <td>
                      <span className={`badge-status ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.88rem', color: '#475569' }}>
                        {item.message}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setActiveModalEnquiry(item)}
                          className="action-btn"
                          title="View Details"
                        >
                          <Eye size={13} /> View
                        </button>

                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="admin-form-select"
                          style={{ padding: '4px 8px', fontSize: '0.78rem', width: 'auto' }}
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="CLOSED">Closed</option>
                        </select>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="action-btn action-btn-danger"
                          title="Delete enquiry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {activeModalEnquiry && (
        <div className="modal-overlay" onClick={() => setActiveModalEnquiry(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className={`badge-status ${activeModalEnquiry.status.toLowerCase()}`}>
                  {activeModalEnquiry.status}
                </span>
                <h3 style={{ marginTop: '4px', fontSize: '1.25rem' }}>Enquiry Details</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveModalEnquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Client Name</div>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{activeModalEnquiry.name}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Company</div>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{activeModalEnquiry.company || 'Individual / Unspecified'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Phone</div>
                  <div style={{ fontWeight: 600 }}>
                    <a href={`tel:${activeModalEnquiry.phone}`} style={{ color: 'var(--accent-primary)' }}>
                      {activeModalEnquiry.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Email</div>
                  <div style={{ fontWeight: 600 }}>
                    <a href={`mailto:${activeModalEnquiry.email}`} style={{ color: 'var(--accent-primary)' }}>
                      {activeModalEnquiry.email}
                    </a>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Product Specified</div>
                  <div style={{ fontWeight: 600 }}>{activeModalEnquiry.product?.name || 'General Inquiry'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Received Time</div>
                  <div style={{ color: '#475569', fontSize: '0.9rem' }}>{formatDateTime(activeModalEnquiry.createdAt)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Requirement Message</div>
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {activeModalEnquiry.message}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleStatusChange(activeModalEnquiry.id, 'NEW')}
                    className={`btn btn-sm ${activeModalEnquiry.status === 'NEW' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Mark New
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeModalEnquiry.id, 'CONTACTED')}
                    className={`btn btn-sm ${activeModalEnquiry.status === 'CONTACTED' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeModalEnquiry.id, 'CLOSED')}
                    className={`btn btn-sm ${activeModalEnquiry.status === 'CLOSED' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Mark Closed
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(activeModalEnquiry.id)}
                  className="action-btn action-btn-danger"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
