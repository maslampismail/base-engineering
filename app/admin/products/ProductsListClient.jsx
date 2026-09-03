'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Trash2, Edit3, Eye, ExternalLink } from 'lucide-react';

export default function ProductsListClient({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [filterCategory, setFilterCategory] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filterCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === filterCategory);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Products</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Total {products.length} products listed in database
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-form-select"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <Link href="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Thumb</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Material</th>
                <th>Status</th>
                <th>Sort Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => {
                const thumb = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80';
                return (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ width: '48px', height: '42px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                        <img src={thumb} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>/{prod.slug}</div>
                    </td>
                    <td>{prod.category?.name || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{prod.material || 'Structural Steel'}</td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: prod.active ? '#15803D' : '#94A3B8' }}>
                        {prod.active ? '● Active' : '○ Draft'}
                      </span>
                      {prod.featured && (
                        <span style={{ marginLeft: '6px', fontSize: '0.7rem', backgroundColor: '#FEF3C7', color: '#B45309', padding: '1px 5px', borderRadius: '2px', fontWeight: 700 }}>
                          FEATURED
                        </span>
                      )}
                    </td>
                    <td>{prod.sortOrder}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <Link href={`/admin/products/${prod.id}`} className="action-btn">
                          <Edit3 size={13} /> Edit
                        </Link>
                        <Link href={`/products/${prod.slug}`} target="_blank" className="action-btn">
                          <ExternalLink size={13} /> View
                        </Link>
                        <button
                          disabled={deletingId === prod.id}
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="action-btn action-btn-danger"
                          title="Delete product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
