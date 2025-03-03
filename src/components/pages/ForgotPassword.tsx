import React, { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  usePageTitle('Forgot Password');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);

  const handleSendOTP = async () => {
    try {
      setIsEmailVerifying(true);
      setError('');

      const response = await fetch('https://server.signbuddy.in/api/v1/forgotPassword', {  // Updated URL case
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://server.signbuddy.in/api/v1/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Password reset failed');
      }

      // Redirect to login page after successful password reset
      navigate('/login');
    } catch (err) {
      setError('Password reset failed. Please try again.');
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
            <a href="/login" className="text-sm text-gray-600">
              <span className="font-semibold text-lg text-[#7A7A81] hover:text-white transition-colors">Back to Login</span>
            </a>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-3xl font-bold text-center">Reset Password</h1>
              <p className="mt-2 text-[#7A7A81] text-center">
                {step === 1 
                  ? "Enter your email to receive a reset code" 
                  : "Enter the code and your new password"}
              </p>

              <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={!email || isEmailVerifying}
                      className="w-full bg-white text-black rounded-lg px-4 py-2 disabled:opacity-50"
                    >
                      {isEmailVerifying ? 'Sending...' : 'Send Reset Code'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2"
                    />
                    <button
                      type="submit"
                      disabled={!otp || !newPassword}
                      className="w-full bg-white text-black rounded-lg px-4 py-2 disabled:opacity-50"
                    >
                      Reset Password
                    </button>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;