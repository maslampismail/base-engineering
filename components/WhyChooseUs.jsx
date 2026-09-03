'use client';

import { ShieldCheck, HardHat, Factory, Wrench, HeadphonesIcon } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      title: 'Engineering Quality',
      description: 'Products developed with precision tolerances and practical civil engineering requirements.',
      icon: ShieldCheck,
    },
    {
      title: 'Built for Strength',
      description: 'Engineered with high-tensile steel to perform safely in high-load, demanding construction environments.',
      icon: HardHat,
    },
    {
      title: 'Reliable Manufacturing',
      description: 'Consistent metallurgical testing, automated welding, and rigorous quality inspection protocols.',
      icon: Factory,
    },
    {
      title: 'Practical Solutions',
      description: 'Modular designs created for rapid on-site assembly, ease of handling, and extended reusability.',
      icon: Wrench,
    },
    {
      title: 'Customer Support',
      description: 'Direct technical consultation, fast quotation turnaround, and reliable project site dispatch.',
      icon: HeadphonesIcon,
    },
  ];

  return (
    <section id="why-us" className="section-padding">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">CORE CAPABILITIES</div>
          <h2 className="section-title">Why Choose Base Engineering</h2>
          <p className="section-subtitle">
            Delivering structural reliability and precision engineering across every component.
          </p>
        </div>

        <div className="why-us-grid">
          {points.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <div key={index} className="why-card">
                <div className="why-icon-box">
                  <IconComponent size={24} />
                </div>
                <h3 className="why-title">{point.title}</h3>
                <p className="why-desc">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
