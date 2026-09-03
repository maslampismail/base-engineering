'use client';

export default function Highlights({ highlights = [] }) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section id="highlights" className="highlights-section">
      <div className="container">
        <div className="highlights-grid">
          {highlights.map((item) => (
            <div key={item.id} className="highlight-item">
              <div className="highlight-value">{item.value}</div>
              <div className="highlight-title">{item.title}</div>
              {item.description && (
                <div className="highlight-desc">{item.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
