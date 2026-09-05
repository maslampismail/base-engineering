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

  // Fully dynamic: use all active company highlights from admin / DB
  const baseStats = highlights && highlights.length > 0 ? highlights : defaultStats;

  // Repeat items within each cycle if there are few items (e.g. 1, 2, or 3)
  // so a single cycle seamlessly spans wide viewports (at least 6 items per cycle)
  const repeatCount = Math.max(1, Math.ceil(6 / baseStats.length));
  const cycleItems = Array(repeatCount).fill(baseStats).flat();

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

        {/* Dynamic Continuous Horizontal Slider / Marquee (Left-to-Right) */}
        <div className="hero-stats-strip" aria-label="Company Key Highlights">
          <div className="hero-stats-track">
            {/* Primary Cycle */}
            <div className="hero-stats-group">
              {cycleItems.map((stat, idx) => (
                <div key={`hero-stat-g1-${stat.id || idx}-${idx}`} className="hero-stat-item">
                  <div className="hero-stat-header">
                    <span className="hero-stat-number">{stat.value}</span>
                    <span className="hero-stat-label">{stat.title}</span>
                  </div>
                  {stat.description && (
                    <p className="hero-stat-desc" title={stat.description}>
                      {stat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Duplicate Cycle for Seamless Infinite Loop */}
            <div className="hero-stats-group" aria-hidden="true">
              {cycleItems.map((stat, idx) => (
                <div key={`hero-stat-g2-${stat.id || idx}-${idx}`} className="hero-stat-item">
                  <div className="hero-stat-header">
                    <span className="hero-stat-number">{stat.value}</span>
                    <span className="hero-stat-label">{stat.title}</span>
                  </div>
                  {stat.description && (
                    <p className="hero-stat-desc" title={stat.description}>
                      {stat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
