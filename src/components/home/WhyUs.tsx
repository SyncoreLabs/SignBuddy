import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import frame58 from '../../assets/images/Frame58.png';
import createIcon from '../../assets/images/create-icon.png';
import manageIcon from '../../assets/images/manage-icon.png';
import securityIcon from '../../assets/images/security-icon.png';
import goalIcon from '../../assets/images/Goal.png';
import vectorIcon from '../../assets/images/Vector.png';

interface CountData {
  users: number;
  documents: number;
  days: string;
}

const WhyUs: React.FC = () => {
  const [counts, setCounts] = useState<CountData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('https://server.signbuddy.in/api/v1/getcount');
        const data = await response.json();
        if (data.success) {
          setCounts(data.count);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto mt-16 mb-16 px-4 py-10">
        <div className="flex flex-col gap-4 sm:gap-8">
          {/* Top Section */}
          <div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold">
              Why us and what<br className="hidden sm:block" />drives us ?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-2 max-w-[350px] sm:max-w-none">
              We're committed to making document management simple, secure, and accessible for everyone.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Left Section - Features */}
            <div className="md:col-span-1 h-[520px] sm:h-[520px]">
              <div className="bg-black/40 rounded-lg p-4 sm:p-8 pt-4 sm:pt-0 border border-white/30 relative overflow-hidden h-full">
                <div className="relative space-y-8 sm:space-y-12 mb-8 sm:mb-12">
                  {/* Vertical dashed lines between circles */}
                  <div className="absolute left-4 sm:left-6 top-[34px] sm:top-[46px] h-[90px] sm:h-[86px] border-l-2 border-dashed border-white/20"></div>
                  <div className="absolute left-4 sm:left-6 top-[125px] sm:top-[132px] h-[65px] sm:h-[86px] border-l-2 border-dashed border-white/20"></div>
                  
                  <div className="flex gap-3 sm:gap-4 relative z-10">
                    <div className="shrink-0 w-8 sm:w-12 h-8 sm:h-12 rounded-lg bg-black/40 border border-white/30 flex items-center justify-center">
                      <img src={createIcon} alt="Create Document" className="w-3 sm:w-4 h-3 sm:h-4" />
                    </div>
                    <div>
                    <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Sign Documents with Digital Signatures</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Securely sign and authenticate your documents with our digital signature platform</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 sm:gap-4 relative z-10">
                    <div className="shrink-0 w-8 sm:w-12 h-8 sm:h-12 rounded-lg bg-black/40 border border-white/30 flex items-center justify-center">
                      <img src={manageIcon} alt="Manage Documents" className="w-3 sm:w-4 h-3 sm:h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Manage Every Legal Document</h3>
                      <p className="text-gray-400 text-sm sm:text-base">Keep all your documents organized and accessible in one secure place</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 sm:gap-4 relative z-10">
                    <div className="shrink-0 w-8 sm:w-12 h-8 sm:h-12 rounded-lg bg-black/40 border border-white/30 flex items-center justify-center">
                      <img src={securityIcon} alt="Security" className="w-3 sm:w-4 h-3 sm:h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">We Strictly follow GDPR and Other Rules</h3>
                      <p className="text-gray-400 text-sm sm:text-base">Your data security and privacy are our top priorities</p>
                    </div>
                  </div>
                  
                  <div className="relative mt-8 sm:mt-5 mx-4">
                    <img 
                      src={frame58} 
                      alt="Features illustration" 
                      className="w-full object-contain scale-100 sm:scale-135"
                    />
                  </div>
                </div>
              </div>
            </div>
          
            {/* Right Section - Stats and CTA */}
            <div className="md:col-span-1 space-y-4">
              {/* Stats Box */}
              <div className="bg-black/40 rounded-lg p-6 border border-white/30 relative overflow-hidden h-[250px]">
                {/* Goal image */}
                <div className="absolute top-[45%] right-[-10%] w-48 h-48">
                  <img 
                    src={goalIcon} 
                    alt="Goal" 
                    className="w-full h-full object-contain opacity-100"
                  />
                </div>
          
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-3xl font-bold mb-2">
                    Trust us, we don't lie with our<br className="hidden sm:block" /> Numbers
                  </h3>
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-1 max-w-[80%] sm:max-w-[60%]">
                  <div>
                    <h4 className="text-3xl sm:text-4xl font-bold mb-1">
                      {counts ? `${counts.documents}+` : '...'}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-xs">
                      {counts?.days}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-3xl sm:text-4xl font-bold mb-1">
                      {counts ? `${counts.users}+` : '...'}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-xs">
                      User Accounts<br />Created
                    </p>
                  </div>
                </div>
                </div>
              </div>
          
              {/* CTA Box */}
              <div className="bg-black/40 rounded-lg p-4 sm:p-6 border border-white/30 h-[200px] sm:h-[250px]">
                <h3 className="text-lg sm:text-2xl font-bold mb-2">Upload your document with simple steps, and let us handle the headache</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-4">Upload, sign, and manage your documents effortlessly with our streamlined digital platform</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-black px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm sm:text-base hover:bg-gray-100 transition-colors"
                >
                  <img src={vectorIcon} alt="Vector" className="w-4 sm:w-5 h-4 sm:h-5" />
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyUs;