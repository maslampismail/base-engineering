'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Header({ company }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/#hero' },
    { label: 'About', href: '/#about' },
    { label: 'Products', href: '/#products' },
    { label: 'Why Us', href: '/#why-us' },
    { label: 'Applications', href: '/#applications' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${targetId}`);
      }
    }
  };

  return (
    <header
      className="header-wrapper"
      style={{
        boxShadow: isScrolled ? '0 4px 12px rgba(15, 23, 42, 0.08)' : 'none',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="container">
        <div className="header-inner">
          <Link href="/#hero" className="brand-logo" onClick={(e) => handleNavClick(e, '/#hero')}>
            <div className="brand-name">
              <ShieldCheck size={26} color="var(--accent-primary)" strokeWidth={2.4} />
              <span>BASE</span> ENGINEERING
            </div>
            <div className="brand-tagline">
              {company?.tagline || 'Engineering Strength. Built to Perform.'}
            </div>
          </Link>

          <nav>
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.label} className="nav-item">
                  <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-cta-group">
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, '/#contact')}
              className="btn btn-primary desktop-cta"
            >
              Get Enquiry <ArrowRight size={16} />
            </a>

            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#contact"
            onClick={(e) => handleNavClick(e, '/#contact')}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Get Enquiry <ArrowRight size={16} />
          </a>
        </div>
      )}
    </header>
  );
}
