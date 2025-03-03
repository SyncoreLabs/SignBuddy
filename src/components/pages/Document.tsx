import React, { useRef, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import aiEditorImage from '../../assets/images/ai-editor.png';
import vectorIcon from '../../assets/images/Vector.png';
import { useNavigate } from 'react-router-dom';

const Document = () => {
  usePageTitle('Features');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedTypes.includes(file.type)) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await fetch('https://server.signbuddy.in/api/v1/converttoimages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();
        console.log('API Response:', data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="min-h-[calc(100vh-90px)] bg-black">
      <div className="max-w-7xl mx-auto px-4 py-0">
        {/* Existing document creator sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {/* Upload Document - Now First */}
          <div className="bg-black/40 rounded-2xl p-4 sm:p-8 border border-white/30 h-full">
            <h3 className="text-2xl font-semibold mb-1">Upload your document</h3>
            <p className="text-gray-400 mb-4 sm:mb-6">
              Upload your existing documents and get them signed in minutes
            </p>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-[2px] border-dashed ${isDragging ? 'border-white' : 'border-white/30'} rounded-xl p-8 sm:p-16 text-center mt-4 sm:mt-8 flex-1 transition-colors cursor-pointer hover:border-white`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
                accept=".pdf,.docx,.doc"
                className="hidden"
              />
              <div className="flex flex-col items-center py-4 sm:py-8">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400 mb-2">
                  Drag and Drop a file here or{' '}
                  <span className="text-white underline hover:text-gray-200">
                    Choose file
                  </span>
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">Supported formats: pdf, .docx</p>
          </div>

          {/* AI Document Creator - Now Second */}
          <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/30">
            <div className="p-4 sm:p-8">
              <h3 className="text-2xl font-semibold mb-1">AI Document Creator</h3>
              <p className="text-gray-400 mb-3">
                Create professional documents instantly with our AI-powered document generator
              </p>
              <button 
                onClick={() => navigate('')}
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
        </div>
      </div>
    </div>
  );
};

export default Document;