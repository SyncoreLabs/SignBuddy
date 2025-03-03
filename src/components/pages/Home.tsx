import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import Hero from '../home/Hero';
import Steps from '../home/Steps';
import DocumentCreator from '../home/DocumentCreator';
import WhyUs from '../home/WhyUs';

const Home: React.FC = () => {
  usePageTitle('Home');
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <Steps />
      <DocumentCreator />
      <WhyUs />
    </div>
  );
};

export default Home;