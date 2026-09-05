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

  const defaultHeroImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80';
  const heroImage = section?.imageUrl ? section.imageUrl.trim() : defaultHeroImage;

  const primaryCtaText = section?.primaryCtaText || 'View Products';
  const primaryCtaLink = section?.primaryCtaLink || '#products';
  const secondaryCtaText = section?.secondaryCtaText || 'Get Enquiry';
  const secondaryCtaLink = section?.secondaryCtaLink || '#contact';

  const handleCtaClick = (link) => {
    if (link?.startsWith('#')) {
      scrollTo(link.replace('#', ''));
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.85) 60%, rgba(15, 23, 42, 0.65) 100%), url("${encodeURI(heroImage)}")`,
      }}
    >
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
              onClick={() => handleCtaClick(primaryCtaLink)}
              className="btn btn-primary btn-lg"
            >
              {primaryCtaText} <ArrowRight size={18} />
            </button>

            <button
              onClick={() => handleCtaClick(secondaryCtaLink)}
              className="btn btn-outline-white btn-lg"
            >
              <FileText size={18} /> {secondaryCtaText}
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
                  <div className="hero-stat-number">{stat.value}</div>
                  <div className="hero-stat-label">{stat.title}</div>
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
                  <div className="hero-stat-number">{stat.value}</div>
                  <div className="hero-stat-label">{stat.title}</div>
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
