'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EnquirySection({ company, products = [], selectedProductId, onClearSelectedProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    productId: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill selected product if passed from a Quick View modal or product page
  useEffect(() => {
    if (selectedProductId) {
      setFormData((prev) => ({ ...prev, productId: selectedProductId }));
    }
  }, [selectedProductId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccessMessage(data.message || 'Enquiry submitted successfully! Our team will get back to you shortly.');
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        productId: '',
        message: '',
      });
      if (onClearSelectedProduct) onClearSelectedProduct();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">GET IN TOUCH</div>
          <h2 className="section-title">Looking for Reliable Construction Products?</h2>
          <p className="section-subtitle">
            Contact Base Engineering for product specifications, project quotations, and custom fabrication enquiries.
          </p>
        </div>

        <div className="contact-grid">
          {/* Company Contact Details */}
          <div className="contact-info-panel">
            <div className="contact-info-card">
              <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                Manufacturing & Sales Office
              </h3>

              <div className="contact-detail-row">
                <div className="contact-detail-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-detail-title">Direct Sales Line</div>
                  <div className="contact-detail-text">
                    <a href={`tel:${company?.phone || '+91 98765 43210'}`}>
                      {company?.phone || '+91 98765 43210'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-detail-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="contact-detail-title">Email Inquiries</div>
                  <div className="contact-detail-text">
                    <a href={`mailto:${company?.email || 'info@baseengineering.com'}`}>
                      {company?.email || 'info@baseengineering.com'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-detail-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="contact-detail-title">Works & Facility</div>
                  <div className="contact-detail-text" style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                    {company?.address || 'Plot No. 42, Heavy Industrial Estate, Engineering Corridor, India'}
                  </div>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-detail-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="contact-detail-title">Operating Hours</div>
                  <div className="contact-detail-text" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    Monday - Saturday: 8:30 AM – 6:30 PM
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 24px', backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--accent-primary)', marginBottom: '6px', fontSize: '1.05rem' }}>
                Direct Project Quotations
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Have high-volume contractor requirements or tender schedules? Send your BOQ or specifications directly to our engineering desk.
              </p>
            </div>
          </div>

          {/* Interactive Enquiry Form */}
          <div className="enquiry-form-card">
            <h3 style={{ marginBottom: '8px', fontSize: '1.3rem' }}>Send Product Enquiry</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Fill out the form below and an engineer will respond with a quote.
            </p>

            {successMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.92rem' }}>
                <CheckCircle2 size={20} flexShrink={0} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.92rem' }}>
                <AlertCircle size={20} flexShrink={0} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Sharma"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company / Contractor</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Apex Infra Projects"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. procurement@company.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product of Interest</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- General Enquiry / Multiple Products --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.category ? `(${p.category.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message / Requirement Details *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Specify quantity required, preferred delivery location, specifications, or request a quotation..."
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {loading ? 'Submitting Enquiry...' : (
                  <>
                    <Send size={18} /> Send Enquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
