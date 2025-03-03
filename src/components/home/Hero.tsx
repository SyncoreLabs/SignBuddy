import React from 'react';
import frame58 from '../../assets/images/Frame58.png';

const Hero: React.FC = () => {
  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto pt-10 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight">
          Legal Agreements Simplified
          <span className="block mt-2">Like Never Before</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-xs sm:max-w-2xl mx-auto sm:px-0">
          Create and sign legally binding documents in minutes. Our platform simplifies complex agreements 
          with secure e-signatures and automated workflows.
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden">
          <img 
            src={frame58} 
            alt="Dashboard Preview" 
            className="w-full h-auto object-cover scale-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;