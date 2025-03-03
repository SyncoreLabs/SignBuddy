import React from 'react';
import uploadIcon from '../../assets/images/upload-doc.png';
import mailIcon from '../../assets/images/mail-doc.png';
import signIcon from '../../assets/images/sign-doc.png';
import FrameY from '../../assets/images/Frame-y.png';
import FrameX from '../../assets/images/Frame-x.png';
import FrameZ from '../../assets/images/Frame-z.png';

const Steps: React.FC = () => {
  return (
    <div className="max-w-7xl mt-8 mb-16 sm:mt-20 mx-auto px-4 py-10 pt-5">
      <div className="flex flex-col md:flex-row items-start gap-5 sm:gap-20">
        <div className="flex-1 max-w-lg">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Get your document Completed in
            <br className="sm:hidden" /> 3 simple steps
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-md mt-2 max-w-[280px] sm:max-w-none">
            Experience seamless document signing with our intuitive platform.
            Start managing your documents efficiently today.
          </p>
          {/*<button className="text-blue-500 text-sm sm:text-sm lg:text-base mt-1 hover:underline">
            Create your First Document
          </button> */}
        </div>

        <div className="flex-1 flex flex-col sm:flex-row justify-start gap-8 sm:gap-8">
          <div className="text-left max-w-full sm:max-w-[250px]">
            <div className="mb-1">
              <img
                src={uploadIcon}
                alt="Upload Document"
                className="w-10 h-10 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <h3 className="text-lg sm:text-lg font-semibold mb-1 whitespace-nowrap">
              Upload/Create a doc(AI)
            </h3>
            <p className="text-gray-400 text-sm sm:text-sm">
              Upload your custom documents or create one using our AI powered
              features
            </p>
          </div>

          <div className="text-left max-w-full sm:max-w-[200px]">
            <div className="mb-1">
              <img
                src={mailIcon}
                alt="Mail Document"
                className="w-10 h-10 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <h3 className="text-lg sm:text-lg font-semibold mb-1">
              Mail the doc
            </h3>
            <p className="text-gray-400 text-sm sm:text-sm max-w-[320px] sm:max-w-none">
              Send documents to multiple recipients at once with a single click
            </p>
          </div>

          <div className="text-left max-w-full sm:max-w-[200px]">
            <div className="mb-1">
              <img
                src={signIcon}
                alt="Sign Document"
                className="w-10 h-10 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <h3 className="text-lg sm:text-lg font-semibold mb-1">
              Get it signed
            </h3>
            <p className="text-gray-400 text-sm sm:text-sm max-w-[330px] sm:max-w-none">
              Track signatures in real-time and get instant notifications.
            </p>
          </div>
        </div>
      </div>


      {/* Image section */}
      <div className="mt-6 relative">
        <div className="bg-[#111111] rounded-lg p-4 sm:p-6 overflow-hidden">
          <div className="relative z-10 flex justify-start items-start min-h-[200px] sm:min-h-[300px]">
            {/* Card 3 (Back) */}
            <div className="absolute transform translate-x-32 sm:translate-x-48 md:translate-x-96 translate-y-8 sm:translate-y-16">
              <img
                src={FrameZ}
                alt="Frame Z"
                className="w-[300px] sm:w-[400px] md:w-[700px] h-auto shadow-lg rounded-md"
              />
            </div>

            {/* Card 2 (Middle) */}
            <div className="absolute transform translate-x-16 sm:translate-x-24 md:translate-x-48 translate-y-4 sm:translate-y-8">
              <img
                src={FrameX}
                alt="Frame Y"
                className="w-[300px] sm:w-[400px] md:w-[700px] h-auto shadow-lg rounded-md"
              />
            </div>

            {/* Card 1 (Front) */}
            <div className="relative">
              <img
                src={FrameY}
                alt="Frame X"
                className="w-[300px] sm:w-[400px] md:w-[700px] h-auto shadow-lg rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 text-start">
        <h2 className="text-l">
          <span className="text-gray-400">Replaces </span>
          <span className="text-blue-500">Google Docs</span>
          <span className="text-gray-400">, and Infinite number of </span>
          <span className="text-blue-500">other Softwares</span>
          <span className="text-gray-400"> that are expensive and Complex</span>
        </h2>
      </div>
    </div>
  );
};

export default Steps;