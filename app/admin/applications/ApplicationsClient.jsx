'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ApplicationsClient({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    sortOrder: 0,
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80',
      sortOrder: applications.length + 1,
      active: true,
    });
    setIsCreating(true);
    setError('');
  };

  const startEdit = (item) => {
    setIsCreating(false);
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || '',
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setError('');
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editingId ? `/api/applications/${editingId}` : '/api/applications';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save application');

      if (editingId) {
        setApplications((prev) =>
          prev.map((a) => (a.id === editingId ? data.application : a))
        );
      } else {
        setApplications((prev) => [...prev, data.application]);
      }
      cancelForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete application card "${title}"?`)) return;

    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Applications & Industries</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Configure the industrial sectors and application showcases on the homepage.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button onClick={startCreate} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Application
          </button>
        )}
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <AlertCircle size={18} flexShrink={0} />
          <span>{error}</span>
        </div>
      )}

      {(isCreating || editingId) && (
        <div className="admin-card" style={{ padding: '24px', marginBottom: '24px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>
              {isCreating ? 'Add New Sector Application' : 'Edit Sector Application'}
            </h3>
            <button onClick={cancelForm} className="action-btn">
              <X size={15} /> Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="admin-form-group">
              <label>Application / Sector Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Infrastructure & Bridges"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="How Base Engineering scaffolding/formwork products are used in this sector..."
                className="admin-form-textarea"
              />
            </div>

            <div className="admin-form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="admin-form-input"
                style={{ marginBottom: '10px' }}
              />
              <div style={{ maxWidth: '400px' }}>
                <ImageUploader
                  images={form.imageUrl ? [{ url: form.imageUrl, isPrimary: true }] : []}
                  onChange={(imgs) => imgs.length > 0 && setForm((f) => ({ ...f, imageUrl: imgs[imgs.length - 1].url }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '120px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '20px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Active (Visible on public site)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={cancelForm} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                <Save size={15} /> {saving ? 'Saving...' : 'Save Application'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Thumb</th>
                <th>Title</th>
                <th>Description</th>
                <th>Sort Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ width: '56px', height: '42px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                      <img src={app.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=200&q=80'} alt={app.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td><div style={{ fontWeight: 600 }}>{app.title}</div></td>
                  <td style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '300px' }}>{app.description}</td>
                  <td>{app.sortOrder}</td>
                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: app.active ? '#15803D' : '#94A3B8' }}>
                      {app.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => startEdit(app)} className="action-btn">
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app.id, app.title)}
                        className="action-btn action-btn-danger"
                      >
                        <Trash2 size={13} />
                      </button>
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
