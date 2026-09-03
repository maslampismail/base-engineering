'use client';

import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export default function Hero({ section }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `/#${id}`);
    }
  };

  const heading = section?.heading || 'Reliable Engineering Solutions for Modern Construction';
  const subheading = section?.subheading || 'ENGINEERED FOR CONSTRUCTION';
  const description =
    section?.description ||
    'Base Engineering delivers dependable scaffolding and construction support products designed for strength, durability and practical performance.';

  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <CheckCircle2 size={15} />
            <span>{subheading}</span>
          </div>

          <h1 className="hero-title">{heading}</h1>

          <p className="hero-description">{description}</p>

          <div className="hero-ctas">
            <button
              onClick={() => scrollTo('products')}
              className="btn btn-primary btn-lg"
            >
              View Products <ArrowRight size={18} />
            </button>

            <button
              onClick={() => scrollTo('contact')}
              className="btn btn-outline-white btn-lg"
            >
              <FileText size={18} /> Get Enquiry
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
