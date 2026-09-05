'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function HomepageClient({ initialHero }) {
  const [formData, setFormData] = useState({
    heading: initialHero?.heading || 'Reliable Engineering Solutions for Modern Construction',
    subheading: initialHero?.subheading || 'ENGINEERED FOR CONSTRUCTION',
    description: initialHero?.description || 'Base Engineering delivers dependable scaffolding and construction support products designed for strength, durability and practical performance.',
    primaryCtaText: initialHero?.primaryCtaText || 'View Products',
    primaryCtaLink: initialHero?.primaryCtaLink || '#products',
    secondaryCtaText: initialHero?.secondaryCtaText || 'Get Enquiry',
    secondaryCtaLink: initialHero?.secondaryCtaLink || '#contact',
    imageUrl: initialHero?.imageUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (images) => {
    if (images && images.length > 0) {
      const primary = images.find((img) => img.isPrimary) || images[images.length - 1];
      setFormData((prev) => ({ ...prev, imageUrl: primary?.url || '' }));
    } else {
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey: 'hero', ...formData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update homepage content');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Homepage Content Editor</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Customize the landing page Hero section, call-to-actions, and background photography.
        </p>
      </div>

      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <CheckCircle2 size={18} flexShrink={0} />
          <span>Homepage content updated successfully!</span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <AlertCircle size={18} flexShrink={0} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
            Hero Banner Configuration
          </h3>

          <div className="admin-form-group">
            <label>Subheading Badge Label</label>
            <input
              type="text"
              name="subheading"
              value={formData.subheading}
              onChange={handleChange}
              placeholder="e.g. ENGINEERED FOR CONSTRUCTION"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Main Headline *</label>
            <input
              type="text"
              name="heading"
              required
              value={formData.heading}
              onChange={handleChange}
              placeholder="e.g. Reliable Engineering Solutions for Modern Construction"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Hero Description Paragraph</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="admin-form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>Primary Button Label</label>
              <input
                type="text"
                name="primaryCtaText"
                value={formData.primaryCtaText}
                onChange={handleChange}
                placeholder="View Products"
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Primary Button Target (Anchor / Link)</label>
              <input
                type="text"
                name="primaryCtaLink"
                value={formData.primaryCtaLink}
                onChange={handleChange}
                placeholder="#products"
                className="admin-form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>Secondary Button Label</label>
              <input
                type="text"
                name="secondaryCtaText"
                value={formData.secondaryCtaText}
                onChange={handleChange}
                placeholder="Get Enquiry"
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Secondary Button Target (Anchor / Link)</label>
              <input
                type="text"
                name="secondaryCtaLink"
                value={formData.secondaryCtaLink}
                onChange={handleChange}
                placeholder="#contact"
                className="admin-form-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Hero Background Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="admin-form-input"
              style={{ marginBottom: '10px' }}
            />
            <div style={{ maxWidth: '400px' }}>
              <ImageUploader
                images={formData.imageUrl ? [{ url: formData.imageUrl, isPrimary: true }] : []}
                onChange={handleImageUploaded}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '160px' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Hero Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
