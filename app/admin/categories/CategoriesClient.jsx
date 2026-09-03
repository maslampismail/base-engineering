'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, AlertCircle } from 'lucide-react';

export default function CategoriesClient({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startCreate = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', sortOrder: categories.length + 1, active: true });
    setIsCreating(true);
    setError('');
  };

  const startEdit = (cat) => {
    setIsCreating(false);
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sortOrder: cat.sortOrder,
      active: cat.active,
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
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');

      if (editingId) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...data.category } : c))
        );
      } else {
        setCategories((prev) => [...prev, { ...data.category, _count: { products: 0 } }]);
      }
      cancelForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Categories</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Organize products into dynamic structural categories
          </p>
        </div>

        {!isCreating && !editingId && (
          <button onClick={startCreate} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <AlertCircle size={18} flexShrink={0} />
          <span>{error}</span>
        </div>
      )}

      {/* Inline Create / Edit Form */}
      {(isCreating || editingId) && (
        <div className="admin-card" style={{ padding: '24px', marginBottom: '24px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>
              {isCreating ? 'Create New Category' : 'Edit Category'}
            </h3>
            <button onClick={cancelForm} className="action-btn">
              <X size={15} /> Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Scaffolding"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. scaffolding (auto-generated if empty)"
                  className="admin-form-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of products in this category"
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
                Active (Show in tabs)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={cancelForm} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                <Save size={15} /> {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Products Count</th>
                <th>Sort Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{cat.name}</div>
                  </td>
                  <td><code>{cat.slug}</code></td>
                  <td style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {cat.description || '—'}
                  </td>
                  <td>
                    <span className="badge-status" style={{ backgroundColor: '#E0E7FF', color: '#4338CA' }}>
                      {cat._count?.products ?? 0} Products
                    </span>
                  </td>
                  <td>{cat.sortOrder}</td>
                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: cat.active ? '#15803D' : '#94A3B8' }}>
                      {cat.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => startEdit(cat)} className="action-btn">
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
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
