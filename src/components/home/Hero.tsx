import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import frame58 from '../../assets/images/Frame58.png';

const Hero: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Sign a Document",
    "get a Document Signed"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex(prev => (prev + 1) % texts.length);
    }, 4000); // Switch every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto pt-10 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight">
          <div className="flex flex-col items-center justify-center">
            <div>The Quick and Easiest way to</div>
            <div className="relative h-[1.2em] overflow-hidden w-full mt-3">
              <div className="absolute w-full text-center">
                <AnimatePresence mode="wait">
                <motion.div
                    key={textIndex}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1,
                      transition: {
                        duration: 0.75,
                        ease: "easeOut",
                        delay: 0.05
                      }
                    }}
                    exit={{ 
                      y: -40, 
                      opacity: 0,
                      transition: {
                        duration: 0.75,
                        ease: "easeIn"
                      }
                    }}
                  >
                    {texts[textIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
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