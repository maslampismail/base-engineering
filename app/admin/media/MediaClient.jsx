'use client';

import { useState } from 'react';
import { UploadCloud, Trash2, Copy, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';

export default function MediaClient({ initialMedia }) {
  const [mediaList, setMediaList] = useState(initialMedia);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this media asset?')) return;

    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleNewUpload = (images) => {
    // Refresh page or fetch updated media list
    window.location.reload();
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Media & Storage Manager</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Assets hosted on Cloudflare R2 bucket (`base-engineering-assets`) with local fallback.
        </p>
      </div>

      <div className="admin-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Upload New File to Storage</h3>
        <ImageUploader images={[]} onChange={handleNewUpload} />
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Stored Assets ({mediaList.length})</div>
        </div>

        <div className="admin-table-container">
          {mediaList.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
              No media files uploaded yet. Use the uploader above.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Preview</th>
                  <th>File Name</th>
                  <th>Storage Key</th>
                  <th>Size</th>
                  <th>Uploaded Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mediaList.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <div style={{ width: '56px', height: '48px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                        <img src={file.url} alt={file.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{file.fileName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{file.mimeType}</div>
                    </td>
                    <td><code style={{ fontSize: '0.8rem' }}>{file.fileKey}</code></td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {file.size ? `${(file.size / 1024).toFixed(1)} KB` : '—'}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{formatDateTime(file.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleCopyUrl(file.id, file.url)}
                          className="action-btn"
                          title="Copy file URL"
                        >
                          {copiedId === file.id ? <Check size={13} color="#15803D" /> : <Copy size={13} />}
                          {copiedId === file.id ? 'Copied' : 'Copy URL'}
                        </button>
                        <a href={file.url} target="_blank" rel="noreferrer" className="action-btn">
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="action-btn action-btn-danger"
                          title="Delete file"
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
    </div>
  );
}
