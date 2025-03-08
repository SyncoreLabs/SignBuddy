import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Add this interface at the top of your file
interface EmailTemplate {
  subject: string;
  message: string;
  recipientNames: string[];
  recipientEmails: string[];
  documentName: string;
  recipients: any[];  // You might want to type this more specifically
  ccRecipients: string[];
  image: any;  // You might want to type this more specifically
  placeholderData: any;  // You might want to type this more specifically
  fileKey: string;
}

const EmailComposePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    documentName,
    recipientNames,
    recipientEmails,
    imageUrls,
    placeholderData,
    fileKey
  } = location.state?.data || {};
  const [ccInput, setCcInput] = useState('');
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({
    subject: `Please complete the ${documentName || 'document'}`,
    message: `Hey there,

I have formulated the agreement as discussed earlier. Please go through the document and complete the signing here. Just tap on the document and get it done. You don't need to send it back to me it will be automatically sent to me.

Thank you.

Please click anywhere below to complete the document.`,
    recipientNames: recipientNames || [],
    recipientEmails: recipientEmails || [],
    documentName: documentName || '',
    recipients: recipientEmails || [], // Using recipientEmails as recipients
    ccRecipients: [],
    image: imageUrls?.[0] || '',
    placeholderData: placeholderData || [],
    fileKey: fileKey || ''
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://server.signbuddy.in/api/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");
        const { user } = await response.json();

        if (user) {
          setUserDetails({
            name: user.userName || 'User',
            email: user.email || 'user@signbuddy.com',
            avatar: user.avatar || '/avatars/1.svg'
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
 console.log(location.state?.data);
  useEffect(() => {
    if (!location.state?.data?.fileKey || !location.state?.data?.recipientEmails) {
      navigate('/dashboard');
      return;
    }

    // Initialize with data from location state
    setEmailTemplate(prev => ({
      ...prev,
      documentName: location.state.data.documentName,
      image: location.state.data.imageUrls[0],
      placeholderData: location.state.data.placeholderData,
      fileKey: location.state.data.fileKey
    }));
  }, [location.state, navigate]);

  const handleEmailChange = (field: keyof typeof emailTemplate, value: string) => {
    setEmailTemplate(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Prepare the data according to the required format
      const requestData = {
        emails: emailTemplate.recipientEmails,
        CC: emailTemplate.ccRecipients,
        names: emailTemplate.recipientNames,
        customEmail: {
          subject: emailTemplate.subject,
          emailBody: emailTemplate.message
        },
        placeholders: emailTemplate.placeholderData,
        fileKey: emailTemplate.fileKey
      };
  
      console.log('Sending data to backend:', requestData); // Debug log
  
      const response = await fetch(
        "https://server.signbuddy.in/api/v1/sendagreement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send agreement");
      }

      navigate("/email-success", {
        state: {
          documentTitle: emailTemplate.documentName
        }
      });
    } catch (error) {
      console.error("Error sending agreement:", error);
      // Add error handling here (e.g., show error toast)
    }
  };

  const handleAddCc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && ccInput.trim() && isValidEmail(ccInput)) {
      setEmailTemplate(prev => ({
        ...prev,
        ccRecipients: [...prev.ccRecipients, ccInput.trim()]
      }));
      setCcInput('');
    }
  };

  const handleRemoveCc = (indexToRemove: number) => {
    setEmailTemplate(prev => ({
      ...prev,
      ccRecipients: prev.ccRecipients.filter((_, index) => index !== indexToRemove)
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
            <div className="flex flex-wrap items-center gap-2 p-3 border border-white/30 rounded-lg mb-4 relative">
              {emailTemplate.ccRecipients.map((email, index) => (
                <div
                  key={index}
                  className="group bg-[#212121] px-3 py-1.5 rounded text-sm text-white flex items-center w-fit"
                >
                  <span className="truncate group-hover:max-w-[calc(100%-20px)] max-w-full transition-all">
                    {email}
                  </span>
                  <button
                    onClick={() => handleRemoveCc(index)}
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
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyDown={handleAddCc}
                placeholder="Enter CC email and press Enter"
                className="flex-1 min-w-[200px] bg-transparent outline-none text-sm pr-8"
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Add CC"
              >
                <span className="text-sm font-medium">Cc</span>
              </div>
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
              <span>This action will cost 10 Credits</span>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
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
                <img
                  src={userDetails.avatar}
                  alt={`${userDetails.name}'s Profile`}
                  className="w-12 h-12 rounded-full object-cover bg-gray-800"
                  onError={(e) => {
                    e.currentTarget.src = '/avatars/1.svg';
                  }}
                />
                <div>
                  <div className="font-semibold text-white">
                    {userDetails.name} via SignBuddy
                  </div>
                  <div className="text-sm text-gray-400">
                  {userDetails.email}
                  </div>
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