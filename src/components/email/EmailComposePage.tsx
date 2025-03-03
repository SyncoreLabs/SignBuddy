import React, { useState } from 'react';

const EmailComposePage: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'Please complete the SCP2_developer_agreement',
    message: `Hey there,

Saritha here, I hope everything is fine, I have formulated the agreement as discussed earlier. Please go through the document and complete the signing here. Just tap on the document and get it done. You don't need to send it back to me it will be automatically sent to me.

Thank you.

Please click anywhere below to complete the document.`,
    documentName: 'SCP2_developer_agreement',
    recipients: ['lokesh@syncore.in', 'suresh@syncore.in'],
    image: "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-01.jpg",
  });

  const handleEmailChange = (field: keyof typeof emailTemplate, value: string) => {
    setEmailTemplate(prev => ({ ...prev, [field]: value }));
  };

  // Update the references in the JSX to use emailTemplate
  // e.g., emailTemplate.subject, emailTemplate.message, etc.
  const emails = ['lokesh@syncore.in', 'suresh@syncore.in'];
  const [image, setimage] = useState('SCP2_developer_agreement');
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && emailInput.trim() && isValidEmail(emailInput)) {
      setEmailTemplate(prev => ({
        ...prev,
        recipients: [...prev.recipients, emailInput.trim()]
      }));
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (indexToRemove: number) => {
    setEmailTemplate(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
          {/* Left Side - Compose Section */}
          <div className="w-full md:w-2/4 p-4 md:p-8">
            <h2 className="text-xl font-semibold mb-2">Compose your email</h2>
            <p className="text-gray-400 text-sm mb-6">This is how your mail will look like in the recipient's inbox</p>

            {/* Recipients Display */}
            <div className="flex flex-wrap items-center gap-2 p-3 border border-white/30 rounded-lg mb-4">
              {emailTemplate.recipients.map((email, index) => (
                <div
                  key={index}
                  className="group bg-[#212121] px-3 py-1.5 rounded text-sm text-white flex items-center w-fit"
                >
                  <span className="truncate group-hover:max-w-[calc(100%-20px)] max-w-full transition-all">
                    {email}
                  </span>
                  <button
                    onClick={() => handleRemoveEmail(index)}
                    className="text-gray-400 hover:text-white ml-1 md:w-0 md:group-hover:w-4 overflow-hidden transition-all"
                    aria-label="Remove email"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleAddEmail}
                placeholder={emailInput ? '' : "Enter email and press Enter"}
                className="flex-1 min-w-[200px] bg-transparent outline-none text-sm"
              />
            </div>

            {/* Subject Input */}
            <input
              type="text"
              value={emailTemplate.subject}
              onChange={(e) => handleEmailChange('subject', e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-lg mb-4"
            />

            {/* Message Input */}
            <div className="h-[calc(100%-100px)] md:h-[calc(100%-340px)]">
              <textarea
                value={emailTemplate.message}
                onChange={(e) => handleEmailChange('message', e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-full p-4 bg-transparent border border-white/30 rounded-lg resize-none"
              />
            </div>

            {/* Credits Info */}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>A mail would cost 10 Credits</span>
            </div>

            {/* Send Button */}
            <button className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
              Send ➤
            </button>
          </div>

          {/* Right Side - Preview Section */}
          <div className="hidden md:block w-full md:w-2/4 p-4 md:p-8">
            <h2 className="text-xl font-semibold mb-2">Preview of your email</h2>
            <p className="text-gray-400 text-sm mb-6">This is how your mail will look like in the recipient's inbox</p>

            <div className="bg-black overflow-y-auto max-h-[600px] rounded-lg p-6 border border-white/30">
              {/* Sender Info */}
              <div className="flex items-center gap-4 mb-6">
                <img src="/avatars/1.svg" alt="Profile" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-semibold">Saritha Sharma via SignBuddy</div>
                  <div className="text-sm text-gray-400">signbuddydocs@signbuddy.com</div>
                </div>
              </div>

              {/* Subject */}
              <h3 className="text-lg font-semibold mb-4">{emailTemplate.subject || 'No subject'}</h3>

              {/* Message Content */}
              <div className="text-gray-300 whitespace-pre-wrap">
                {emailTemplate.message || 'No content'}
              </div>

              {/* Document Preview */}
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex justify-center">
                  <img
                    src={emailTemplate.image}
                    alt="Document Preview"
                    className="w-[200px] h-[282px] object-cover rounded-lg border border-white/10"
                  />
                </div>
                <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                  Complete the document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailComposePage;