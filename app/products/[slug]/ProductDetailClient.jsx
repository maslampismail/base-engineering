'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { ArrowLeft, Send, CheckCircle, Shield, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProductDetailClient({ product, relatedProducts, company }) {
  const [selectedImage, setSelectedImage] = useState(
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
  );

  const [modalProduct, setModalProduct] = useState(null);

  // Embedded enquiry state for this product
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    productId: product.id,
    message: `I am interested in acquiring specifications and a quote for ${product.name}. Please provide delivery schedules and unit pricing.`,
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  let specs = [];
  try {
    if (product.specifications) {
      specs = typeof product.specifications === 'string'
        ? JSON.parse(product.specifications)
        : product.specifications;
    }
  } catch (e) {
    specs = product.specifications?.split('\n').map((line) => {
      const [k, v] = line.split(':');
      return { label: k?.trim(), value: v?.trim() || '' };
    }) || [];
  }

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');

      setSuccessMessage('Thank you! Your quotation enquiry for ' + product.name + ' has been received.');
      setFormData((prev) => ({ ...prev, name: '', phone: '', email: '', company: '' }));
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header company={company} />

      <main style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '40px 0 80px 0' }}>
        <div className="container">
          {/* Breadcrumbs */}
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Link href="/#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <ArrowLeft size={16} /> Back to Products
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-muted)' }}>{product.category?.name || 'Products'}</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
          </div>

          {/* Product Overview Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '44px', marginBottom: '60px' }} className="product-detail-grid">
            {/* Left: Gallery */}
            <div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--steel-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '420px', marginBottom: '16px', boxShadow: 'var(--shadow-card)' }}>
                <img
                  src={selectedImage}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.url)}
                      style={{
                        width: '80px',
                        height: '70px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: selectedImage === img.url ? '2px solid var(--accent-primary)' : '1px solid var(--steel-border)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <img src={img.url} alt={img.alt || product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Enquiry Button */}
            <div>
              <div className="section-badge">
                {product.category?.name || 'Heavy Construction Component'}
              </div>
              <h1 style={{ fontSize: '2.4rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
                {product.name}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                {product.shortDescription}
              </p>

              {product.material && (
                <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', border: '1px solid var(--steel-border)', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={20} color="var(--accent-primary)" />
                  <div>
                    <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Manufacturing Material</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.material}</div>
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {specs && specs.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Technical Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      {specs.map((spec, idx) => (
                        <tr key={idx}>
                          <th>{spec.label}</th>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <a
                href="#enquiry-form"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <Send size={18} /> Enquire About This Product
              </a>
            </div>
          </div>

          {/* Description & Applications */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', marginBottom: '60px' }} className="product-info-grid">
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--steel-border)', borderRadius: 'var(--radius-md)', padding: '32px', boxShadow: 'var(--shadow-subtle)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Engineering Description</h2>
              <p style={{ fontSize: '1.02rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                {product.description}
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--steel-border)', borderRadius: 'var(--radius-md)', padding: '32px', boxShadow: 'var(--shadow-subtle)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Key Field Applications</h2>
              <p style={{ fontSize: '1.02rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {product.applications || 'High-load construction shoring, concrete formwork, and modular access systems.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle size={16} color="var(--accent-primary)" /> Factory load tested to structural limits
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle size={16} color="var(--accent-primary)" /> Precision threads for fast height adjustment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle size={16} color="var(--accent-primary)" /> Corrosion-resistant surface protection options
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Product Quotation Form */}
          <div id="enquiry-form" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--steel-border)', borderRadius: 'var(--radius-md)', padding: '40px', maxWidth: '840px', margin: '0 auto 60px auto', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
              Request Quotation for {product.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
              Submit your project details below to receive bulk pricing, technical drawings, or dispatch timelines.
            </p>

            {successMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                <CheckCircle2 size={20} flexShrink={0} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                <AlertCircle size={20} flexShrink={0} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleEnquirySubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Vikram Verma"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company / Contractor</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Modern Infratech Ltd"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="e.g. purchase@company.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Requirement Details & Quantity *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {submitting ? 'Submitting...' : (
                  <>
                    <Send size={18} /> Submit Quotation Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div>
              <div className="section-header" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.6rem' }}>Related Construction Products</h3>
                <p style={{ color: 'var(--text-muted)' }}>Compatible scaffolding and formwork systems</p>
              </div>

              <div className="products-grid">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={(item) => setModalProduct(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {modalProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onSelectProductForEnquiry={(id) => {
            window.location.href = `/#contact`;
          }}
        />
      )}

      <Footer company={company} />
    </>
  );
}
