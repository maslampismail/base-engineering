'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

export default function Footer({ company }) {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    scrollToSection(targetId);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Brand Summary */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={26} color="var(--accent-primary)" />
              <h3 style={{ margin: 0 }}>
                <span>BASE</span> ENGINEERING
              </h3>
            </div>
            <p>
              {company?.tagline || 'Engineering Strength. Built to Perform.'}
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>
              Industrial manufacturer and supplier of heavy-duty scaffolding jacks, spans, shuttering plates, props, and structural steel accessories.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <a href="/#hero" onClick={(e) => handleNavClick(e, 'hero')}>Home</a>
              </li>
              <li>
                <a href="/#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</a>
              </li>
              <li>
                <a href="/#products" onClick={(e) => handleNavClick(e, 'products')}>Our Products</a>
              </li>
              <li>
                <a href="/#why-us" onClick={(e) => handleNavClick(e, 'why-us')}>Why Base Engineering</a>
              </li>
              <li>
                <a href="/#applications" onClick={(e) => handleNavClick(e, 'applications')}>Applications</a>
              </li>
              <li>
                <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact / Enquiry</a>
              </li>
            </ul>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="footer-col-title">Products</h4>
            <ul className="footer-links">
              <li><a href="/#products" onClick={(e) => handleNavClick(e, 'products')}>Scaffolding Jacks</a></li>
              <li><a href="/#products" onClick={(e) => handleNavClick(e, 'products')}>Acrow Spans</a></li>
              <li><a href="/#products" onClick={(e) => handleNavClick(e, 'products')}>Shuttering Plates</a></li>
              <li><a href="/#products" onClick={(e) => handleNavClick(e, 'products')}>Telescopic Props</a></li>
              <li><a href="/#products" onClick={(e) => handleNavClick(e, 'products')}>U Jacks & Base Jacks</a></li>
              <li><a href="/#products" onClick={(e) => handleNavClick(e, 'products')}>Accessories & Clamps</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-col-title">Contact Works</h4>
            <div className="footer-contact-item">
              <Phone size={18} />
              <div>
                <a href={`tel:${company?.phone || '+91 98765 43210'}`}>
                  {company?.phone || '+91 98765 43210'}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <Mail size={18} />
              <div>
                <a href={`mailto:${company?.email || 'info@baseengineering.com'}`}>
                  {company?.email || 'info@baseengineering.com'}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={18} />
              <div>
                {company?.address || 'Plot No. 42, Heavy Industrial Estate, Engineering Corridor, India'}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Base Engineering. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Engineered for Safety & Reliability</span>
            <Link
              href="/admin"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-light-muted)', fontSize: '0.8rem' }}
            >
              <Lock size={12} /> Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
