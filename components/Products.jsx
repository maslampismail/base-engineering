'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

export default function Products({ products = [], categories = [], onSelectProductForEnquiry }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category?.slug === activeCategory);

  return (
    <section id="products" className="section-padding products-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">ENGINEERED PRODUCTS</div>
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">
            Reliable components built for demanding construction environments.
          </p>
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div className="category-tabs">
          <button
            className={`category-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.slug === cat.slug).length;
            return (
              <button
                key={cat.id}
                className={`category-tab-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p>No products available in this category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProductForEnquiry={onSelectProductForEnquiry}
        />
      )}
    </section>
  );
}
