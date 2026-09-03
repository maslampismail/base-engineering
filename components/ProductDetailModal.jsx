'use client';

import { X, Send, ExternalLink, ShieldCheck, Layers } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailModal({ product, onClose, onSelectProductForEnquiry }) {
  if (!product) return null;

  let specs = [];
  try {
    if (product.specifications) {
      specs = typeof product.specifications === 'string'
        ? JSON.parse(product.specifications)
        : product.specifications;
    }
  } catch (e) {
    // If not JSON, parse line by line
    specs = product.specifications.split('\n').map((line) => {
      const [k, v] = line.split(':');
      return { label: k?.trim(), value: v?.trim() || '' };
    });
  }

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';

  const handleEnquire = () => {
    onSelectProductForEnquiry(product.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-badge" style={{ marginBottom: '4px' }}>
              {product.category?.name || 'Industrial Product'}
            </span>
            <h3 style={{ fontSize: '1.4rem' }}>{product.name}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px', backgroundColor: 'var(--bg-surface-alt)' }}>
              <img
                src={primaryImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Overview</h4>
              <p style={{ fontSize: '0.95rem', marginBottom: '16px' }}>{product.shortDescription}</p>

              {product.material && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Material: </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{product.material}</span>
                </div>
              )}

              {product.applications && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Key Applications: </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{product.applications}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={handleEnquire} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <Send size={15} /> Enquire Now
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <ExternalLink size={15} /> Full Page
                </Link>
              </div>
            </div>
          </div>

          {specs && specs.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Technical Specifications</h4>
              <table className="specs-table">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i}>
                      <th>{spec.label}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.description && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Engineering Details</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
