import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';
import Toast from '../documents/Toast';

const SignUp = () => {
  const navigate = useNavigate();
  usePageTitle('Sign Up');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [error, setError] = useState('');

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'warning' | 'error';
    visible: boolean;
  }>({ message: '', type: 'success', visible: false });

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleSignUpSuccess = (token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Check for saved document state
    const savedDocumentState = localStorage.getItem('documentState');
    const returnToDocument = localStorage.getItem('returnToDocument');
    
    if (savedDocumentState && returnToDocument) {
      const agreement = JSON.parse(savedDocumentState);
      navigate(returnToDocument, {
        state: { agreement },
        replace: true
      });
    } else {
      navigate('/profile-setup');
    }
  };

  const handleVerifyEmail = async () => {
    if (!email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    try {
      setIsEmailVerifying(true);
      setError('');

      const response = await fetch('https://server.signbuddy.in/api/v1/verifyemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Email verification failed');
      }

      setIsEmailVerified(true);
      showToast('OTP sent successfully!', 'success');
    } catch (err) {
      setError('Failed to verify email. Please try again.');
      showToast('Failed to send OTP. Please try again.', 'error');
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const handleGoogleSignup = async (response: any) => {
    try {
      const serverResponse = await fetch('https://server.signbuddy.in/api/v1/googleauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!serverResponse.ok) {
        throw new Error('Google signup failed');
      }

      const data = await serverResponse.json();
      if (data.token) {
        handleSignUpSuccess(data.token);
      }
      if (data.jwtToken) {
        localStorage.setItem('token', data.jwtToken);
        localStorage.setItem('isAuthenticated', 'true');
        

        // Set hasCompletedSetup based on navigation URL
        const isProfileSetup = data.message?.navigationUrl === '/profile-setup';
        localStorage.setItem('hasCompletedSetup', (!isProfileSetup).toString());

        if (data.message && data.message.navigationUrl) {
          navigate(data.message.navigationUrl);
        } else {
          navigate('/profile-setup');
        }
      }
    } catch (err) {
      setError('Google signup failed. Please try again.');
      showToast('Google signup failed. Please try again.', 'error');
    }
  };

  React.useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        try {
          google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleSignup,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          // Render the Google button
          google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv")!,
            { 
              type: "standard",
              theme: "outline",
              size: "large",
              text: "continue_with",
              shape: "rectangular",
              logo_alignment: "center"
            }
          );
        } catch (error) {
          console.error('Google Sign-In initialization failed:', error);
          setError('Failed to initialize Google Sign-In');
          showToast('Failed to initialize Google Sign-In. Please try again later.', 'error');
        }
      }
    };

    setTimeout(initializeGoogle, 100);
    return () => {
      if (window.google) {
        google.accounts.id.cancel();
      }
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !otp) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    try {
      setError('');
      const response = await fetch('https://server.signbuddy.in/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      if (data.token) {
        handleSignUpSuccess(data.token);
        showToast('Successfully signed up!', 'success');
      }

      if (data.jwtToken) {
        localStorage.setItem('token', data.jwtToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('hasCompletedSetup', 'false');

        // Use navigate instead of window.location.href
        if (data.message && data.message.navigationUrl) {
          navigate(data.message.navigationUrl);
        } else {
          navigate('/profile-setup'); // fallback route
        }
      } else {
        throw new Error('No token received');
      }
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex justify-center lg:justify-start">
      {/* Left Section with Illustration */}
      <div className="hidden lg:flex fixed left-0 w-1/2 h-full bg-[#18181B] p-12 flex-col justify-between">
        <div className="max-w-[720px] ml-auto h-full flex flex-col justify-between">
          <h1 className="text-2xl font-bold text-white">SignBuddy</h1>
          <div>
            <img src="/illustrations/car.png" alt="car" className="w-full max-w-xl mx-auto" />
            <blockquote className="mt-8 text-gray-400">
              <p className="text-xl text-[#DADADB]">"SignBuddy has revolutionized our document signing process. What used to take days now happens in minutes, and the interface is incredibly intuitive."</p>
              <footer className="mt-2 text-[#7A7A81]">Sarah Chen, Product Manager at TechFlow</footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Section with Form */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:ml-[50%] lg:px-20 xl:px-24">
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={5000}
          className={
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-red-500'
          }
        />
      )}
        <div className="max-w-[720px] h-full flex flex-col">
          <div className="flex justify-end pt-8 pr-4">
            <a href="/login" className="text-sm text-gray-600">
              <span className="font-semibold text-lg text-[#7A7A81] hover:text-white transition-colors">Login</span>
            </a>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-3xl font-bold text-center">Create an account</h1>
              <p className="mt-2 text-[#7A7A81] text-center">Enter the details below to create an account</p>

              <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2 pr-24"
                      disabled={isEmailVerified}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={!email || isEmailVerified || isEmailVerifying}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#7A7A81] hover:text-white transition-colors underline disabled:opacity-50"
                    >
                      verify email
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter the OTP"
                      className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2 pr-24"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={!isEmailVerified || isEmailVerifying}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#7A7A81] hover:text-white transition-colors underline disabled:opacity-50"
                    >
                      resend OTP
                    </button>
                  </div>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2"
                />

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!isEmailVerified || !password || !otp}
                  className="w-full bg-white text-black rounded-lg px-4 py-2 disabled:opacity-50"
                >
                  Sign up
                </button>

                <div className="relative my-6 flex items-center">
                  <div className="flex-grow border-t border-[#7A7A81]"></div>
                  <span className="mx-4 text-sm text-[#7A7A81]">OR CONTINUE WITH</span>
                  <div className="flex-grow border-t border-[#7A7A81]"></div>
                </div>

                <div 
                    id="googleSignInDiv" 
                    className="w-full flex items-center justify-center bg-transparent text-[#E3E3E3] rounded-lg font-['Roboto'] font-medium text-sm leading-5"
                  ></div>

                <p className="text-sm text-center text-[#7A7A81]">
                  By proceeding forward, you agree to our{' '}<br />
                  <a href="/termsandconditions" className="text-[#7A7A81] hover:underline">Terms and Conditions</a>
                  {' '}and{' '}
                  <a href="/privacypolicy" className="text-[#7A7A81] hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;