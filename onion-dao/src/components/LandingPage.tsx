import React from 'react';
import Navbar from './Navbar'
import Hero from './Hero'
import FAQ from './FAQ'
import Architecture from './Architecture'
import AdvancedFeatures from './AdvancedFeatures'
import UseCases from './UseCases'
import TechnicalDemo from './TechnicalDemo'
import GettingStarted from './GettingStarted'
import Footer from './Footer'

const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <FAQ />
      <Architecture />
      <AdvancedFeatures />
      <UseCases />
      <TechnicalDemo />
      <GettingStarted />
      <Footer />
    </>
  );
};

export default LandingPage; 