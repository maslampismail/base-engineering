'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Products from './Products';
import WhyChooseUs from './WhyChooseUs';
import Applications from './Applications';
import Highlights from './Highlights';
import EnquirySection from './EnquirySection';
import Footer from './Footer';
import { scrollToSection } from '@/lib/utils';

export default function LandingClient({
  company,
  heroSection,
  categories,
  products,
  highlights,
  applications,
}) {
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      scrollToSection(targetId);
    }
  }, []);

  const handleSelectProductForEnquiry = (productId) => {
    setSelectedProductId(productId);
    scrollToSection('contact');
  };

  return (
    <>
      <Header company={company} />
      <main>
        <Hero section={heroSection} highlights={highlights} />
        <About company={company} />
        <Products
          products={products}
          categories={categories}
          onSelectProductForEnquiry={handleSelectProductForEnquiry}
        />
        <WhyChooseUs />
        <Applications applications={applications} />
        <Highlights highlights={highlights} />
        <EnquirySection
          company={company}
          products={products}
          selectedProductId={selectedProductId}
          onClearSelectedProduct={() => setSelectedProductId('')}
        />
      </main>
      <Footer company={company} />
    </>
  );
}
