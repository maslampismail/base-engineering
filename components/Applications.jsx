'use client';

export default function Applications({ applications = [] }) {
  return (
    <section id="applications" className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--steel-border)', borderBottom: '1px solid var(--steel-border)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">SECTOR REACH</div>
          <h2 className="section-title">Applications & Industries</h2>
          <p className="section-subtitle">
            Engineered systems deployed across critical infrastructure and commercial builds.
          </p>
        </div>

        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-image-wrap">
                <img
                  src={app.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80'}
                  alt={app.title}
                  className="application-image"
                  loading="lazy"
                />
              </div>
              <div className="application-content">
                <h3 className="application-title">{app.title}</h3>
                <p className="application-desc">{app.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
