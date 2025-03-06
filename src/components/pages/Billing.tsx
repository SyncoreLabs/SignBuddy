import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import lightningIcon from '../../assets/images/credits-icon.png';
import infinity from '../../assets/images/infinite.png';

interface CreditHistory {
  thingUsed: string;
  creditsUsed: number;
  timestamp: string;
  _id: string;
}

interface Subscription {
  type: string;
  endDate: string | null;
  timeStamp: string;
}

const Billing = () => {
  usePageTitle('Billing');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = 15; // Replace with actual total count from your data
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [activeSubscription, setActiveSubscription] = useState<{
    isActive: boolean;
    expiryDate?: string;
    type?: string;
    credits?: number;
  }>({ isActive: false });
  const [creditsHistory, setCreditsHistory] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [totalCredits, setTotalCredits] = useState(0);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const navigateToPricing = () => {
    window.location.href = '/pricing';
  };

  useEffect(() => {
    // Fetch user's subscription status
    const subscriptionStatus = localStorage.getItem('subscriptionStatus');
    if (subscriptionStatus) {
      setActiveSubscription(JSON.parse(subscriptionStatus));
    }
  }, []);

  useEffect(() => {
    const fetchCreditsHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://server.signbuddy.in/api/v1/getcredits', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch credits history');
        
        const data = await response.json();
        setTotalCredits(data.credits);
        setCreditsHistory(data.creditsHistory || []);
        setSubscription(data.subsription);
      } catch (error) {
        console.error('Error fetching credits history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditsHistory();
  }, []);

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="bg-black min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold mb-0">Billing</h1>
          <p className="text-gray-400 text-sm">Manage all your subscriptions, credits at one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4 lg:pr-4 h-auto lg:h-[500px]">
            {/* Current Plan Card */}
            <div className="bg-black/40 rounded-xl border border-white/30 p-3">
              <div className="inline-block px-2 py-0.5 bg-amber-400 text-black rounded-full text-sm font-medium mb-2">
                Current plan
              </div>
              {subscription?.type === 'free' ? (
                <>
                  <h2 className="text-lg font-semibold mb-1">Free Plan</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Limited features with basic functionality
                  </p>
                  <button
                    onClick={navigateToPricing}
                    className="w-full py-2 px-4 bg-white hover:white text-black rounded-lg transition-colors"
                  >
                    Upgrade Plan
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-1">
                    {subscription?.type === 'monthly' ? 'monthly' : 'annually'} Plan
                  </h2>
                  <p className="text-gray-400 text-sm mb-2">
                    For teams who needs multiple documents and will have multiple users to manage legalities
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center text-sm">
                    Expires on {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                  </div>
                </>
              )}
            </div>

            {/* Billing History */}
            <div className="bg-black/40 rounded-xl border border-white/30 p-3 lg:overflow-y-auto h-auto lg:h-auto lg:flex-1">
              <h2 className="text-lg font-semibold mb-2">Billing History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-gray-400 font-medium">Plan name</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Amount</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 text-gray-400 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-3">Monthly Plan - {['Jun', 'May', 'Apr', 'Mar', 'Feb'][index]}, 2024</td>
                        <td className="py-3">₹ 699</td>
                        <td className="py-3">Feb 14, 2024</td>
                        <td className="py-3">
                          <button className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-lg text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Page {currentPage} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange('prev')}
                      disabled={currentPage === 1}
                      className={`p-1 rounded border border-white/30 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handlePageChange('next')}
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded border border-white/30 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Usage Stats */}
          <div className="bg-black/40 rounded-xl border border-white/30 p-3 flex flex-col h-auto lg:h-[608px]">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center p-4 bg-[#1C1C1E] rounded-lg mb-3">
                <div className="text-center">
                  <img
                    src={infinity}
                    alt="Infinite Credits"
                    className="w-32 h-24 mx-auto mb-2"
                  />
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="w-4 h-4 flex items-center justify-center rounded-full border border-gray-400 text-xs">i</span>
                    <p>Monthly plan gives infinite credits to burn</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto h-[300px] lg:h-auto lg:flex-1 pr-2">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                [...creditsHistory].reverse().map((item, index) => (
                  <div key={item._id} className="flex items-center justify-between group">
                    <div>
                      <h3 className="text-lg font-medium">
                        {item.thingUsed === 'documentSent' ? 'Document Sent' :
                         item.thingUsed === 'monthly refilled' ? 'Monthly Refresh' :
                         item.thingUsed === 'purchased' ? 'Credits Purchased' : item.thingUsed}
                      </h3>
                      <p className="text-gray-500">
                        {item.thingUsed === 'documentSent' ? 'Document has been sent' :
                         item.thingUsed === 'monthly refilled' ? 'Monthly credit refresh' :
                         item.thingUsed === 'purchased' ? 'Purchased credits' : ''}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                        item.thingUsed === 'documentSent' ? 'bg-[#2C1212] text-[#FF4747]' : 'bg-[#122C12] text-[#47FF47]'
                      }`}>
                        <img src={lightningIcon} alt="Credits" className="w-4 h-4" />
                        {item.creditsUsed}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;