'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, AlertCircle } from 'lucide-react';

export default function HighlightsClient({ initialHighlights }) {
  const [highlights, setHighlights] = useState(initialHighlights);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    value: '',
    description: '',
    sortOrder: 0,
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startCreate = () => {
    setEditingId(null);
    setForm({ title: '', value: '', description: '', sortOrder: highlights.length + 1, active: true });
    setIsCreating(true);
    setError('');
  };

  const startEdit = (item) => {
    setIsCreating(false);
    setEditingId(item.id);
    setForm({
      title: item.title,
      value: item.value,
      description: item.description || '',
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
      const url = editingId ? `/api/highlights/${editingId}` : '/api/highlights';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save highlight');

      if (editingId) {
        setHighlights((prev) =>
          prev.map((h) => (h.id === editingId ? data.highlight : h)).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        );
      } else {
        setHighlights((prev) => [...prev, data.highlight].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      }
      cancelForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete highlight "${title}"?`)) return;

    try {
      const res = await fetch(`/api/highlights/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Company Highlights & Statistics</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Edit key metrics displayed on the dark statistics banner on the homepage.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button onClick={startCreate} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Highlight
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
              {isCreating ? 'Add New Highlight' : 'Edit Highlight'}
            </h3>
            <button onClick={cancelForm} className="action-btn">
              <X size={15} /> Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label>Metric Value (e.g. 10+, 500+) *</label>
                <input
                  type="text"
                  required
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="10+"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Title / Label (e.g. Years Experience) *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Years Experience"
                  className="admin-form-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Supporting Description (Optional)</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief explanatory note"
                className="admin-form-input"
              />
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
                Active (Visible on homepage)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={cancelForm} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                <Save size={15} /> {saving ? 'Saving...' : 'Save Highlight'}
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
                <th>Value</th>
                <th>Title</th>
                <th>Description</th>
                <th>Sort Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {highlights.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {item.value}
                    </span>
                  </td>
                  <td><div style={{ fontWeight: 600 }}>{item.title}</div></td>
                  <td style={{ fontSize: '0.85rem', color: '#64748B' }}>{item.description || '—'}</td>
                  <td>{item.sortOrder}</td>
                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: item.active ? '#15803D' : '#94A3B8' }}>
                      {item.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => startEdit(item)} className="action-btn">
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
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
