import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  usePageTitle('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleGoogleLogin = async (response: any) => {
    try {
      const serverResponse = await fetch('https://server.signbuddy.in/api/v1/googleauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!serverResponse.ok) {
        throw new Error('Google login failed');
      }

      const data = await serverResponse.json();
      if (data.jwtToken) {
        localStorage.setItem('token', data.jwtToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('hasCompletedSetup', 'true');
        localStorage.setItem('authMethod', 'google');

        // Navigate to the URL provided in the response
        if (data.message && data.message.navigationUrl) {
          navigate(data.message.navigationUrl);
        }
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    }
  };

  React.useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        try {
          google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true
          });
          
          // Render the Google button
          google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            { 
              type: "standard",
              theme: "outline",
              size: "large",
              width: "100%",
              text: "continue_with",
              shape: "rectangular",
              logo_alignment: "center"
            }
          );
        } catch (error) {
          console.error('Google Sign-In initialization failed:', error);
          setError('Failed to initialize Google Sign-In');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!email) {
        setError('Please enter your email');
        return;
      }
      setStep(2);
      return;
    }

    try {
      const response = await fetch('https://server.signbuddy.in/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.jwtToken) {
        localStorage.setItem('token', data.jwtToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('hasCompletedSetup', 'true');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setStep(1);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex justify-center lg:justify-start">
      {/* Left Section with Illustration */}
      <div className="hidden lg:flex fixed left-0 w-1/2 h-full bg-[#18181B] p-12 flex-col justify-between">
        <div className="max-w-[720px] ml-auto h-full flex flex-col justify-between">
          <h1 className="text-2xl font-bold text-white">SignBuddy</h1>
          <div>
            <img src="/illustrations/public.png" alt="public" className="w-full max-w-xl mx-auto" />
            <blockquote className="mt-8 text-gray-400">
              <p className="text-xl text-[#DADADB]">"SignBuddy has revolutionized our document signing process. What used to take days now happens in minutes, and the interface is incredibly intuitive."</p>
              <footer className="mt-2 text-[#7A7A81]">Sarah Chen, Product Manager at TechFlow</footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Section with Form */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:ml-[50%] lg:px-20 xl:px-24">
        <div className="max-w-[720px] h-full flex flex-col">
          <div className="flex justify-end pt-8 pr-4">
            <a href="/signup" className="text-sm text-gray-600">
              <span className="font-semibold text-lg text-[#7A7A81] hover:text-white transition-colors">Sign up</span>
            </a>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-3xl font-bold text-center">Welcome back</h1>
              <p className="mt-2 text-[#7A7A81] text-center">Enter your credentials to access your account</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {step === 1 ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2"
                  />
                ) : (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[#7A7A81] hover:text-white transition-colors"
                    >
                      ← Back to email
                    </button>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2"
                      />
                      <div className="flex justify-end">
                        <a
                          href="/forgotpassword"
                          className="text-sm text-[#7A7A81] hover:text-white transition-colors"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-white text-black rounded-lg px-4 py-2"
                >
                  {step === 1 ? 'Continue' : 'Login'}
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

export default Login;