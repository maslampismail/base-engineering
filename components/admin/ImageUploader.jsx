'use client';

import { useState } from 'react';
import { UploadCloud, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError('');

    const newImages = [...images];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        newImages.push({
          url: data.url,
          objectKey: data.objectKey,
          alt: file.name,
          isPrimary: newImages.length === 0,
        });
      } catch (err) {
        console.error('Upload error:', err);
        setError(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setUploading(false);
    onChange(newImages);
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    // If we removed the primary image, make the first one primary
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  const handleSetPrimary = (index) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  };

  return (
    <div>
      <label
        htmlFor="file-upload-input"
        className="image-upload-box"
        style={{ display: 'block' }}
      >
        <UploadCloud size={32} color="var(--accent-primary)" style={{ margin: '0 auto 8px auto' }} />
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {uploading ? 'Uploading to Storage...' : 'Click to Upload Images'}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          JPG, PNG, WEBP (stored in Cloudflare R2 / local assets)
        </div>
        <input
          id="file-upload-input"
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>

      {error && (
        <div style={{ color: '#DC2626', fontSize: '0.85rem', marginTop: '8px' }}>
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="uploaded-preview-grid">
          {images.map((img, index) => (
            <div key={index} className="uploaded-preview-item" style={{ border: img.isPrimary ? '2px solid var(--accent-primary)' : '1px solid #CBD5E1' }}>
              <img src={img.url} alt={img.alt || 'Upload preview'} />
              <button
                type="button"
                className="preview-delete-btn"
                onClick={() => handleRemove(index)}
                title="Remove image"
              >
                <Trash2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleSetPrimary(index)}
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '4px',
                  background: img.isPrimary ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.75)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {img.isPrimary ? 'Primary' : 'Make Primary'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
