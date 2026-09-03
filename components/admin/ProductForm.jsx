'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import { Plus, Trash2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProductForm({ initialData = null, categories = [] }) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  let initialSpecs = [];
  try {
    if (initialData?.specifications) {
      initialSpecs = typeof initialData.specifications === 'string'
        ? JSON.parse(initialData.specifications)
        : initialData.specifications;
    }
  } catch (e) {
    initialSpecs = [];
  }

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    categoryId: initialData?.categoryId || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    material: initialData?.material || '',
    applications: initialData?.applications || '',
    featured: initialData?.featured || false,
    active: initialData?.active !== undefined ? initialData.active : true,
    sortOrder: initialData?.sortOrder || 0,
    images: initialData?.images || [],
  });

  const [specs, setSpecs] = useState(
    initialSpecs.length > 0
      ? initialSpecs
      : [
          { label: 'Standard Dimensions', value: '' },
          { label: 'Safe Working Load', value: '' },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpecChange = (index, field, val) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const handleAddSpecRow = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        specifications: specs.filter((s) => s.label.trim() !== ''),
      };

      const url = isEdit ? `/api/products/${initialData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save product');

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/admin/products" className="action-btn">
          <ArrowLeft size={16} /> Back
        </Link>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          {isEdit ? `Edit Product: ${initialData.name}` : 'Add New Industrial Product'}
        </h2>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <AlertCircle size={18} flexShrink={0} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
            Basic Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Heavy Duty Scaffolding Jack"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="admin-form-select"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>URL Slug (Optional - auto generated if blank)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. heavy-duty-scaffolding-jack"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Short Description (for cards and previews) *</label>
            <input
              type="text"
              name="shortDescription"
              required
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Heavy-duty adjustable support component designed for stable base load distribution."
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Full Engineering Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the component, load ratings, manufacturing tolerances, and threading..."
              className="admin-form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>Material & Grade</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g. High Tensile Structural Steel (IS 2062 / IS 1161)"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Key Field Applications</label>
              <input
                type="text"
                name="applications"
                value={formData.applications}
                onChange={handleChange}
                placeholder="e.g. Slab shuttering, cuplock towers, bridge pier falsework"
                className="admin-form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              Active (Visible on public site)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Product
            </label>
          </div>
        </div>

        {/* Product Images */}
        <div className="admin-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
            Product Images (Cloudflare R2 Storage)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>
            Upload multiple high-resolution photos. The primary image is displayed on the product card and hero highlights.
          </p>

          <ImageUploader
            images={formData.images}
            onChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))}
          />
        </div>

        {/* Technical Specifications Table */}
        <div className="admin-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Technical Specifications</h3>
            <button
              type="button"
              onClick={handleAddSpecRow}
              className="action-btn action-btn-primary"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>

          {specs.map((spec, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Parameter / Dimension (e.g. Base Plate)"
                value={spec.label}
                onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                className="admin-form-input"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Specification Value (e.g. 150x150x6mm)"
                value={spec.value}
                onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                className="admin-form-input"
                style={{ flex: 1.5 }}
              />
              <button
                type="button"
                onClick={() => handleRemoveSpecRow(idx)}
                className="action-btn action-btn-danger"
                title="Remove row"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Submit Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '20px' }}>
          <Link href="/admin/products" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ minWidth: '160px' }}
          >
            {saving ? 'Saving...' : (
              <>
                <Save size={18} /> {isEdit ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
