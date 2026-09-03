'use client';

import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Products from './Products';
import WhyChooseUs from './WhyChooseUs';
import Applications from './Applications';
import Highlights from './Highlights';
import EnquirySection from './EnquirySection';
import Footer from './Footer';

export default function LandingClient({
  company,
  heroSection,
  categories,
  products,
  highlights,
  applications,
}) {
  const [selectedProductId, setSelectedProductId] = useState('');

  const handleSelectProductForEnquiry = (productId) => {
    setSelectedProductId(productId);
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '/#contact');
    }
  };

  return (
    <>
      <Header company={company} />
      <main>
        <Hero section={heroSection} />
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
