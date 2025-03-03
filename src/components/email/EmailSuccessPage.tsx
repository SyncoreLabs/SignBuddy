import React from 'react';

// At the top of the file, add the import
import pdfIcon from '../../assets/images/PDF.png';

const EmailSuccessPage: React.FC = () => {
    return (
        <div className=" bg-black overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
                <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center">
                    {/* Progress Steps */}
                    {/* Progress Steps - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-8 mb-16">
                        {/* Email Sent */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-[#DADADB] bg-opacity-10 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-[#DADADB] bg-opacity-20 flex items-center justify-center">
                                        <div className="w-4 h-4 text-xs rounded-full border-2 border-white flex items-center justify-center text-white">
                                            ✓
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <span className="text-lg font-medium block">Email sent</span>
                                    <span className="text-sm text-gray-500 block max-w-[200px]">
                                        The email along with the link to view and complete the agreement has been sent
                                    </span>
                                </div>
                            </div>
                            <div className="w-24 border-t border-dashed border-[#DADADB] border-opacity-20" />
                        </div>

                        {/* Viewed & Verified */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-[#DADADB] bg-opacity-10 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-[#DADADB] bg-opacity-20 flex items-center justify-center">
                                        <div className="w-4 h-4 text-xs rounded-full border-2 border-white flex items-center justify-center text-white">
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <span className="text-lg font-medium block">Viewed & verified</span>
                                    <span className="text-sm text-gray-500 block max-w-[200px]">
                                        The agreement has been viewed along with the email and yet to be signed.
                                    </span>
                                </div>
                            </div>
                            <div className="w-24 border-t border-dashed border-[#DADADB] border-opacity-20" />
                        </div>

                        {/* Signed & Completed */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-[#DADADB] bg-opacity-10 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-[#DADADB] bg-opacity-20 flex items-center justify-center">
                                        <div className="w-4 h-4 text-xs rounded-full border-2 border-white flex items-center justify-center text-white">
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <span className="text-lg font-medium block">Signed & completed</span>
                                    <span className="text-sm text-gray-500 block max-w-[200px]">
                                        The document has been successfully signed by all the persons specified.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="bg-black p-4 sm:p-6 rounded-lg w-[90%] sm:max-w-md border border-white/30 relative">
                        {/* Header with close button */}
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl sm:text-xl font-semibold">Your document is ready</h2>
                            <button className="text-white/60 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mb-6 text-left">You can see the updates of this document in your Dashboard.</p>

                        {/* Success Icon */}
                        <div className="w-12 h-12 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h3 className="text-lg font-semibold mb-2 text-center">Sent Successfully</h3>
                            <p className="text-sm text-gray-400 mb-6 text-center">
                                You mail is sent and you will receive an email when the other person has viewed or signed the document.
                            </p>
                        </div>

                        {/* Document Download Section */}
                        <div className="flex flex-col p-3 bg-[#111] rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm text-white">SCP2_Developer_Agreement</span>
                                    <button className="text-xs text-gray-400 hover:text-white underline text-left">
                                        Click to download
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <img 
                                        src={pdfIcon} 
                                        alt="PDF file" 
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailSuccessPage;