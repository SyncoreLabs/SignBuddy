import React from 'react';
import { useNavigate } from 'react-router-dom';

import aiEditorImage from '../../assets/images/ai-editor.png';
import vectorIcon from '../../assets/images/Vector.png';

const DocumentCreator: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-0">
      <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold">
        Create Your E-Signature<br />Document Faster
      </h2>
      <p className="text-gray-400 pb-4 text-xs sm:text-base lg:text-lg mt-2 max-w-[370px] sm:max-w-none">
        Experience seamless document creation and signing with our intuitive platform
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-0">
        {/* AI Document Creator */}
        <div className="bg-black/40 rounded-lg overflow-hidden border border-white/30">
          <div className="p-4 sm:p-8">
            <h3 className="text-2xl font-semibold mb-1">AI Document Creator</h3>
            <p className="text-gray-400 mb-3">
              Create professional documents instantly with our AI-powered document generator
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-white text-black px-2 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <img src={vectorIcon} alt="Vector" className="w-5 h-5" />
              Coming Soon
            </button>
          </div>
          <div className="relative overflow-hidden">
            <img 
              src={aiEditorImage} 
              alt="AI Document Creator" 
              className="w-[140%] -ml-[15%] max-w-none"
            />
          </div>
        </div>

        {/* Upload Document */}
        <div className="bg-black/40 rounded-lg p-4 sm:p-8 border border-white/30 h-full">
          <h3 className="text-2xl font-semibold mb-1">Upload your document</h3>
          <p className="text-gray-400 mb-4 sm:mb-6">
            Upload your existing documents and get them signed in minutes
          </p>
          {/* Upload Document section */}
          <div 
            onClick={handleUploadClick}
            className="border-[2px] border-dashed border-white/30 rounded-lg p-8 sm:p-16 text-center mt-4 sm:mt-8 flex-1 cursor-pointer hover:border-white/50 transition-all"
          >
            <div className="flex flex-col items-center py-4 sm:py-8">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 mb-2">Drag and Drop a file here or <span className="text-white underline">Choose file</span></p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Supported formats: pdf, .docx</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCreator;