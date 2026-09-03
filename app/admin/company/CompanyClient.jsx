'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function CompanyClient({ initialCompany }) {
  const [formData, setFormData] = useState({
    name: initialCompany?.name || 'Base Engineering',
    tagline: initialCompany?.tagline || 'Engineering Strength. Built to Perform.',
    aboutHeading: initialCompany?.aboutHeading || 'Built on Engineering. Driven by Reliability.',
    aboutDescription: initialCompany?.aboutDescription || '',
    aboutImage: initialCompany?.aboutImage || '',
    phone: initialCompany?.phone || '',
    email: initialCompany?.email || '',
    address: initialCompany?.address || '',
    website: initialCompany?.website || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (images) => {
    if (images.length > 0) {
      setFormData((prev) => ({ ...prev, aboutImage: images[images.length - 1].url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update company information');
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Company Profile & Contact Information</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Update corporate details, factory contact, and about section on the public website.
        </p>
      </div>

      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <CheckCircle2 size={18} flexShrink={0} />
          <span>Company profile updated successfully!</span>
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
            Corporate Identity
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>Company Legal Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Tagline / Motto</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>About Section Heading</label>
            <input
              type="text"
              name="aboutHeading"
              value={formData.aboutHeading}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>About Company Narrative</label>
            <textarea
              name="aboutDescription"
              rows={5}
              value={formData.aboutDescription}
              onChange={handleChange}
              className="admin-form-textarea"
            />
          </div>

          <div className="admin-form-group">
            <label>About Section Featured Image URL</label>
            <input
              type="text"
              name="aboutImage"
              value={formData.aboutImage}
              onChange={handleChange}
              placeholder="https://..."
              className="admin-form-input"
              style={{ marginBottom: '10px' }}
            />
            <div style={{ maxWidth: '400px' }}>
              <ImageUploader
                images={formData.aboutImage ? [{ url: formData.aboutImage, isPrimary: true }] : []}
                onChange={handleImageUploaded}
              />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
            Works & Sales Contact Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>Direct Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Sales / Support Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Works & Plant Address</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="admin-form-textarea"
            />
          </div>

          <div className="admin-form-group">
            <label>Official Website URL</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '160px' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
