'use client';

import { ArrowRight, Eye, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product, onQuickView }) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={primaryImage}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {product.category && (
          <span className="product-category-tag">{product.category.name}</span>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.shortDescription}</p>

        {product.material && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="var(--accent-primary)" />
            <span>Material: {product.material}</span>
          </div>
        )}

        <div className="product-card-footer">
          <button
            onClick={() => onQuickView(product)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            <Eye size={15} /> Quick View
          </button>

          <Link
            href={`/products/${product.slug}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            Details <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
