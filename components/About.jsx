'use client';

import { Shield, Wrench, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function About({ company }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `/#${id}`);
    }
  };

  const aboutHeading = company?.aboutHeading || 'Built on Engineering. Driven by Reliability.';
  const aboutDescription =
    company?.aboutDescription ||
    'Base Engineering delivers heavy-duty scaffolding and construction support products designed for maximum strength, durability, and practical performance on demanding job sites.';
  const aboutImage =
    company?.aboutImage ||
    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=80';

  const capabilities = [
    { title: 'High-Tensile Structural Steel', icon: Shield },
    { title: 'Precision CNC Threading & Welding', icon: Wrench },
    { title: 'Strict Safety Load Compliance', icon: CheckCircle },
    { title: 'Dependable Project Delivery', icon: Clock },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <img
              src={aboutImage}
              alt="Base Engineering Manufacturing Quality"
              className="about-image"
            />
            <div className="about-image-badge">
              <h4>Engineering Excellence</h4>
              <p>Heavy-duty construction standards since inception</p>
            </div>
          </div>

          <div className="about-content">
            <div className="section-badge">ABOUT BASE ENGINEERING</div>
            <h2>{aboutHeading}</h2>
            <p>{aboutDescription}</p>

            <div className="about-features-list">
              {capabilities.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="about-feature-item">
                    <IconComponent size={18} className="about-feature-icon" />
                    <span>{item.title}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => scrollTo('why-us')}
              className="btn btn-secondary"
            >
              Know More About Us <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
