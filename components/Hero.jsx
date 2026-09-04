'use client';

import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

export default function Hero({ section, highlights }) {
  const scrollTo = (id) => {
    scrollToSection(id);
  };

  const heading = section?.heading || 'Reliable Engineering Solutions for Modern Construction';
  const subheading = section?.subheading || 'ENGINEERED FOR CONSTRUCTION';
  const description =
    section?.description ||
    'Base Engineering delivers dependable scaffolding and construction support products designed for strength, durability and practical performance.';

  const defaultStats = [
    {
      value: '10+',
      title: 'Years Experience',
      description: 'Proven manufacturing track record and engineering excellence.',
    },
    {
      value: '25+',
      title: 'Products',
      description: 'Standard and custom-engineered scaffolding solutions.',
    },
    {
      value: '100+',
      title: 'Projects',
      description: 'Supplied to premier infrastructure and industrial works.',
    },
    {
      value: '500+',
      title: 'Customers',
      description: 'Trusted by general contractors, builders, and engineers.',
    },
  ];

  const stats = highlights && highlights.length >= 4 ? highlights.slice(0, 4) : defaultStats;

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

        {/* Professional Statistics / Trust Strip */}
        <div className="hero-stats-strip">
          {stats.map((stat, idx) => (
            <div key={stat.id || idx} className="hero-stat-item">
              <div className="hero-stat-number">{stat.value}</div>
              <div className="hero-stat-label">{stat.title}</div>
              <p className="hero-stat-desc">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
